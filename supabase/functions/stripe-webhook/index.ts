import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
      undefined,
      cryptoProvider
    )
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const email = session.customer_details?.email

    if (email) {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find((u: any) => u.email === email)
      if (user) {
        await supabase.from('subscriptions').upsert([{
          user_id: user.id,
          plan: 'pro',
          status: 'active',
          created_at: new Date().toISOString()
        }], { onConflict: 'user_id' })
        console.log(`Pro unlocked for ${email}`)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customer = await stripe.customers.retrieve(
      (event.data.object as any).customer
    ) as any
    const email = customer.email
    if (email) {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find((u: any) => u.email === email)
      if (user) {
        await supabase.from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', user.id)
        console.log(`Pro cancelled for ${email}`)
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})