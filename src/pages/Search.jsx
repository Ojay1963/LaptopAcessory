import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import { fallbackImage } from '../data/products'

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

function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isWishlisted, products } = useOutletContext()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setQuery(params.get('q') || '')
  }, [location.search])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    let list = products.filter((item) => {
      if (category === 'Laptops' && item.category !== 'Laptop') return false
      if (category === 'Accessories' && item.category !== 'Accessory') return false
      if (inStockOnly && item.stock === 0) return false
      if (normalized) {
        const haystack = `${item.name} ${item.desc} ${item.features.join(' ')} ${item.category}`.toLowerCase()
        if (!haystack.includes(normalized)) return false
      }
      if (minPrice && item.price < Number(minPrice)) return false
      if (maxPrice && item.price > Number(maxPrice)) return false
      return true
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
  }, [category, inStockOnly, maxPrice, minPrice, products, query, sortBy])

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Search</h1>
          <p>Find laptops and accessories tailored to your workflow.</p>
        </div>
        <div className="hero-cta">
          <span>{filtered.length} results</span>
          <NavLink className="btn ghost" to="/laptops">
            Browse Laptops
          </NavLink>
        </div>
      </section>

      <section className="filter-bar">
        <form className="filter-search" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <div className="filter-row">
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All</option>
              <option>Laptops</option>
              <option>Accessories</option>
            </select>
          </label>
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
              placeholder="2,500,000"
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
        {filtered.map((item) => {
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

export default Search
