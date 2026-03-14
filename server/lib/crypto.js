import crypto from 'crypto'

const HASH_PREFIX = 'scrypt'

export function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`
}

export function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function createRandomToken() {
  return crypto.randomBytes(32).toString('base64url')
}

export function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex')
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${HASH_PREFIX}:${salt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  const [prefix, salt, hash] = String(storedHash || '').split(':')
  if (prefix !== HASH_PREFIX || !salt || !hash) return false
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'))
}

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url')
}

export function signJwt(payload, secret, options = {}) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }
  const now = Math.floor(Date.now() / 1000)
  const body = {
    ...payload,
    iss: options.issuer,
    aud: options.audience,
    iat: now,
    exp: now + options.expiresInSeconds,
  }
  const encodedHeader = toBase64Url(JSON.stringify(header))
  const encodedBody = toBase64Url(JSON.stringify(body))
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest('base64url')
  return `${encodedHeader}.${encodedBody}.${signature}`
}

export function verifyJwt(token, secret, options = {}) {
  const [encodedHeader, encodedBody, signature] = String(token || '').split('.')
  if (!encodedHeader || !encodedBody || !signature) {
    throw new Error('Malformed token')
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest('base64url')

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Invalid signature')
  }

  const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8'))
  const now = Math.floor(Date.now() / 1000)

  if (payload.exp <= now) throw new Error('Token expired')
  if (options.issuer && payload.iss !== options.issuer) throw new Error('Invalid issuer')
  if (options.audience && payload.aud !== options.audience) throw new Error('Invalid audience')

  return payload
}
