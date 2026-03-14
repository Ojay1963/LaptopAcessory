import { env, isProduction } from './env.js'

export async function sendOtpEmail({ toEmail, toName, otp, purpose }) {
  if (!env.brevoApiKey) {
    return {
      delivered: false,
      fallback: true,
      debugOtp: isProduction ? undefined : otp,
      message: 'Brevo API key is not configured.',
    }
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': env.brevoApiKey,
    },
    body: JSON.stringify({
      sender: {
        email: env.brevoSenderEmail,
        name: env.brevoSenderName,
      },
      to: [{ email: toEmail, name: toName || toEmail }],
      subject: `Your OJ Devices ${purpose} OTP`,
      htmlContent: `<p>Your one-time password is <strong>${otp}</strong>.</p><p>It expires in ${env.otpTtlMinutes} minutes.</p>`,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Brevo send failed: ${detail}`)
  }

  return {
    delivered: true,
    fallback: false,
  }
}
