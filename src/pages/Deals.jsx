import Footer from '../components/Footer'
import { fallbackImage } from '../data/products'

function handleImageError(event) {
  const fallback = event.currentTarget.dataset.fallback
  event.currentTarget.onerror = null
  event.currentTarget.src = fallback || fallbackImage
}

function Deals() {
  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Deals of the Week</h1>
          <p>Limited-time offers across laptops and accessories.</p>
        </div>
        <div className="hero-cta">
          <span>Updated every Friday</span>
          <button className="btn primary">Get Alerts</button>
        </div>
      </section>

      <section className="deal-hero">
        <div>
          <h2>Weekend Flash Sale</h2>
          <p>
            Save up to 20% on creator laptops, plus free delivery in Lagos for
            orders above ₦500,000.
          </p>
          <div className="deal-hero-actions">
            <button className="btn primary">Shop Flash Sale</button>
            <button className="btn ghost">Set Reminder</button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1517059224940-d4af9eec41c7?q=80&w=1200&auto=format&fit=crop"
          alt="Laptop deal"
          onError={handleImageError}
          data-fallback={fallbackImage}
        />
      </section>

      <section className="deal-strip">
        <div className="deal-tile">
          <h3>Creator Bundle</h3>
          <p className="small-note">Save 15% on select laptops plus accessories.</p>
          <strong>₦250,000 off</strong>
          <button className="btn ghost">Shop Bundle</button>
        </div>
        <div className="deal-tile">
          <h3>Student Picks</h3>
          <p className="small-note">Extra discount for verified student emails.</p>
          <strong>₦120,000 off</strong>
          <button className="btn ghost">Verify Now</button>
        </div>
        <div className="deal-tile">
          <h3>Accessory Stack</h3>
          <p className="small-note">Buy 2 accessories, get 1 at 50% off.</p>
          <strong>Limited slots</strong>
          <button className="btn ghost">View Details</button>
        </div>
        <div className="deal-tile">
          <h3>Corporate Packs</h3>
          <p className="small-note">Bulk pricing for teams of 10+ devices.</p>
          <strong>Custom Quote</strong>
          <button className="btn ghost">Talk to Sales</button>
        </div>
      </section>

      <section className="deal-grid">
        <article>
          <h3>Trade-In Upgrade</h3>
          <p>Trade your old laptop and save on the next device.</p>
          <button className="btn ghost">Check Eligibility</button>
        </article>
        <article>
          <h3>Free Setup</h3>
          <p>Complimentary setup for premium orders above ₦2,000,000.</p>
          <button className="btn ghost">Learn More</button>
        </article>
        <article>
          <h3>Weekend Flash</h3>
          <p>Free delivery on all orders above ₦500,000.</p>
          <button className="btn ghost">See Details</button>
        </article>
      </section>

      <Footer />
    </div>
  )
}

export default Deals
