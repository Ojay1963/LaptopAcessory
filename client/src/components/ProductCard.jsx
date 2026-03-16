import { NavLink } from 'react-router-dom'
import Rating from './Rating'
import { getStockMeta, handleImageError } from '../lib/catalog'
import { formatPrice } from '../lib/format'

function getBrandLabel(name) {
  if (!name) return 'OJ Devices'
  const [first, second] = name.split(' ')
  if (!second) return first
  return first.length <= 3 ? `${first} ${second}` : first
}

function cleanDisplayValue(value, fallback) {
  if (!value) return fallback
  return value.replace(/"/g, ' inch').replace(/\s+/g, ' ').trim()
}

function ProductCard({
  item,
  addToCart,
  isWishlisted,
  toggleWishlist,
  isCompared,
  toggleCompare,
  compact = false,
  variant = 'catalog',
}) {
  const status = getStockMeta(item.stock)
  const wishlisted = isWishlisted(item.id)
  const compared = isCompared ? isCompared(item.id) : false
  const isCatalog = variant === 'catalog'
  const brandLabel = getBrandLabel(item.name)
  const comparePrice = Math.round(item.price * 1.18)
  const specsPreview = [
    item.features?.[0],
    item.specs?.[0]?.value,
    item.specs?.[2]?.value,
    item.specs?.[1]?.value,
  ]
    .filter(Boolean)
    .filter((value, currentIndex, values) => values.indexOf(value) === currentIndex)
    .slice(0, 4)
  const displaySize = cleanDisplayValue(item.specs?.[3]?.value, '14 inch')
  const displayCpu = cleanDisplayValue(item.specs?.[0]?.value, 'Intel Core')
  const displayStock = status.label === 'In Stock' ? 'Ready' : status.label

  return (
    <article className={`product-card market-card ${isCatalog ? 'catalog-tile' : ''}`}>
      {isCatalog ? <div className="sale-badge">sale</div> : <div className="tag">{item.tag}</div>}

      <NavLink className="market-image-wrap" to={`/product/${item.id}`}>
        <img src={item.image} alt={item.name} onError={handleImageError} data-fallback={item.imageFallback} />
      </NavLink>

      <div className="product-body">
        <span className="product-brand">{brandLabel}</span>
        <NavLink to={`/product/${item.id}`}>
          <h3>{item.name}</h3>
        </NavLink>

        {!compact && !isCatalog && <p>{item.desc}</p>}

        {isCatalog ? (
          <>
            <div className="reference-price-block">
              <strong className="market-price">{formatPrice(item.price)}</strong>
              <span className="reference-old-price">{formatPrice(comparePrice)}</span>
            </div>
            <p className="reference-spec-copy">{specsPreview.join(' · ')}</p>
            <div className="reference-card-meta">
              <span>Display {displaySize}</span>
              <span>Chip {displayCpu}</span>
              <span>{displayStock}</span>
            </div>
            <div className="reference-card-actions">
              <button
                className={wishlisted ? 'wishlist-btn active' : 'wishlist-btn'}
                type="button"
                onClick={() => toggleWishlist(item.id)}
                aria-label={wishlisted ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
              >
                Save
              </button>
              {toggleCompare && (
                <button
                  className={compared ? 'compare-btn active' : 'compare-btn'}
                  type="button"
                  onClick={() => toggleCompare(item.id)}
                  aria-label={compared ? `Remove ${item.name} from compare` : `Add ${item.name} to compare`}
                >
                  Compare
                </button>
              )}
              {addToCart && (
                <button
                  className="btn primary inline-add"
                  type="button"
                  aria-label={`Add ${item.name} to cart`}
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                >
                  Add to cart
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <strong className="market-price">{formatPrice(item.price)}</strong>
            <Rating value={item.rating} count={isCatalog ? undefined : item.reviewCount} />
            <span className={`stock-note ${status.tone}`}>{status.label}</span>
            <div className="product-actions">
              <NavLink className="btn ghost view-link" to={`/product/${item.id}`}>
                View details
              </NavLink>
              {addToCart && (
                <button
                  className="btn primary inline-add"
                  type="button"
                  aria-label={`Add ${item.name} to cart`}
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                >
                  Add
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export default ProductCard
