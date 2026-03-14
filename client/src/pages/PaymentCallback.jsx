import { useEffect, useState } from 'react'
import { NavLink, useOutletContext, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import { verifyPaystack } from '../lib/api'
import { formatPrice } from '../lib/format'

function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const { authToken } = useOutletContext()
  const [result, setResult] = useState({ loading: true, error: '', order: null })

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference || !authToken) {
      setResult({ loading: false, error: 'Missing payment reference or session.', order: null })
      return
    }

    verifyPaystack(reference, authToken)
      .then((payload) => setResult({ loading: false, error: '', order: payload.order }))
      .catch((error) => setResult({ loading: false, error: error.message, order: null }))
  }, [authToken, searchParams])

  return (
    <div className="page">
      <section className="empty-state">
        <h1>Payment Callback</h1>
        {result.loading && <p className="small-note">Verifying your payment...</p>}
        {result.error && <p className="banner-info">{result.error}</p>}
        {result.order && (
          <>
            <p className="small-note">Reference: {result.order.reference}</p>
            <p className="small-note">Status: {result.order.paymentStatus}</p>
            <p className="small-note">Total: {formatPrice(result.order.total)}</p>
          </>
        )}
        <NavLink className="btn primary" to="/account">
          Go to account
        </NavLink>
      </section>
      <Footer />
    </div>
  )
}

export default PaymentCallback
