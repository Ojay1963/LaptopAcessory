import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'

const faqs = [
  {
    q: 'Do you offer pay on delivery?',
    a: 'Yes. Pay on delivery is available within Lagos for eligible items.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Same-day delivery in Lagos, 2-3 working days nationwide.',
  },
  {
    q: 'What warranty do you provide?',
    a: 'All products include manufacturer warranty and OJ Devices support.',
  },
  {
    q: 'Can I request installation support?',
    a: 'Yes. We offer setup assistance for corporate and premium orders.',
  },
]

const quickActions = [
  'Track an Order',
  'Request a Return',
  'Warranty Check',
  'Repair Booking',
]

function Support() {
  const { pushToast } = useOutletContext()
  const [ticket, setTicket] = useState({
    name: '',
    issueType: 'Delivery Delay',
    orderNumber: '',
    description: '',
  })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const next = {}
    if (!ticket.name.trim()) next.name = 'Name is required.'
    if (!ticket.orderNumber.trim()) next.orderNumber = 'Order number is required.'
    if (ticket.description.trim().length < 10) next.description = 'Add a short description.'
    return next
  }, [ticket])

  const isValid = Object.keys(errors).length === 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setTicket((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched({ name: true, orderNumber: true, description: true })
    if (!isValid) return

    setSubmitted(true)
    setTicket({
      name: '',
      issueType: 'Delivery Delay',
      orderNumber: '',
      description: '',
    })
    pushToast('Support ticket submitted')
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Support Center</h1>
          <p>Priority help for orders, delivery, repairs, and warranties.</p>
        </div>
        <div className="hero-cta">
          <button className="btn primary" type="button">
            Chat with support
          </button>
          <span className="small-note">Avg response time: 3 mins</span>
        </div>
      </section>

      <section className="support-banner">
        <div>
          <h3>Service Status</h3>
          <p className="small-note">All delivery routes operating normally.</p>
        </div>
        <div className="status-badges">
          <span className="status-badge">Lagos: Active</span>
          <span className="status-badge">Abuja: Active</span>
          <span className="status-badge">Port Harcourt: Active</span>
        </div>
      </section>

      <section className="support-grid">
        <div className="support-card">
          <h3>Quick Actions</h3>
          <div className="support-list">
            {quickActions.map((item) => (
              <button key={item} type="button">
                {item} <span aria-hidden="true">-&gt;</span>
              </button>
            ))}
          </div>
          <div>
            <h4>Need urgent help?</h4>
            <p className="small-note">
              Call +234 800 123 4567 for a human specialist.
            </p>
          </div>
        </div>

        <form className="support-panel support-form" onSubmit={handleSubmit}>
          <h3>Open a Ticket</h3>
          <label>
            Full Name
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={ticket.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Issue Type
            <select name="issueType" value={ticket.issueType} onChange={handleChange}>
              <option>Delivery Delay</option>
              <option>Warranty Claim</option>
              <option>Payment Issue</option>
              <option>Technical Setup</option>
            </select>
          </label>
          <label>
            Order Number
            <input
              name="orderNumber"
              type="text"
              placeholder="OJ-2026-1234"
              value={ticket.orderNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.orderNumber && errors.orderNumber && (
              <span className="field-error">{errors.orderNumber}</span>
            )}
          </label>
          <label>
            Describe the Issue
            <textarea
              name="description"
              placeholder="Give us more details..."
              value={ticket.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.description && errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </label>
          <button className="btn primary" type="submit" disabled={!isValid}>
            Submit ticket
          </button>
          {submitted && (
            <div className="payment-status success">
              <h4>Ticket created</h4>
              <p className="small-note">Support will respond with an update shortly.</p>
            </div>
          )}
        </form>
      </section>

      <section className="faq-list">
        {faqs.map((item) => (
          <div key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}

export default Support
