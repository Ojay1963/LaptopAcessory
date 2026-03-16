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

  return (
    <article className={`product-card market-card ${isCatalog ? 'catalog-tile' : ''}`}>
      <div className="tag">{item.tag}</div>
      <div className="product-card-badges">
        <button
          className={wishlisted ? 'wishlist-btn active' : 'wishlist-btn'}
          type="button"
          onClick={() => toggleWishlist(item.id)}
          aria-label={wishlisted ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
        >
          <span aria-hidden="true">&#9829;</span>
        </button>
        {toggleCompare && (
          <button
            className={compared ? 'compare-btn active' : 'compare-btn'}
            type="button"
            onClick={() => toggleCompare(item.id)}
          >
            {compared ? 'Compared' : 'Compare'}
          </button>
        )}
      </div>

      <NavLink className="market-image-wrap" to={`/product/${item.id}`}>
        <img
          src={item.image}
          alt={item.name}
          onError={handleImageError}
          data-fallback={item.imageFallback}
        />
      </NavLink>

      <div className="product-body">
        <span className="product-brand">{brandLabel}</span>
        <NavLink to={`/product/${item.id}`}>
          <h3>{item.name}</h3>
        </NavLink>
        {!compact && !isCatalog && <p>{item.desc}</p>}
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
      </div>
    </article>
  )
}

export default ProductCard
