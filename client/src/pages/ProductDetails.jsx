import { useEffect, useMemo, useState } from 'react'
import { NavLink, useOutletContext, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { ProductDetailsLoadingState } from '../components/StoreLoadingStates'
import { formatPrice } from '../lib/format'
import { getStockMeta, handleImageError } from '../lib/catalog'
import { loadStoredJson, saveStoredJson } from '../lib/storage'

const accordionDefaults = {
  description: true,
  details: true,
  reviews: false,
}

function buildSellerName(product) {
  const first = product.name.split(' ')[0]
  return `${first.toUpperCase()} COMPUTERS`
}

function ProductDetails() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isWishlisted, toggleCompare, isCompared, products, productsLoading } =
    useOutletContext()
  const product = products.find((item) => item.id === id)
  const productId = product?.id
  const reviewStorageKey = productId ? `ojay_reviews_${productId}` : ''
  const [reviews, setReviews] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [openSections, setOpenSections] = useState(accordionDefaults)

  useEffect(() => {
    if (!reviewStorageKey) return
    setReviews(loadStoredJson(reviewStorageKey, []))
  }, [reviewStorageKey])

  useEffect(() => {
    if (!productId) return
    const key = 'ojay_recent'
    let next = loadStoredJson(key, [])
    next = [productId, ...next.filter((itemId) => itemId !== productId)].slice(0, 6)
    saveStoredJson(key, next)
  }, [productId])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4)
  }, [product, products])

  if (productsLoading) {
    return (
      <>
        <ProductDetailsLoadingState />
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <div className="page">
        <div className="breadcrumb">Home / Product not found</div>
        <section className="empty-state">
          <h3>Product not found</h3>
          <p className="small-note">This item may have been removed from the marketplace.</p>
          <NavLink className="btn primary" to="/">
            Back home
          </NavLink>
        </section>
        <Footer />
      </div>
    )
  }

  const status = getStockMeta(product.stock)
  const sellerName = buildSellerName(product)
  const reviewCount = reviews.length

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAddQuantity = () => {
    setQuantity((prev) => {
      if (typeof product.stock === 'number') {
        return Math.min(prev + 1, Math.max(product.stock, 1))
      }
      return prev + 1
    })
  }

  const handleSubtractQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product)
    }
  }

  return (
    <div className="page product-page">
      <div className="breadcrumb">
        Home / Hardware & Accessories / Laptop Accessories /{' '}
        <span className="accent-link">{product.name}</span>
      </div>

      <section className="product-detail-shell">
        <div className="product-gallery-panel">
          <div className="product-gallery-main">
            <button className="gallery-arrow" type="button" aria-label="Previous image">
              &lt;
            </button>
            <img
              src={product.image}
              alt={product.name}
              onError={handleImageError}
              data-fallback={product.imageFallback}
            />
            <button className="gallery-arrow" type="button" aria-label="Next image">
              &gt;
            </button>
          </div>
          <div className="product-thumbs">
            <button className="product-thumb active" type="button">
              <img
                src={product.image}
                alt={`${product.name} thumbnail`}
                onError={handleImageError}
                data-fallback={product.imageFallback}
              />
            </button>
            <button className="product-thumb" type="button">
              <img
                src={product.image}
                alt={`${product.name} alternate thumbnail`}
                onError={handleImageError}
                data-fallback={product.imageFallback}
              />
            </button>
          </div>
        </div>

        <div className="product-purchase-panel">
          <h1>{product.name}</h1>
          <p className="seller-line">
            Seller Name : <span>{sellerName}</span>
          </p>
          <strong className="detail-price">{formatPrice(product.price)}</strong>

          <div className="detail-meta-line">
            <span className="muted-inline">★★★★★</span>
            <span className="accent-link">No Reviews</span>
            <span className={`stock-note ${status.tone}`}>{status.label}</span>
          </div>

          <p className="sku-line">SKU: {product.sku}</p>

          <div className="purchase-row">
            <div className="qty-picker">
              <button type="button" onClick={handleSubtractQuantity}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={handleAddQuantity}>
                +
              </button>
            </div>
            <button className="btn primary detail-add-button" type="button" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className={isCompared(product.id) ? 'compare-circle active' : 'compare-circle'}
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-label="Compare product"
            >
              &lt;&gt;
            </button>
          </div>

          <div className="social-row">
            <button type="button">t</button>
            <button type="button">f</button>
            <button type="button">in</button>
            <button type="button">p</button>
            <button
              className={isWishlisted(product.id) ? 'wishlist-btn active inline' : 'wishlist-btn inline'}
              type="button"
              onClick={() => toggleWishlist(product.id)}
            >
              <span aria-hidden="true">&#9829;</span>
            </button>
          </div>

          <div className="detail-accordion">
            <div className="accordion-item">
              <button type="button" className="accordion-head" onClick={() => toggleSection('description')}>
                <span>Product Description</span>
                <span>{openSections.description ? '▼' : '▸'}</span>
              </button>
              {openSections.description && <p>{product.desc}</p>}
            </div>

            <div className="accordion-item">
              <button type="button" className="accordion-head" onClick={() => toggleSection('details')}>
                <span>Product Details</span>
                <span>{openSections.details ? '▼' : '▸'}</span>
              </button>
              {openSections.details && (
                <div className="detail-spec-block">
                  <p>
                    <strong>SKU :</strong> {product.sku}
                  </p>
                  <p>
                    <strong>Condition :</strong> New
                  </p>
                  <p>
                    <strong>Manufacturer :</strong> {product.name.split(' ')[0]}
                  </p>
                  {(product.specs || []).slice(0, 3).map((spec) => (
                    <p key={spec.label}>
                      <strong>{spec.label} :</strong> {spec.value}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="accordion-item">
              <button type="button" className="accordion-head" onClick={() => toggleSection('reviews')}>
                <span>Customer Reviews({reviewCount})</span>
                <span>{openSections.reviews ? '▼' : '▸'}</span>
              </button>
              {openSections.reviews && (
                <div className="detail-spec-block">
                  {reviews.length === 0 ? (
                    <p>No customer reviews yet.</p>
                  ) : (
                    reviews.map((review) => (
                      <p key={review.id}>
                        <strong>{review.name} :</strong> {review.comment}
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="related-products-section">
        <h2>You may also be interested in the following products</h2>
        <div className="market-grid related-grid">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              addToCart={addToCart}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
              isCompared={isCompared}
              toggleCompare={toggleCompare}
              variant="catalog"
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ProductDetails
