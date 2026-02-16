import { NavLink, useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import { fallbackImage } from '../data/products'

function formatPrice(value) {
  return `₦${value.toLocaleString('en-NG')}`
}

function handleImageError(event) {
  const fallback = event.currentTarget.dataset.fallback
  event.currentTarget.onerror = null
  event.currentTarget.src = fallback || fallbackImage
}

function Cart() {
  const { cartItems, updateQty, removeItem, cartTotal } = useOutletContext()
  const navigate = useNavigate()
  const deliveryFee = cartTotal > 0 ? 25000 : 0
  const grandTotal = cartTotal + deliveryFee

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Your Cart</h1>
          <p>Review your items and proceed to checkout.</p>
        </div>
        <div className="hero-cta">
          <span>{cartItems.length} items</span>
          <button
            className="btn primary"
            type="button"
            onClick={() => navigate('/checkout')}
          >
            Checkout
          </button>
        </div>
      </section>

      <section className="cart-grid">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <h3>Your cart is empty</h3>
              <p className="small-note">
                Browse the latest laptops and accessories to get started.
              </p>
              <NavLink className="btn ghost" to="/laptops">
                Continue shopping
              </NavLink>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError}
                  data-fallback={item.imageFallback}
                />
                <div className="cart-item-body">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="small-note">{formatPrice(item.price)}</p>
                  </div>
                  <div className="cart-actions">
                    <div className="qty-controls">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong>{formatPrice(item.price * item.qty)}</strong>
              </div>
            ))
          )}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
          <button
            className="btn primary"
            type="button"
            onClick={() => navigate('/checkout')}
            disabled={cartItems.length === 0}
          >
            Continue to Payment
          </button>
          <p className="small-note">
            Secure checkout with card, bank transfer, or pay on delivery.
          </p>
        </aside>
      </section>

      <Footer />
    </div>
  )
}

export default Cart
