import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import { getMyOrders } from '../lib/api'
import { formatPrice } from '../lib/format'

function Account() {
  const navigate = useNavigate()
  const { authToken, currentUser, authLoading } = useOutletContext()
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/auth')
    }
  }, [authLoading, currentUser, navigate])

  useEffect(() => {
    if (!authToken) return
    getMyOrders(authToken)
      .then((payload) => setOrders(payload.orders))
      .catch((error) => setMessage(error.message))
  }, [authToken])

  if (!currentUser) return null

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>My Account</h1>
          <p>Track orders, payment status, and your saved account details.</p>
        </div>
        <div className="hero-cta">
          <span>{currentUser.email}</span>
        </div>
      </section>

      <section className="deal-grid">
        <article>
          <h3>Profile</h3>
          <p className="small-note">{currentUser.name}</p>
          <p className="small-note">Role: {currentUser.role}</p>
        </article>
        <article>
          <h3>Order Count</h3>
          <p className="small-note">{orders.length} orders</p>
        </article>
        <article>
          <h3>Next Step</h3>
          <NavLink className="btn ghost" to="/laptops">Continue shopping</NavLink>
        </article>
      </section>

      <section className="cart-items">
        <h3>My Orders</h3>
        {message && <p className="banner-info">{message}</p>}
        {orders.length === 0 ? (
          <div className="empty-state">You have not placed any orders yet.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="cart-item">
              <div>
                <h3>{order.reference}</h3>
                <p className="small-note">{order.items.length} items</p>
              </div>
              <div>
                <p className="small-note">Order: {order.orderStatus}</p>
                <p className="small-note">Payment: {order.paymentStatus}</p>
              </div>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          ))
        )}
      </section>
      <Footer />
    </div>
  )
}

export default Account
