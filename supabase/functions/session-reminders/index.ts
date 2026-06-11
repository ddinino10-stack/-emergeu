import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''

const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'EmergeU <emergeu@emergeu.co.uk>',
      to: [to],
      subject,
      html
    })
  })
  return res.json()
}

const getReminderLabel = (hoursUntil: number) => {
  if (hoursUntil <= 1) return 'starting in 30 minutes'
  if (hoursUntil <= 3) return 'starting in 2 hours'
  return 'tomorrow'
}

Deno.serve(async () => {
  const now = new Date()
  const in30min = new Date(now.getTime() + 30 * 60 * 1000)
  const in2hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const in24hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  // Get all confirmed upcoming bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .gte('date', now.toISOString().split('T')[0])

  if (!bookings || bookings.length === 0) {
    return new Response(JSON.stringify({ message: 'No upcoming bookings' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let emailsSent = 0

  for (const booking of bookings) {
    const sessionDateTime = new Date(`${booking.date}T${booking.time}:00`)
    const hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Check if this booking falls in one of our reminder windows
    const is30min = hoursUntil > 0 && hoursUntil <= 0.75
    const is2hours = hoursUntil > 1.5 && hoursUntil <= 2.5
    const is24hours = hoursUntil > 23 && hoursUntil <= 25

    if (!is30min && !is2hours && !is24hours) continue

    const label = getReminderLabel(hoursUntil)
    const dateStr = new Date(booking.date).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })

    // Get client email
    const { data: clientData } = await supabase.auth.admin.getUserById(booking.client_id)
    const { data: ptData } = await supabase.auth.admin.getUserById(booking.pt_id)

    const clientEmail = clientData?.user?.email
    const ptEmail = ptData?.user?.email

    const emailHtml = (name: string, role: string, otherName: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
        <img src="https://www.emergeu.co.uk/logo.jpg" alt="EmergeU" style="height: 60px; border-radius: 8px; margin-bottom: 24px;" />
        <h1 style="color: #FF6B00; margin-bottom: 8px;">Session Reminder 💪</h1>
        <p style="color: #ccc; font-size: 18px;">Hi ${name},</p>
        <p style="color: #ccc;">Your ${booking.session_type} session is <strong style="color: #FF6B00;">${label}</strong>!</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #888; margin: 0 0 8px 0;">📅 <strong style="color: white;">${dateStr}</strong></p>
          <p style="color: #888; margin: 0 0 8px 0;">⏰ <strong style="color: white;">${booking.time}</strong></p>
          <p style="color: #888; margin: 0 0 8px 0;">🏋️ <strong style="color: white;">${booking.session_type}</strong></p>
          <p style="color: #888; margin: 0;">👤 <strong style="color: white;">${role === 'client' ? 'PT' : 'Client'}: ${otherName}</strong></p>
        </div>
        ${booking.notes ? `<p style="color: #888;">📝 Notes: ${booking.notes}</p>` : ''}
        <a href="https://www.emergeu.co.uk" style="display: inline-block; background: #FF6B00; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: bold; margin-top: 16px;">Open EmergeU 🚀</a>
        <p style="color: #555; font-size: 12px; margin-top: 30px;">EmergeU — Become Unrecognisable</p>
      </div>
    `

    if (clientEmail) {
      await sendEmail(
        clientEmail,
        `⏰ Session Reminder — ${booking.session_type} ${label}`,
        emailHtml(booking.client_name, 'client', booking.pt_name)
      )
      emailsSent++
    }

    if (ptEmail) {
      await sendEmail(
        ptEmail,
        `⏰ Session Reminder — ${booking.session_type} with ${booking.client_name} ${label}`,
        emailHtml(booking.pt_name, 'pt', booking.client_name)
      )
      emailsSent++
    }
  }

  return new Response(JSON.stringify({ message: `Sent ${emailsSent} reminder emails` }), {
    headers: { 'Content-Type': 'application/json' }
  })
})