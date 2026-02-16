import { useMemo, useState } from 'react'
import { NavLink, useLocation, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import { fallbackImage } from '../data/products'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function formatPrice(value) {
  return `₦${value.toLocaleString('en-NG')}`
}

function handleImageError(event) {
  const fallback = event.currentTarget.dataset.fallback
  event.currentTarget.onerror = null
  event.currentTarget.src = fallback || fallbackImage
}

function stockLabel(stock) {
  if (stock === 0) return { label: 'Out of Stock', tone: 'out' }
  if (stock <= 6) return { label: 'Low Stock', tone: 'low' }
  return { label: 'In Stock', tone: 'in' }
}

function Laptops() {
  const query = useQuery().get('q') || ''
  const { addToCart, toggleWishlist, isWishlisted, products } = useOutletContext()
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const list = useMemo(() => {
    let filtered = products.filter((item) => item.category === 'Laptop')
    const normalized = query.toLowerCase()
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(normalized) ||
          item.desc.toLowerCase().includes(normalized)
      )
    }
    if (inStockOnly) {
      filtered = filtered.filter((item) => item.stock > 0)
    }
    if (minPrice) {
      filtered = filtered.filter((item) => item.price >= Number(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter((item) => item.price <= Number(maxPrice))
    }
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
    return filtered
  }, [inStockOnly, maxPrice, minPrice, products, query, sortBy])

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Laptops</h1>
          <p>Explore premium laptops curated for work, gaming, and creators.</p>
        </div>
        <div className="hero-cta">
          <span>{list.length} results</span>
          <button className="btn primary" type="button">
            Request a Quote
          </button>
        </div>
      </section>

      <section className="filter-bar">
        <div className="filter-row">
          <label>
            Sort
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label>
            Min Price
            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Max Price
            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="3,500,000"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
            />
            In stock only
          </label>
        </div>
      </section>

      <section className="product-grid">
        {list.map((item) => {
          const status = stockLabel(item.stock)
          return (
            <article key={item.id} className="product-card">
              <div className="tag">{item.tag}</div>
              <button
                className={isWishlisted(item.id) ? 'wishlist-btn active' : 'wishlist-btn'}
                type="button"
                onClick={() => toggleWishlist(item.id)}
                aria-label="Toggle wishlist"
              >
                ♥
              </button>
              <span className={`stock-badge ${status.tone}`}>{status.label}</span>
              <img
                src={item.image}
                alt={item.name}
                onError={handleImageError}
                data-fallback={item.imageFallback}
              />
              <div className="product-body">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <Rating value={item.rating} count={item.reviewCount} />
                <div className="pills">
                  {item.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
                <div className="product-footer">
                  <strong>{formatPrice(item.price)}</strong>
                  <div className="product-actions">
                    <NavLink className="btn ghost view-link" to={`/product/${item.id}`}>
                      View Details
                    </NavLink>
                    <button
                      className="circle"
                      type="button"
                      aria-label={`Add ${item.name} to cart`}
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <Footer />
    </div>
  )
}

export default Laptops
