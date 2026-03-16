import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { features, footerLinks, products as baseProducts } from '../client/src/data/products.js'
import {
  createId,
  createOtp,
  createRandomToken,
  hashPassword,
  hashValue,
  signJwt,
  verifyJwt,
  verifyPassword,
} from './lib/crypto.js'
import { env, isProduction } from './lib/env.js'
import { sendOtpEmail } from './lib/brevo.js'
import {
  buildSignedUploadPayload,
  importImageFromRemoteUrl,
  isCloudinaryConfigured,
} from './lib/cloudinary.js'
import { sendError, sendOk } from './lib/http.js'
import { initializePaystackTransaction, verifyPaystackTransaction } from './lib/paystack.js'
import { rateLimit } from './lib/rate-limit.js'
import { ensureSeedAdmin, readStore, updateStore } from './lib/store.js'

const app = express()
const allowedCategories = new Set(['Laptop', 'Accessory'])
const allowedSorts = new Set(['price-asc', 'price-desc', 'rating', 'name'])
const publicUserFields = ['id', 'name', 'email', 'role', 'verified', 'status', 'createdAt', 'lastLoginAt']

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../client/dist')

ensureSeedAdmin()

app.disable('x-powered-by')
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buffer) => {
      req.rawBody = buffer
    },
  })
)
app.use(
  cors({
    origin: env.frontendOrigin || (!isProduction ? true : false),
    credentials: false,
  })
)
app.use(rateLimit({ key: 'api', max: 240, windowMs: 60_000, message: 'Too many API requests.' }))
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  next()
})

