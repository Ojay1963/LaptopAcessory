function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadStoredJson(key, fallback) {
  if (!isStorageAvailable()) return fallback

  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    window.localStorage.removeItem(key)
    return fallback
  }
}

export function saveStoredJson(key, value) {
  if (!isStorageAvailable()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStoredValue(key) {
  if (!isStorageAvailable()) return
  window.localStorage.removeItem(key)
}

export function loadStoredValue(key, fallback = '') {
  if (!isStorageAvailable()) return fallback
  return window.localStorage.getItem(key) ?? fallback
}

export function saveStoredValue(key, value) {
  if (!isStorageAvailable()) return
  window.localStorage.setItem(key, value)
}
