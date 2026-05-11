// api/webhook.js
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports.config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const obj = event.data.object;

  const getUserId = async (subscription) => {
    if (subscription.metadata?.supabase_user_id) return subscription.metadata.supabase_user_id;
    const customer = await stripe.customers.retrieve(subscription.customer);
    return customer.metadata?.supabase_user_id;
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sub = await stripe.subscriptions.retrieve(obj.subscription);
        const uid = await getUserId(sub);
        if (uid) await supabase.from('profiles').update({
          stripe_subscription_id: sub.id,
          subscription_status: 'pro',
          subscription_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('id', uid);
        break;
      }
      case 'customer.subscription.deleted': {
        const uid = await getUserId(obj);
        if (uid) await supabase.from('profiles').update({
          subscription_status: 'free',
          stripe_subscription_id: null,
        }).eq('id', uid);
        break;
      }
    }
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};