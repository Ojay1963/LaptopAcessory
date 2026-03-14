const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

export function formatPrice(value) {
  return currencyFormatter.format(value)
}

export function formatItemCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function buildOrderReference() {
  return `OJ-${Date.now().toString().slice(-8)}`
}
