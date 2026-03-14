import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  requestType: 'Bulk Order',
  message: '',
}

function Contact() {
  const { pushToast } = useOutletContext()
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email.'
    if (!/^\+?[0-9\s()-]{8,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone.'
    if (form.message.trim().length < 12) next.message = 'Add more detail so the team can respond well.'
    return next
  }, [form])

  const isValid = Object.keys(errors).length === 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched({ name: true, email: true, phone: true, message: true })
    if (!isValid) return

    setSubmitted(true)
    setForm(initialForm)
    pushToast('Quote request submitted')
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Contact Us</h1>
          <p>Talk to a specialist about pricing, delivery, or warranties.</p>
        </div>
        <div className="hero-cta">
          <button className="btn primary" type="button">
            Call now
          </button>
          <span className="small-note">24/7 hotline for premium customers</span>
        </div>
      </section>

      <section className="contact-steps">
        <div className="contact-step">
          <h4>Tell Us Your Need</h4>
          <p className="small-note">Share your budget, quantity, and specs.</p>
        </div>
        <div className="contact-step">
          <h4>Get a Curated Quote</h4>
          <p className="small-note">We match you with the best options.</p>
        </div>
        <div className="contact-step">
          <h4>Delivery and Setup</h4>
          <p className="small-note">Same-day delivery within Lagos.</p>
        </div>
      </section>

      <section className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div>
            <h3>Request a Quote</h3>
            <p className="small-note">
              Share what you need and we will reply within 2 hours.
            </p>
          </div>
          <label>
            Full Name
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Email Address
            <input
              name="email"
              type="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Phone Number
            <input
              name="phone"
              type="tel"
              placeholder="+234 800 123 4567"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>
          <label>
            Request Type
            <select name="requestType" value={form.requestType} onChange={handleChange}>
              <option>Bulk Order</option>
              <option>Single Item</option>
              <option>Corporate Setup</option>
              <option>Warranty Support</option>
            </select>
          </label>
          <label>
            Message
            <textarea
              name="message"
              placeholder="Tell us the laptop or accessory you need."
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.message && errors.message && (
              <span className="field-error">{errors.message}</span>
            )}
          </label>
          <button className="btn primary" type="submit" disabled={!isValid}>
            Submit request
          </button>
          {submitted && (
            <div className="payment-status success">
              <h4>Request received</h4>
              <p className="small-note">A sales specialist will reply within 2 business hours.</p>
            </div>
          )}
        </form>

        <div className="contact-card">
          <div>
            <h3>Visit the Lagos Showroom</h3>
            <p>123 Computer Village, Ikeja, Lagos, Nigeria</p>
          </div>
          <div>
            <p>Phone: +234 800 123 4567</p>
            <p>Email: support@ojdevices.ng</p>
            <p>Hours: Mon - Sat, 9am - 7pm</p>
          </div>
          <div className="map-placeholder" />
        </div>
      </section>

      <section className="contact-cta">
        <div>
          <h3>Need immediate procurement support?</h3>
          <p className="small-note">
            We support bulk orders for teams, schools, and businesses.
          </p>
        </div>
        <button className="btn ghost" type="button">
          Schedule a call
        </button>
      </section>

      <section className="contact-extra">
        <div>
          <h4>Corporate Partnerships</h4>
          <p>
            Dedicated account managers, VAT invoices, and staged deliveries for
            teams.
          </p>
        </div>
        <div>
          <h4>Delivery Promise</h4>
          <p>
            Same-day delivery in Lagos, 48 hours in major cities, and tracking
            on every order.
          </p>
        </div>
        <div>
          <h4>Warranty and Repairs</h4>
          <p>
            Certified technicians and genuine parts available for upgrades and
            servicing.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