function sanitizeString(value, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function serializeUser(user) {
  return publicUserFields.reduce((result, key) => {
    result[key] = user[key]
    return result
  }, {})
}

function getCatalogProducts() {
  const store = readStore()
  return [...baseProducts, ...store.customProducts]
}

function buildAccessToken(user) {
  return signJwt(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    env.jwtSecret,
    {
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
      expiresInSeconds: env.jwtExpiresInHours * 60 * 60,
    }
  )
}

function issueRefreshToken(user) {
  const token = createRandomToken()
  const tokenHash = hashValue(token)
  const expiresAt = new Date(Date.now() + env.refreshTokenDays * 24 * 60 * 60 * 1000).toISOString()

  updateStore((state) => {
    state.refreshTokens = state.refreshTokens.filter((entry) => entry.userId !== user.id || new Date(entry.expiresAt).getTime() > Date.now())
    state.refreshTokens.push({
      id: createId('rt'),
      userId: user.id,
      tokenHash,
      createdAt: new Date().toISOString(),
      expiresAt,
      revokedAt: null,
    })
    return state
  })

  return {
    refreshToken: token,
    refreshTokenExpiresAt: expiresAt,
  }
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return sendError(res, 401, 'Authentication required.')

  try {
    const payload = verifyJwt(token, env.jwtSecret, {
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    })
    const store = readStore()
    const user = store.users.find((entry) => entry.id === payload.sub)
    if (!user || user.status !== 'active') {
      return sendError(res, 401, 'Account is unavailable.')
    }
    req.auth = { user, tokenPayload: payload }
    next()
  } catch (error) {
    return sendError(res, 401, error.message || 'Invalid session.')
  }
}

function requireAdmin(req, res, next) {
  if (req.auth.user.role !== 'admin') return sendError(res, 403, 'Admin access required.')
  next()
}

function recordAudit(action, actorEmail, meta = {}) {
  updateStore((state) => {
    state.auditLogs.unshift({
      id: createId('log'),
      action,
      actorEmail,
      meta,
      createdAt: new Date().toISOString(),
    })
    state.auditLogs = state.auditLogs.slice(0, 300)
    return state
  })
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8
}

function validateRemoteImageUrl(value) {
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function consumeOtp(email, purpose, otp) {
  const store = readStore()
  const record = store.otps.find((entry) => entry.email === email && entry.purpose === purpose)
  if (!record) throw new Error('OTP request not found.')
  if (record.otp !== otp) throw new Error('Invalid OTP.')
  if (new Date(record.expiresAt).getTime() < Date.now()) throw new Error('OTP has expired.')

  updateStore((state) => {
    state.otps = state.otps.filter((entry) => entry.id !== record.id)
    return state
  })

  return record
}

function createOtpRecord({ email, purpose, payload = {} }) {
  const otp = createOtp()
  const expiresAt = new Date(Date.now() + env.otpTtlMinutes * 60 * 1000).toISOString()
  updateStore((state) => {
    state.otps = state.otps.filter((entry) => !(entry.email === email && entry.purpose === purpose))
    state.otps.push({
      id: createId('otp'),
      purpose,
      email,
      otp,
      expiresAt,
      payload,
      createdAt: new Date().toISOString(),
    })
    return state
  })
  return { otp, expiresAt }
}

function revokeRefreshToken(rawToken) {
  const tokenHash = hashValue(rawToken)
  updateStore((state) => {
    const target = state.refreshTokens.find((entry) => entry.tokenHash === tokenHash && !entry.revokedAt)
    if (target) {
      target.revokedAt = new Date().toISOString()
    }
    return state
  })
}

app.get('/api/health', (_req, res) => {
  const store = readStore()
  sendOk(res, {
    service: 'oj-devices-api',
    timestamp: new Date().toISOString(),
    users: store.users.length,
    orders: store.orders.length,
  })
})

app.get('/api/meta', (_req, res) => {
  const store = readStore()
  sendOk(res, {
    features,
    footerLinks,
    categories: Array.from(allowedCategories),
    totalProducts: getCatalogProducts().length,
    settings: store.settings,
  })
})

app.get('/api/products', (req, res) => {
  const category = sanitizeString(req.query.category, 20)
  const q = sanitizeString(req.query.q, 120)
  const sort = sanitizeString(req.query.sort, 20)
  let list = [...getCatalogProducts()]

  if (category && !allowedCategories.has(category)) {
    return sendError(res, 400, 'Invalid category filter.')
  }
  if (sort && !allowedSorts.has(sort)) {
    return sendError(res, 400, 'Invalid sort value.')
  }

  if (category) list = list.filter((item) => item.category === category)

  if (q) {
    const normalized = q.toLowerCase()
    list = list.filter((item) => {
      const haystack = `${item.name} ${item.desc} ${item.category} ${(item.features || []).join(' ')}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  sendOk(res, {
    count: list.length,
    products: list,
  })
})

app.get('/api/products/:id', (req, res) => {
  const product = getCatalogProducts().find((item) => item.id === req.params.id)
  if (!product) return sendError(res, 404, 'Product not found.')
  sendOk(res, { product })
})

app.post('/api/auth/register/request-otp', rateLimit({ key: 'register-otp', max: 5, windowMs: 15 * 60_000, message: 'Too many OTP requests. Please wait before trying again.' }), async (req, res) => {
  const name = sanitizeString(req.body.name, 80)
  const email = sanitizeString(req.body.email, 120).toLowerCase()
  const password = sanitizeString(req.body.password, 160)

  if (!name) return sendError(res, 400, 'Name is required.')
  if (!validateEmail(email)) return sendError(res, 400, 'Valid email is required.')
  if (!validatePassword(password)) return sendError(res, 400, 'Password must be at least 8 characters.')

  const store = readStore()
  if (store.users.some((user) => user.email === email)) {
    return sendError(res, 409, 'An account with this email already exists.')
  }

  const { otp, expiresAt } = createOtpRecord({
    email,
    purpose: 'register',
    payload: { name, passwordHash: hashPassword(password) },
  })

  try {
    const emailResult = await sendOtpEmail({ toEmail: email, toName: name, otp, purpose: 'registration' })
    sendOk(res, {
      message: 'OTP sent successfully.',
      expiresAt,
      debugOtp: emailResult.debugOtp,
      delivery: emailResult,
    })
  } catch (error) {
    sendError(res, 502, 'Unable to send OTP email.', error.message)
  }
})

app.post('/api/auth/register/verify', rateLimit({ key: 'register-verify', max: 10, windowMs: 15 * 60_000, message: 'Too many verification attempts.' }), (req, res) => {
  const email = sanitizeString(req.body.email, 120).toLowerCase()
  const otp = sanitizeString(req.body.otp, 6)

  let record
  try {
    record = consumeOtp(email, 'register', otp)
  } catch (error) {
    return sendError(res, 400, error.message)
  }

  let createdUser
  updateStore((state) => {
    createdUser = {
      id: createId('usr'),
      name: record.payload.name,
      email,
      passwordHash: record.payload.passwordHash,
      role: 'customer',
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }
    state.users.push(createdUser)
    return state
  })
  recordAudit('register_verify', email)

  const refresh = issueRefreshToken(createdUser)
  sendOk(res, {
    user: serializeUser(createdUser),
    token: buildAccessToken(createdUser),
    ...refresh,
  }, 201)
})

app.post('/api/auth/login', rateLimit({ key: 'login', max: 10, windowMs: 15 * 60_000, message: 'Too many login attempts. Please try again later.' }), (req, res) => {
  const email = sanitizeString(req.body.email, 120).toLowerCase()
  const password = sanitizeString(req.body.password, 160)
  const store = readStore()
  const user = store.users.find((entry) => entry.email === email)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return sendError(res, 401, 'Invalid email or password.')
  }
  if (user.status !== 'active') {
    return sendError(res, 403, 'This account is disabled.')
  }

  updateStore((state) => {
    const target = state.users.find((entry) => entry.id === user.id)
    if (target) target.lastLoginAt = new Date().toISOString()
    return state
  })
  recordAudit('login', user.email)

  const refresh = issueRefreshToken(user)
  sendOk(res, {
    user: serializeUser({ ...user, lastLoginAt: new Date().toISOString() }),
    token: buildAccessToken(user),
    ...refresh,
  })
})

app.post('/api/auth/refresh', rateLimit({ key: 'refresh', max: 30, windowMs: 15 * 60_000, message: 'Too many refresh attempts.' }), (req, res) => {
  const refreshToken = sanitizeString(req.body.refreshToken, 500)
  if (!refreshToken) return sendError(res, 400, 'Refresh token is required.')

  const tokenHash = hashValue(refreshToken)
  const store = readStore()
  const record = store.refreshTokens.find((entry) => entry.tokenHash === tokenHash && !entry.revokedAt)
  if (!record) return sendError(res, 401, 'Invalid refresh token.')
  if (new Date(record.expiresAt).getTime() < Date.now()) return sendError(res, 401, 'Refresh token has expired.')

  const user = store.users.find((entry) => entry.id === record.userId)
  if (!user || user.status !== 'active') return sendError(res, 401, 'Account is unavailable.')

  revokeRefreshToken(refreshToken)
  const nextRefresh = issueRefreshToken(user)
  sendOk(res, {
    token: buildAccessToken(user),
    user: serializeUser(user),
    ...nextRefresh,
  })
})

app.post('/api/auth/logout', (req, res) => {
  const refreshToken = sanitizeString(req.body.refreshToken, 500)
  if (refreshToken) {
    revokeRefreshToken(refreshToken)
  }
  sendOk(res, { message: 'Logged out successfully.' })
})

app.post('/api/auth/password-reset/request', rateLimit({ key: 'password-reset-request', max: 5, windowMs: 15 * 60_000, message: 'Too many password reset requests.' }), async (req, res) => {
  const email = sanitizeString(req.body.email, 120).toLowerCase()
  if (!validateEmail(email)) return sendError(res, 400, 'Valid email is required.')

  const store = readStore()
  const user = store.users.find((entry) => entry.email === email)
  if (!user) return sendOk(res, { message: 'If the account exists, a reset OTP has been sent.' })

  const { otp, expiresAt } = createOtpRecord({
    email,
    purpose: 'reset',
    payload: { userId: user.id },
  })

  try {
    const emailResult = await sendOtpEmail({ toEmail: email, toName: user.name, otp, purpose: 'password reset' })
    sendOk(res, {
      message: 'If the account exists, a reset OTP has been sent.',
      expiresAt,
      debugOtp: emailResult.debugOtp,
    })
  } catch (error) {
    sendError(res, 502, 'Unable to send reset email.', error.message)
  }
})

app.post('/api/auth/password-reset/confirm', rateLimit({ key: 'password-reset-confirm', max: 10, windowMs: 15 * 60_000, message: 'Too many reset attempts.' }), (req, res) => {
  const email = sanitizeString(req.body.email, 120).toLowerCase()
  const otp = sanitizeString(req.body.otp, 6)
  const password = sanitizeString(req.body.password, 160)
  if (!validatePassword(password)) return sendError(res, 400, 'Password must be at least 8 characters.')

  let record
  try {
    record = consumeOtp(email, 'reset', otp)
  } catch (error) {
    return sendError(res, 400, error.message)
  }

  let updatedUser = null
  updateStore((state) => {
    const user = state.users.find((entry) => entry.id === record.payload.userId)
    if (!user) return state
    user.passwordHash = hashPassword(password)
    user.lastLoginAt = new Date().toISOString()
    state.refreshTokens = state.refreshTokens.filter((entry) => entry.userId !== user.id)
    updatedUser = user
    return state
  })

  if (!updatedUser) return sendError(res, 404, 'Account not found.')
  recordAudit('password_reset', email)

  const refresh = issueRefreshToken(updatedUser)
  sendOk(res, {
    user: serializeUser(updatedUser),
    token: buildAccessToken(updatedUser),
    ...refresh,
  })
})

app.get('/api/auth/me', authenticate, (req, res) => {
  sendOk(res, { user: serializeUser(req.auth.user) })
})

app.get('/api/orders/me', authenticate, (req, res) => {
  const store = readStore()
  const orders = store.orders.filter((order) => order.userId === req.auth.user.id)
  sendOk(res, { orders })
})

app.post('/api/orders', authenticate, async (req, res) => {
  const { items = [], delivery = {}, paymentMethod = 'paystack' } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) return sendError(res, 400, 'Order items are required.')

  const catalog = getCatalogProducts()
  const normalizedItems = items.map((entry) => {
    const product = catalog.find((item) => item.id === entry.productId)
    if (!product) throw new Error(`Product not found for ${entry.productId}`)
    const qty = Math.max(1, Number(entry.qty) || 1)
    return {
      productId: product.id,
      name: product.name,
      qty,
      price: product.price,
      lineTotal: product.price * qty,
    }
  })

  const subtotal = normalizedItems.reduce((total, item) => total + item.lineTotal, 0)
  const deliveryFee = delivery.type === 'Express' ? 35000 : 25000
  const total = subtotal + deliveryFee
  const reference = `OJ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  let order
  updateStore((state) => {
    order = {
      id: createId('ord'),
      reference,
      userId: req.auth.user.id,
      customer: {
        name: sanitizeString(delivery.name || req.auth.user.name, 100),
        email: sanitizeString(delivery.email || req.auth.user.email, 120),
        phone: sanitizeString(delivery.phone, 40),
        address: sanitizeString(delivery.address, 160),
        city: sanitizeString(delivery.city, 60),
      },
      items: normalizedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMeta: null,
    }
    state.orders.unshift(order)
    return state
  })

  let payment = {
    provider: paymentMethod,
    reference,
    initialized: false,
  }

  if (paymentMethod === 'paystack') {
    payment = await initializePaystackTransaction({
      email: order.customer.email,
      amount: total * 100,
      reference,
      metadata: {
        orderId: order.id,
        customerId: req.auth.user.id,
      },
    })
  }

  recordAudit('create_order', req.auth.user.email, { orderId: order.id, reference })
  sendOk(res, { order, payment }, 201)
})

app.post('/api/payments/paystack/verify', authenticate, async (req, res) => {
  const reference = sanitizeString(req.body.reference, 120)
  if (!reference) return sendError(res, 400, 'Reference is required.')

  const verification = await verifyPaystackTransaction(reference)
  let updatedOrder = null

  updateStore((state) => {
    const order = state.orders.find((entry) => entry.reference === reference)
    if (order) {
      order.paymentStatus = verification.paid ? 'paid' : order.paymentStatus
      order.orderStatus = verification.paid ? 'processing' : order.orderStatus
      order.updatedAt = new Date().toISOString()
      order.paymentMeta = verification
      updatedOrder = order
    }
    return state
  })

  if (!updatedOrder) return sendError(res, 404, 'Order not found for payment reference.')

  recordAudit('verify_paystack', req.auth.user.email, { orderId: updatedOrder.id, reference })
  sendOk(res, { verification, order: updatedOrder })
})

app.post('/api/payments/paystack/webhook', rateLimit({ key: 'paystack-webhook', max: 120, windowMs: 60_000, message: 'Too many webhook requests.' }), (req, res) => {
  if (!env.paystackSecretKey) {
    return sendError(res, 400, 'Paystack is not configured.')
  }

  const signature = req.headers['x-paystack-signature']
  const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body || {}))
  const expectedSignature = crypto.createHmac('sha512', env.paystackSecretKey).update(rawBody).digest('hex')

  if (!signature || signature !== expectedSignature) {
    return sendError(res, 401, 'Invalid webhook signature.')
  }

  const event = req.body?.event
  const data = req.body?.data || {}
  if (event === 'charge.success' && data.reference) {
    updateStore((state) => {
      const order = state.orders.find((entry) => entry.reference === data.reference)
      if (order) {
        order.paymentStatus = 'paid'
        order.orderStatus = order.orderStatus === 'pending' ? 'processing' : order.orderStatus
        order.updatedAt = new Date().toISOString()
        order.paymentMeta = {
          ...order.paymentMeta,
          webhookEvent: event,
          paidAt: data.paid_at || new Date().toISOString(),
          gatewayResponse: data.gateway_response,
          channel: data.channel,
        }
      }
      return state
    })
    recordAudit('paystack_webhook_charge_success', 'paystack', { reference: data.reference })
  }

  sendOk(res, { received: true })
})

app.get('/api/admin/overview', authenticate, requireAdmin, (_req, res) => {
  const store = readStore()
  const catalog = getCatalogProducts()
  const revenue = store.orders
    .filter((order) => order.paymentStatus === 'paid')
    .reduce((total, order) => total + order.total, 0)

  sendOk(res, {
    metrics: {
      totalUsers: store.users.length,
      totalOrders: store.orders.length,
      totalProducts: catalog.length,
      totalRevenue: revenue,
      pendingOrders: store.orders.filter((order) => order.orderStatus === 'pending').length,
    },
    recentOrders: store.orders.slice(0, 8),
    products: store.customProducts,
    users: store.users.map(serializeUser),
    settings: store.settings,
    auditLogs: store.auditLogs.slice(0, 20),
  })
})

app.get('/api/admin/products', authenticate, requireAdmin, (_req, res) => {
  sendOk(res, { products: getCatalogProducts() })
})

app.post('/api/admin/uploads/signature', authenticate, requireAdmin, (req, res) => {
  if (!isCloudinaryConfigured()) {
    return sendError(res, 400, 'Cloudinary is not configured yet.')
  }
  const baseName = sanitizeString(req.body.fileName, 120).replace(/[^a-zA-Z0-9-_]/g, '-')
  const publicId = `${Date.now()}-${baseName || 'upload'}`
  const upload = buildSignedUploadPayload({ publicId })
  sendOk(res, { upload })
})

app.post('/api/admin/uploads/import-url', authenticate, requireAdmin, async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return sendError(res, 400, 'Cloudinary is not configured yet.')
  }

  const imageUrl = sanitizeString(req.body.imageUrl, 1000)
  const fileName = sanitizeString(req.body.fileName, 160).replace(/[^a-zA-Z0-9-_]/g, '-')

  if (!validateRemoteImageUrl(imageUrl)) {
    return sendError(res, 400, 'A valid remote image URL is required.')
  }

  try {
    const uploaded = await importImageFromRemoteUrl({
      imageUrl,
      publicId: `${Date.now()}-${fileName || 'remote-image'}`,
    })

    recordAudit('admin_import_cloudinary_image', req.auth.user.email, {
      sourceUrl: imageUrl,
      secureUrl: uploaded.secure_url,
    })

    sendOk(res, { image: uploaded })
  } catch (error) {
    sendError(res, 502, 'Unable to import image from remote URL.', error.message)
  }
})

app.post('/api/admin/products', authenticate, requireAdmin, (req, res) => {
  const name = sanitizeString(req.body.name, 120)
  const category = sanitizeString(req.body.category, 20)
  const price = Number(req.body.price)
  if (!name) return sendError(res, 400, 'Product name is required.')
  if (!allowedCategories.has(category)) return sendError(res, 400, 'Valid category is required.')
  if (!Number.isFinite(price) || price <= 0) return sendError(res, 400, 'Valid price is required.')

  let created
  updateStore((state) => {
    created = {
      id: createId('prd'),
      name,
      category,
      price,
      tag: category.toUpperCase(),
      desc: sanitizeString(req.body.desc, 240),
      features: Array.isArray(req.body.features) ? req.body.features.slice(0, 6) : [],
      specs: Array.isArray(req.body.specs) ? req.body.specs.slice(0, 8) : [],
      image: sanitizeString(req.body.image, 500),
      imageFallback: sanitizeString(req.body.imageFallback, 500),
      sku: sanitizeString(req.body.sku || `OJ-${category}-${Date.now()}`, 40),
      stock: Math.max(0, Number(req.body.stock) || 0),
      rating: Number(req.body.rating) || 4.5,
      reviewCount: Number(req.body.reviewCount) || 0,
      createdAt: new Date().toISOString(),
      createdBy: req.auth.user.email,
    }
    state.customProducts.unshift(created)
    return state
  })
  recordAudit('admin_create_product', req.auth.user.email, { productId: created.id })
  sendOk(res, { product: created }, 201)
})

app.put('/api/admin/products/:id', authenticate, requireAdmin, (req, res) => {
  let updated = null
  updateStore((state) => {
    const product = state.customProducts.find((entry) => entry.id === req.params.id)
    if (!product) return state
    Object.assign(product, {
      name: sanitizeString(req.body.name || product.name, 120),
      category: sanitizeString(req.body.category || product.category, 20),
      price: Number(req.body.price) || product.price,
      desc: sanitizeString(req.body.desc || product.desc, 240),
      image: sanitizeString(req.body.image || product.image, 500),
      imageFallback: sanitizeString(req.body.imageFallback || product.imageFallback, 500),
      stock: Number.isFinite(Number(req.body.stock)) ? Math.max(0, Number(req.body.stock)) : product.stock,
      updatedAt: new Date().toISOString(),
    })
    updated = product
    return state
  })
  if (!updated) return sendError(res, 404, 'Only custom products are editable in admin.')
  recordAudit('admin_update_product', req.auth.user.email, { productId: updated.id })
  sendOk(res, { product: updated })
})

app.delete('/api/admin/products/:id', authenticate, requireAdmin, (req, res) => {
  let deleted = false
  updateStore((state) => {
    const next = state.customProducts.filter((entry) => entry.id !== req.params.id)
    deleted = next.length !== state.customProducts.length
    state.customProducts = next
    return state
  })
  if (!deleted) return sendError(res, 404, 'Product not found.')
  recordAudit('admin_delete_product', req.auth.user.email, { productId: req.params.id })
  sendOk(res, { message: 'Product deleted.' })
})

app.get('/api/admin/orders', authenticate, requireAdmin, (_req, res) => {
  sendOk(res, { orders: readStore().orders })
})

app.patch('/api/admin/orders/:id', authenticate, requireAdmin, (req, res) => {
  const orderStatus = sanitizeString(req.body.orderStatus, 40)
  const paymentStatus = sanitizeString(req.body.paymentStatus, 40)
  let updated = null

  updateStore((state) => {
    const order = state.orders.find((entry) => entry.id === req.params.id)
    if (!order) return state
    if (orderStatus) order.orderStatus = orderStatus
    if (paymentStatus) order.paymentStatus = paymentStatus
    order.updatedAt = new Date().toISOString()
    updated = order
    return state
  })
  if (!updated) return sendError(res, 404, 'Order not found.')
  recordAudit('admin_update_order', req.auth.user.email, { orderId: updated.id })
  sendOk(res, { order: updated })
})

app.get('/api/admin/users', authenticate, requireAdmin, (_req, res) => {
  sendOk(res, { users: readStore().users.map(serializeUser) })
})

app.patch('/api/admin/users/:id', authenticate, requireAdmin, (req, res) => {
  const role = sanitizeString(req.body.role, 20)
  const status = sanitizeString(req.body.status, 20)
  let updated = null
  updateStore((state) => {
    const user = state.users.find((entry) => entry.id === req.params.id)
    if (!user) return state
    if (role) user.role = role
    if (status) user.status = status
    updated = user
    return state
  })
  if (!updated) return sendError(res, 404, 'User not found.')
  recordAudit('admin_update_user', req.auth.user.email, { userId: updated.id })
  sendOk(res, { user: serializeUser(updated) })
})

app.get('/api/admin/settings', authenticate, requireAdmin, (_req, res) => {
  sendOk(res, { settings: readStore().settings })
})

app.patch('/api/admin/settings', authenticate, requireAdmin, (req, res) => {
  let settings = null
  updateStore((state) => {
    state.settings = {
      ...state.settings,
      storeName: sanitizeString(req.body.storeName || state.settings.storeName, 80),
      supportEmail: sanitizeString(req.body.supportEmail || state.settings.supportEmail, 120),
      supportPhone: sanitizeString(req.body.supportPhone || state.settings.supportPhone, 40),
      brevoSenderEmail: sanitizeString(req.body.brevoSenderEmail || state.settings.brevoSenderEmail, 120),
      brevoSenderName: sanitizeString(req.body.brevoSenderName || state.settings.brevoSenderName, 80),
    }
    settings = state.settings
    return state
  })
  recordAudit('admin_update_settings', req.auth.user.email)
  sendOk(res, { settings })
})

app.use(
  express.static(distPath, {
    index: false,
    extensions: ['html'],
    maxAge: isProduction ? '1h' : 0,
  })
)

app.use('/api', (_req, res) => {
  sendError(res, 404, 'API route not found.')
})

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

app.use((error, _req, res, _next) => {
  console.error(error)
  sendError(res, 500, 'Internal server error.', error.message)
})

app.listen(env.port, () => {
  console.log(`API server running on http://localhost:${env.port}`)
})
