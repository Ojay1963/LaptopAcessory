import { fallbackImage } from '../data/products'

export function handleImageError(event) {
  const fallback = event.currentTarget.dataset.fallback
  event.currentTarget.onerror = null
  event.currentTarget.src = fallback || fallbackImage
}

export function getStockMeta(stock) {
  if (stock === 0) return { label: 'Out of stock', tone: 'out' }
  if (stock <= 6) return { label: 'Low stock', tone: 'low' }
  return { label: 'In stock', tone: 'in' }
}

export function getProductBrand(product) {
  if (!product?.name) return 'Unknown'
  const [first, second] = product.name.split(' ')
  if (!second) return first
  return first.length <= 3 ? `${first} ${second}` : first
}

export function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item)
    if (!key) return counts
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})
}

function matchesQuery(product, query) {
  if (!query) return true

  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const haystack = [
    product.name,
    product.desc,
    product.category,
    ...(product.features || []),
    ...(product.specs || []).map((item) => `${item.label} ${item.value}`),
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalized)
}

export function filterProducts(
  products,
  {
    category = 'All',
    query = '',
    sortBy = 'featured',
    inStockOnly = false,
    minPrice = '',
    maxPrice = '',
    brands = [],
  } = {},
) {
  let list = products.filter((product) => {
    if (category === 'Laptop' && product.category !== 'Laptop') return false
    if (category === 'Accessory' && product.category !== 'Accessory') return false
    if (inStockOnly && product.stock === 0) return false
    if (minPrice !== '' && product.price < Number(minPrice)) return false
    if (maxPrice !== '' && product.price > Number(maxPrice)) return false
    if (brands.length > 0 && !brands.includes(getProductBrand(product))) return false
    return matchesQuery(product, query)
  })

  switch (sortBy) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  return list
}
