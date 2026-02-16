import Footer from '../components/Footer'

function Contact() {
  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Contact Us</h1>
          <p>Talk to a specialist about pricing, delivery, or warranties.</p>
        </div>
        <div className="hero-cta">
          <button className="btn primary">Call Now</button>
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
          <h4>Delivery & Setup</h4>
          <p className="small-note">Same-day delivery within Lagos.</p>
        </div>
      </section>

      <section className="contact-grid">
        <form className="contact-form">
          <div>
            <h3>Request a Quote</h3>
            <p className="small-note">
              Share what you need and we will reply within 2 hours.
            </p>
          </div>
          <label>
            Full Name
            <input type="text" placeholder="Enter your name" />
          </label>
          <label>
            Email Address
            <input type="email" placeholder="name@email.com" />
          </label>
          <label>
            Phone Number
            <input type="tel" placeholder="+234 800 123 4567" />
          </label>
          <label>
            Request Type
            <select>
              <option>Bulk Order</option>
              <option>Single Item</option>
              <option>Corporate Setup</option>
              <option>Warranty Support</option>
            </select>
          </label>
          <label>
            Message
            <textarea placeholder="Tell us the laptop or accessory you need." />
          </label>
          <button className="btn primary" type="button">
            Submit Request
          </button>
        </form>

        <div className="contact-card">
          <div>
            <h3>Visit the Lagos Showroom</h3>
            <p>123 Computer Village, Ikeja, Lagos, Nigeria</p>
          </div>
          <div>
            <p>Phone: +234 800 123 4567</p>
            <p>Email: support@ojaytechhub.ng</p>
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
          Schedule a Call
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
          <h4>Warranty & Repairs</h4>
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
