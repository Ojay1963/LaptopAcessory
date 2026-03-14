import { env } from './env.js'

const paystackBaseUrl = 'https://api.paystack.co'

export async function initializePaystackTransaction({ email, amount, reference, metadata }) {
  if (!env.paystackSecretKey) {
    return {
      provider: 'paystack',
      initialized: false,
      authorizationUrl: '',
      accessCode: '',
      reference,
      message: 'Paystack is not configured.',
    }
  }

  const response = await fetch(`${paystackBaseUrl}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
      reference,
      callback_url: env.paystackCallbackUrl || undefined,
      metadata,
    }),
  })

  const payload = await response.json()
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Unable to initialize Paystack transaction.')
  }

  return {
    provider: 'paystack',
    initialized: true,
    authorizationUrl: payload.data.authorization_url,
    accessCode: payload.data.access_code,
    reference: payload.data.reference,
  }
}

export async function verifyPaystackTransaction(reference) {
  if (!env.paystackSecretKey) {
    return {
      configured: false,
      paid: false,
      reference,
      gatewayResponse: 'Paystack is not configured.',
    }
  }

  const response = await fetch(`${paystackBaseUrl}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      Accept: 'application/json',
    },
  })
  const payload = await response.json()

  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Unable to verify Paystack transaction.')
  }

  return {
    configured: true,
    paid: payload.data.status === 'success',
    reference: payload.data.reference,
    amount: payload.data.amount,
    gatewayResponse: payload.data.gateway_response,
    channel: payload.data.channel,
    paidAt: payload.data.paid_at,
    customerEmail: payload.data.customer?.email,
  }
}
