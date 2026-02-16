import { NavLink, useOutletContext } from 'react-router-dom'
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

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, clearWishlist, products } = useOutletContext()
  const saved = products.filter((item) => wishlist.includes(item.id))

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Wishlist</h1>
          <p>Keep track of the products you plan to buy later.</p>
        </div>
        <div className="hero-cta">
          <span>{saved.length} saved</span>
          {saved.length > 0 && (
            <button className="btn ghost" type="button" onClick={clearWishlist}>
              Clear Wishlist
            </button>
          )}
        </div>
      </section>

      {saved.length === 0 ? (
        <section className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p className="small-note">Browse the catalog and tap the heart icon to save items.</p>
          <NavLink className="btn ghost" to="/laptops">
            Browse Products
          </NavLink>
        </section>
      ) : (
        <section className="product-grid">
          {saved.map((item) => {
            const status = stockLabel(item.stock)
            return (
              <article key={item.id} className="product-card">
                <div className="tag">{item.tag}</div>
                <button
                  className="wishlist-btn active"
                  type="button"
                  onClick={() => toggleWishlist(item.id)}
                  aria-label="Remove from wishlist"
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
      )}

      <Footer />
    </div>
  )
}

export default Wishlist
