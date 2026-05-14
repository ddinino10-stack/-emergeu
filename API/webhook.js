// api/webhook.js
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
 
const getUserId = async (stripeObject) => {
  if (stripeObject.metadata?.supabase_user_id) {
    return stripeObject.metadata.supabase_user_id;
  }
  const customer = await stripe.customers.retrieve(stripeObject.customer);
  const email = customer.email;
  if (!email) return null;
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  return user?.id || null;
};
 
module.exports = async function handler(req, res) {
  // Allow all methods for debugging
  res.setHeader('Allow', 'POST');
 
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
 
  // Use req.body directly (Vercel parses JSON automatically)
  const event = req.body;
 
  if (!event || !event.type) {
    return res.status(400).json({ error: 'Invalid event' });
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
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: err.message });
  }
};