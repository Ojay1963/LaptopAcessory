const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || ''
const apiBaseUrl = rawApiBaseUrl.endsWith('/') ? rawApiBaseUrl.slice(0, -1) : rawApiBaseUrl

export async function getProducts(signal) {
  const response = await fetch(`${apiBaseUrl}/api/products`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`)
  }

  const data = await response.json()
  if (!Array.isArray(data.products)) {
    throw new Error('Unexpected API response for products')
  }

  return data.products
}
