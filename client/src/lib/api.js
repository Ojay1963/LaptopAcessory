const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || ''
const apiBaseUrl = rawApiBaseUrl.endsWith('/') ? rawApiBaseUrl.slice(0, -1) : rawApiBaseUrl
const AUTH_TOKEN_KEY = 'oj_auth_token'
const REFRESH_TOKEN_KEY = 'oj_refresh_token'

export function getStoredToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

export function getStoredRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || ''
}

export function storeToken(token) {
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    return
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function storeRefreshToken(token) {
  if (!token) {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
    return
  }
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function clearStoredSession() {
  storeToken('')
  storeRefreshToken('')
}

async function requestJson(path, { signal, method = 'GET', body, token } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `Request failed (${response.status})`)
  }

  return payload
}

export async function getProducts(signal) {
  const data = await requestJson('/api/products', { signal })
  if (!Array.isArray(data.products)) {
    throw new Error('Unexpected API response for products')
  }
  return data.products
}

export function registerRequestOtp(payload) {
  return requestJson('/api/auth/register/request-otp', {
    method: 'POST',
    body: payload,
  })
}

export function registerVerifyOtp(payload) {
  return requestJson('/api/auth/register/verify', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function refreshSession(refreshToken) {
  return requestJson('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  })
}

export function logoutSession(refreshToken) {
  return requestJson('/api/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  })
}

export function requestPasswordReset(payload) {
  return requestJson('/api/auth/password-reset/request', {
    method: 'POST',
    body: payload,
  })
}

export function confirmPasswordReset(payload) {
  return requestJson('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: payload,
  })
}

export function getMe(token) {
  return requestJson('/api/auth/me', { token })
}

export function createOrder(payload, token) {
  return requestJson('/api/orders', {
    method: 'POST',
    body: payload,
    token,
  })
}

export function verifyPaystack(reference, token) {
  return requestJson('/api/payments/paystack/verify', {
    method: 'POST',
    body: { reference },
    token,
  })
}

export function getMyOrders(token) {
  return requestJson('/api/orders/me', { token })
}

export function getAdminOverview(token) {
  return requestJson('/api/admin/overview', { token })
}

export function getAdminProducts(token) {
  return requestJson('/api/admin/products', { token })
}

export function createAdminProduct(payload, token) {
  return requestJson('/api/admin/products', {
    method: 'POST',
    body: payload,
    token,
  })
}

export function updateAdminProduct(id, payload, token) {
  return requestJson(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  })
}

export function deleteAdminProduct(id, token) {
  return requestJson(`/api/admin/products/${id}`, {
    method: 'DELETE',
    token,
  })
}

export function updateAdminOrder(id, payload, token) {
  return requestJson(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: payload,
    token,
  })
}

export function updateAdminUser(id, payload, token) {
  return requestJson(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: payload,
    token,
  })
}

export function updateAdminSettings(payload, token) {
  return requestJson('/api/admin/settings', {
    method: 'PATCH',
    body: payload,
    token,
  })
}

export function getCloudinaryUploadSignature(fileName, token) {
  return requestJson('/api/admin/uploads/signature', {
    method: 'POST',
    body: { fileName },
    token,
  })
}

export async function uploadImageToCloudinary(file, token) {
  const payload = await getCloudinaryUploadSignature(file.name, token)
  const { upload } = payload
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', upload.apiKey)
  formData.append('timestamp', String(upload.timestamp))
  formData.append('signature', upload.signature)
  formData.append('folder', upload.folder)
  formData.append('public_id', upload.publicId)

  const response = await fetch(upload.uploadUrl, {
    method: 'POST',
    body: formData,
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error?.message || 'Cloudinary upload failed.')
  }

  return result
}
