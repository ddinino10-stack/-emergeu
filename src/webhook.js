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
 
// Get user ID from metadata first, fall back to email lookup
const getUserId = async (stripeObject) => {
  // Try metadata first (works if they used checkout session)
  if (stripeObject.metadata?.supabase_user_id) {
    return stripeObject.metadata.supabase_user_id;
  }
 
  // Fall back to email lookup (works for payment link users)
  const customer = await stripe.customers.retrieve(stripeObject.customer);
  const email = customer.email;
  if (!email) return null;
 
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  return user?.id || null;
};
 
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
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
 
  const obj = event.data.object;
 
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sub = await stripe.subscriptions.retrieve(obj.subscription);
        const uid = await getUserId(sub);
        if (uid) {
          await supabase.from('subscriptions').upsert([{
            user_id: uid,
            plan: 'pro',
            status: 'active',
            created_at: new Date().toISOString()
          }], { onConflict: 'user_id' });
          console.log(`Pro unlocked for user ${uid}`);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const uid = await getUserId(obj);
        if (uid) {
          await supabase.from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', uid);
          console.log(`Pro cancelled for user ${uid}`);
        }
        break;
      }
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: err.message });
  }
};