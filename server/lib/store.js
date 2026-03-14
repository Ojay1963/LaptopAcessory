import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './env.js'
import { createId, hashPassword } from './crypto.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storePath = path.resolve(__dirname, '../data/store.json')

function ensureStoreShape(state) {
  return {
    users: Array.isArray(state.users) ? state.users : [],
    orders: Array.isArray(state.orders) ? state.orders : [],
    otps: Array.isArray(state.otps) ? state.otps : [],
    refreshTokens: Array.isArray(state.refreshTokens) ? state.refreshTokens : [],
    customProducts: Array.isArray(state.customProducts) ? state.customProducts : [],
    settings: {
      storeName: state.settings?.storeName || 'OJ Devices',
      supportEmail: state.settings?.supportEmail || 'support@ojdevices.ng',
      supportPhone: state.settings?.supportPhone || '+2348001234567',
      brevoSenderEmail: state.settings?.brevoSenderEmail || '',
      brevoSenderName: state.settings?.brevoSenderName || 'OJ Devices',
    },
    auditLogs: Array.isArray(state.auditLogs) ? state.auditLogs : [],
  }
}

export function readStore() {
  const raw = fs.readFileSync(storePath, 'utf8')
  return ensureStoreShape(JSON.parse(raw))
}

export function writeStore(state) {
  fs.writeFileSync(storePath, JSON.stringify(ensureStoreShape(state), null, 2))
}

export function updateStore(mutator) {
  const current = readStore()
  const next = mutator(structuredClone(current)) || current
  writeStore(next)
  return next
}

export function ensureSeedAdmin() {
  updateStore((state) => {
    const existing = state.users.find((user) => user.email === env.adminEmail)
    if (existing) return state

    state.users.push({
      id: createId('usr'),
      name: env.adminName,
      email: env.adminEmail,
      passwordHash: hashPassword(env.adminPassword),
      role: 'admin',
      verified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    })
    state.auditLogs.unshift({
      id: createId('log'),
      action: 'seed_admin',
      actorEmail: env.adminEmail,
      createdAt: new Date().toISOString(),
    })
    return state
  })
}
