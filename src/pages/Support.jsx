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
    a: 'All products include manufacturer warranty and Ojay support.',
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
  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Support Center</h1>
          <p>Priority help for orders, delivery, repairs, and warranties.</p>
        </div>
        <div className="hero-cta">
          <button className="btn primary">Chat with Support</button>
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
                {item} <span>→</span>
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

        <div className="support-panel support-form">
          <h3>Open a Ticket</h3>
          <label>
            Full Name
            <input type="text" placeholder="Enter your name" />
          </label>
          <label>
            Issue Type
            <select>
              <option>Delivery Delay</option>
              <option>Warranty Claim</option>
              <option>Payment Issue</option>
              <option>Technical Setup</option>
            </select>
          </label>
          <label>
            Order Number
            <input type="text" placeholder="OJ-2026-1234" />
          </label>
          <label>
            Describe the Issue
            <textarea placeholder="Give us more details..." />
          </label>
          <button className="btn primary" type="button">
            Submit Ticket
          </button>
        </div>
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
