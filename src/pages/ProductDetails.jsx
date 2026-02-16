import { useEffect, useMemo, useState } from 'react'
import { NavLink, useOutletContext, useParams } from 'react-router-dom'
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

function ProductDetails() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isWishlisted, products } = useOutletContext()
  const product = products.find((item) => item.id === id)
  const productId = product?.id
  const reviewStorageKey = productId ? `ojay_reviews_${productId}` : ''
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ name: '', rating: '5', comment: '' })
  const [reviewTouched, setReviewTouched] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    if (!reviewStorageKey) return
    const raw = localStorage.getItem(reviewStorageKey)
    if (raw) {
      try {
        setReviews(JSON.parse(raw))
      } catch {
        localStorage.removeItem(reviewStorageKey)
      }
    } else {
      setReviews([])
    }
  }, [reviewStorageKey])

  useEffect(() => {
    if (!productId) return
    const key = 'ojay_recent'
    const raw = localStorage.getItem(key)
    let next = []
    if (raw) {
      try {
        next = JSON.parse(raw)
      } catch {
        localStorage.removeItem(key)
      }
    }
    next = [productId, ...next.filter((itemId) => itemId !== productId)].slice(0, 6)
    localStorage.setItem(key, JSON.stringify(next))
    setRecentlyViewed(next.filter((itemId) => itemId !== productId))
  }, [productId])

  const defaultReviews = useMemo(() => {
    if (!product) return []
    return [
      {
        id: `${product.id}-default-1`,
        name: 'Ojay Verified Buyer',
        rating: Math.max(4, Math.round(product.rating)),
        comment: 'Exactly what I needed. Delivery was fast and packaging was solid.',
      },
      {
        id: `${product.id}-default-2`,
        name: 'Workspace Upgrade',
        rating: Math.max(4, Math.round(product.rating - 0.2)),
        comment: 'Great performance and a premium feel. Would recommend.',
      },
    ]
  }, [product])

  const allReviews = [...defaultReviews, ...reviews]
  const totalReviews = product ? product.reviewCount + reviews.length : reviews.length

  const reviewErrors = useMemo(() => {
    const next = {}
    if (!reviewForm.name.trim()) next.name = 'Name is required.'
    if (!reviewForm.comment.trim()) next.comment = 'Add a short comment.'
    return next
  }, [reviewForm])

  const isReviewValid = Object.keys(reviewErrors).length === 0

  const handleReviewChange = (event) => {
    const { name, value } = event.target
    setReviewForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleReviewSubmit = (event) => {
    event.preventDefault()
    setReviewTouched(true)
    if (!isReviewValid) return
    if (!product || !productId) return
    const newReview = {
      id: `${productId}-${Date.now()}`,
      name: reviewForm.name.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
    }
    const next = [newReview, ...reviews].slice(0, 8)
    setReviews(next)
    localStorage.setItem(`ojay_reviews_${productId}`, JSON.stringify(next))
    setReviewForm({ name: '', rating: '5', comment: '' })
    setReviewTouched(false)
  }

  const recentProducts = recentlyViewed
    .map((itemId) => products.find((item) => item.id === itemId))
    .filter(Boolean)
    .slice(0, 4)

  if (!product) {
    return (
      <div className="page">
        <section className="page-hero">
          <div>
            <h1>Product Not Found</h1>
            <p>We could not find that item. Browse the catalog instead.</p>
          </div>
          <div className="hero-cta">
            <NavLink className="btn primary" to="/laptops">
              Browse Laptops
            </NavLink>
            <NavLink className="btn ghost" to="/accessories">
              Browse Accessories
            </NavLink>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const status = stockLabel(product.stock)

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>{product.name}</h1>
          <p>{product.desc}</p>
        </div>
        <div className="hero-cta">
          <span className="tag">{product.tag}</span>
          <span className={`stock-badge ${status.tone} inline`}>{status.label}</span>
          <button
            className={
              isWishlisted(product.id) ? 'wishlist-btn active inline' : 'wishlist-btn inline'
            }
            type="button"
            onClick={() => toggleWishlist(product.id)}
          >
            ♥
          </button>
          <button
            className="btn primary"
            type="button"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </section>

      <section className="product-details">
        <div className="product-details-card">
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            data-fallback={product.imageFallback}
          />
          <div className="details-body">
            <div>
              <h3>Highlights</h3>
              <Rating value={product.rating} count={totalReviews} size="lg" />
              <div className="pills">
                {product.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </div>
            <div className="details-price">
              <strong>{formatPrice(product.price)}</strong>
              <p className="small-note">SKU: {product.sku}</p>
            </div>
            <div className="details-actions">
              <button
                className="btn primary"
                type="button"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
              <NavLink className="btn ghost" to="/contact">
                Request a Quote
              </NavLink>
            </div>
          </div>
        </div>
        <div className="product-details-card">
          <div>
            <h3>Specifications</h3>
            <ul className="specs-list">
              {(product.specs || []).map((spec) => (
                <li key={spec.label}>
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>What you get</h3>
            <ul className="details-list">
              <li>Premium packaging and safe delivery.</li>
              <li>Manufacturer warranty and Ojay support.</li>
              <li>Optional setup assistance for premium orders.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="reviews-grid">
        <div className="product-details-card">
          <div className="review-summary">
            <div>
              <h3>Customer Reviews</h3>
              <p className="small-note">Verified buyers · {totalReviews} reviews</p>
            </div>
            <Rating value={product.rating} count={totalReviews} size="lg" />
          </div>
          <div className="review-list">
            {allReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-head">
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} size="sm" />
                </div>
                <p className="small-note">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <form className="product-details-card review-form" onSubmit={handleReviewSubmit}>
          <h3>Leave a Review</h3>
          <label>
            Name
            <input
              name="name"
              type="text"
              value={reviewForm.name}
              onChange={handleReviewChange}
              onBlur={() => setReviewTouched(true)}
              placeholder="Your name"
            />
            {reviewTouched && reviewErrors.name && (
              <span className="field-error">{reviewErrors.name}</span>
            )}
          </label>
          <label>
            Rating
            <select
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Great</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </label>
          <label>
            Comment
            <textarea
              name="comment"
              value={reviewForm.comment}
              onChange={handleReviewChange}
              onBlur={() => setReviewTouched(true)}
              placeholder="Share your experience"
            />
            {reviewTouched && reviewErrors.comment && (
              <span className="field-error">{reviewErrors.comment}</span>
            )}
          </label>
          <button className="btn primary" type="submit" disabled={!isReviewValid}>
            Submit Review
          </button>
        </form>
      </section>

      {recentProducts.length > 0 && (
        <section className="recent-grid">
          <div className="section-head">
            <h2>Recently Viewed</h2>
            <NavLink className="btn ghost" to="/search">
              Continue Shopping
            </NavLink>
          </div>
          <div className="product-grid">
            {recentProducts.map((item) => (
              <article key={item.id} className="product-card">
                <div className="tag">{item.tag}</div>
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError}
                  data-fallback={item.imageFallback}
                />
                <div className="product-body">
                  <h3>{item.name}</h3>
                  <Rating value={item.rating} count={item.reviewCount} />
                  <div className="product-footer">
                    <strong>{formatPrice(item.price)}</strong>
                    <div className="product-actions">
                      <NavLink className="btn ghost view-link" to={`/product/${item.id}`}>
                        View Details
                      </NavLink>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default ProductDetails
