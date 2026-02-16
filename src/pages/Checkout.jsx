import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'

function formatPrice(value) {
  return `₦${value.toLocaleString('en-NG')}`
}

const initialData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  payment: 'Card',
  delivery: 'Standard',
}

function Checkout() {
  const { cartItems, cartTotal, clearCart, pushToast } = useOutletContext()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialData)
  const [touched, setTouched] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const deliveryFee = cartTotal > 0 ? 25000 : 0
  const grandTotal = cartTotal + deliveryFee

  const errors = useMemo(() => {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!form.email.includes('@')) next.email = 'Enter a valid email.'
    if (form.phone.trim().length < 8) next.phone = 'Enter a valid phone.'
    if (!form.address.trim()) next.address = 'Delivery address is required.'
    if (!form.city.trim()) next.city = 'City is required.'
    return next
  }, [form])

  const isValid = Object.keys(errors).length === 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
    })
    if (!isValid) return
    setIsModalOpen(true)
  }

  const handleConfirmPayment = () => {
    setIsModalOpen(false)
    setIsProcessing(true)
    const ref = `OJ-${Date.now().toString().slice(-6)}`
    setOrderRef(ref)
    setTimeout(() => {
      const payload = {
        ref,
        total: grandTotal,
        items: cartItems.length,
        date: new Date().toISOString(),
        payment: form.payment,
      }
      localStorage.setItem('ojay_last_order', JSON.stringify(payload))
      setLastOrder(payload)
      setIsProcessing(false)
      setIsPaid(true)
      clearCart()
      pushToast('Payment confirmed')
    }, 1600)
  }

  const handleBackHome = () => {
    pushToast('Thanks for shopping with Ojay Tech Hub')
    navigate('/')
  }

  useEffect(() => {
    const raw = localStorage.getItem('ojay_last_order')
    if (!raw) return
    try {
      setLastOrder(JSON.parse(raw))
    } catch {
      localStorage.removeItem('ojay_last_order')
    }
  }, [])

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Checkout</h1>
          <p>Confirm your delivery details and payment method.</p>
        </div>
        <div className="hero-cta">
          <span>{cartItems.length} items</span>
          <span className="small-note">Total: {formatPrice(grandTotal)}</span>
        </div>
      </section>

      <section className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div>
            <h3>Customer Details</h3>
            <p className="small-note">We will confirm your order by phone.</p>
          </div>
          <label>
            Full Name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              disabled={isProcessing || isPaid}
            />
            {touched.name && errors.name && (
              <span className="field-error">{errors.name}</span>
            )}
          </label>
          <label>
            Email Address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="name@email.com"
              disabled={isProcessing || isPaid}
            />
            {touched.email && errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </label>
          <label>
            Phone Number
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+234 800 123 4567"
              disabled={isProcessing || isPaid}
            />
            {touched.phone && errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </label>
          <label>
            Delivery Address
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Street address"
              disabled={isProcessing || isPaid}
            />
            {touched.address && errors.address && (
              <span className="field-error">{errors.address}</span>
            )}
          </label>
          <label>
            City
            <input
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Lagos"
              disabled={isProcessing || isPaid}
            />
            {touched.city && errors.city && (
              <span className="field-error">{errors.city}</span>
            )}
          </label>
          <label>
            Payment Method
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              disabled={isProcessing || isPaid}
            >
              <option>Card</option>
              <option>Bank Transfer</option>
              <option>Pay on Delivery</option>
            </select>
          </label>
          <label>
            Delivery Type
            <select
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
              disabled={isProcessing || isPaid}
            >
              <option>Standard</option>
              <option>Express</option>
            </select>
          </label>
          <button
            className={`btn primary ${isProcessing ? 'loading' : ''}`}
            type="submit"
            disabled={!isValid || isProcessing || isPaid || cartItems.length === 0}
          >
            {isProcessing ? 'Processing Payment...' : 'Place Order'}
          </button>
          {cartItems.length === 0 && (
            <NavLink className="btn ghost" to="/laptops">
              Continue shopping
            </NavLink>
          )}
          {isPaid && (
            <div className="payment-status success">
              <h4>Payment confirmed</h4>
              <p className="small-note">
                Reference: {orderRef}. We will contact you shortly.
              </p>
              <button className="btn ghost" type="button" onClick={handleBackHome}>
                Back to Home
              </button>
            </div>
          )}
        </form>

        <aside className="checkout-summary">
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
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          {lastOrder && (
            <div className="last-order">
              <h4>Last Order</h4>
              <p className="small-note">Ref: {lastOrder.ref}</p>
              <p className="small-note">
                Total: {formatPrice(lastOrder.total)} · Items: {lastOrder.items}
              </p>
            </div>
          )}
          <div className={`payment-status ${isPaid ? 'success' : 'pending'}`}>
            <h4>{isPaid ? 'Paid' : 'Awaiting Payment'}</h4>
            <p className="small-note">
              {isPaid
                ? 'Order confirmed. You will receive a confirmation email.'
                : 'Complete the checkout form to enable payment.'}
            </p>
          </div>
        </aside>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-head">
              <h3>Choose Payment Provider</h3>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
            <p className="small-note">
              This is a demo checkout. Pick a provider to simulate payment.
            </p>
            <div className="modal-actions">
              <button className="btn primary" type="button" onClick={handleConfirmPayment}>
                Pay with Paystack
              </button>
              <button className="btn ghost" type="button" onClick={handleConfirmPayment}>
                Pay with Flutterwave
              </button>
              <button className="btn ghost" type="button" onClick={handleConfirmPayment}>
                Bank Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Checkout
