import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import { formatItemCount, formatPrice } from '../lib/format'
import { createOrder } from '../lib/api'
import { loadStoredJson, saveStoredJson } from '../lib/storage'

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
  const { cartItems, cartTotal, clearCart, pushToast, authToken, currentUser } = useOutletContext()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialData)
  const [touched, setTouched] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [lastOrder, setLastOrder] = useState(null)
  const deliveryFee = cartTotal > 0 ? 25000 : 0
  const grandTotal = cartTotal + deliveryFee

  const errors = useMemo(() => {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email.'
    if (!/^\+?[0-9\s()-]{8,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone.'
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
    })
    if (!authToken || !currentUser) {
      pushToast('Please sign in before checkout')
      navigate('/auth')
      return
    }
    if (!isValid) return
    setIsProcessing(true)
    try {
      const payload = await createOrder(
        {
          items: cartItems.map((item) => ({ productId: item.id, qty: item.qty })),
          paymentMethod: 'paystack',
          delivery: {
            ...form,
            type: form.delivery,
          },
        },
        authToken
      )
      setOrderRef(payload.order.reference)
      saveStoredJson('ojay_last_order', payload.order)
      setLastOrder(payload.order)

      if (payload.payment.authorizationUrl) {
        window.location.href = payload.payment.authorizationUrl
        return
      }

      setIsPaid(false)
      pushToast(payload.payment.message || 'Order created. Configure Paystack to complete online payment.')
    } catch (error) {
      pushToast(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackHome = () => {
    pushToast('Thanks for shopping with OJ Devices')
    if (isPaid) clearCart()
    navigate('/')
  }

  useEffect(() => {
    setLastOrder(loadStoredJson('ojay_last_order', null))
  }, [])

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Checkout</h1>
          <p>Confirm your delivery details and payment method.</p>
        </div>
        <div className="hero-cta">
          <span>{formatItemCount(cartItems.length, 'line item')}</span>
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
            {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
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
            {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
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
            {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
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
            {touched.city && errors.city && <span className="field-error">{errors.city}</span>}
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
                Back to home
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
                  {item.name} x {item.qty}
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
                Total: {formatPrice(lastOrder.total)} | Items: {lastOrder.items}
              </p>
              <p className="small-note">Provider: {lastOrder.provider || lastOrder.payment}</p>
            </div>
          )}
          <div className={`payment-status ${isPaid ? 'success' : 'pending'}`}>
            <h4>{isPaid ? 'Paid' : 'Awaiting Payment'}</h4>
            <p className="small-note">
              {isPaid
                ? 'Order confirmed. You will receive a confirmation email.'
                : 'Complete the checkout form to initialize secure payment.'}
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  )
}

export default Checkout
