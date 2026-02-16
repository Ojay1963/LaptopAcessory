import { useMemo, useState } from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import { fallbackImage, features } from '../data/products'

const filters = ['All Products', 'Laptops', 'Accessories']

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

function Home() {
  const [activeFilter, setActiveFilter] = useState('All Products')
  const { addToCart, toggleWishlist, isWishlisted, products } = useOutletContext()

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'Laptops') {
      return products.filter((item) => item.category === 'Laptop')
    }
    if (activeFilter === 'Accessories') {
      return products.filter((item) => item.category === 'Accessory')
    }
    return products
  }, [activeFilter, products])

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>
            Upgrade Your <span>Digital Lifestyle</span>
          </h1>
          <p>
            Premium laptops and accessories delivered anywhere in Nigeria.
            Official warranties, best prices, and pay-on-delivery options
            available in Lagos.
          </p>
          <div className="hero-actions">
            <NavLink className="btn primary" to="/laptops">
              Shop Now
            </NavLink>
            <NavLink className="btn ghost" to="/deals">
              View Deals
            </NavLink>
          </div>
        </div>
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
            alt="Laptop on desk"
            onError={handleImageError}
            data-fallback={fallbackImage}
          />
        </div>
      </section>

      <section className="latest">
        <div className="section-head">
          <h2>Latest Arrivals</h2>
          <div className="filter-tabs">
            {filters.map((item) => (
              <button
                key={item}
                className={item === activeFilter ? 'active' : ''}
                onClick={() => setActiveFilter(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((item) => {
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
        </div>
      </section>

      <section className="badges">
        {features.map((item) => (
          <div key={item.title}>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}

export default Home
