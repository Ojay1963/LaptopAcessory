import { NavLink } from 'react-router-dom'
import { footerLinks } from '../data/products'
import brandLogo from '../images/OJ Devices logo.png'

const shopRoutes = {
  Laptops: '/laptops',
  Accessories: '/accessories',
  'New Arrivals': '/search',
  'Deals of the Week': '/deals',
}

const supportRoutes = {
  'Contact Us': '/contact',
  FAQs: '/support',
  'Shipping & Returns': '/support',
  'Warranty Policy': '/support',
}

function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-feature-banner">
        <div className="footer-feature-banner-copy">
          <span className="eyebrow">Shop smarter</span>
          <h3>Take online shopping for accessories and laptops to the next level.</h3>
          <p>
            Explore our tech catalog, compare standout devices, and discover everyday gear built for work, school, and play.
          </p>
        </div>
      </section>

      <section className="trust-bar">
        <div>
          <strong>Refer a friend</strong>
          <span>Invite a friend and get a new coupon.</span>
        </div>
        <div>
          <strong>Free Delivery</strong>
          <span>Nationwide shipping on select orders.</span>
        </div>
        <div>
          <strong>Customer service</strong>
          <span>Friendly support, ready here for you.</span>
        </div>
        <div>
          <strong>Confidence</strong>
          <span>All products come with a 7-day limited return window.</span>
        </div>
      </section>

      <section className="footer footer-reference">
        <div className="footer-reference-brand">
          <div className="footer-brand">
            <img className="footer-brand-logo" src={brandLogo} alt="OJ Devices logo" />
          </div>
          <span className="eyebrow">OJ Devices</span>
          <p>
            Explore a curated range of laptops and accessories built to improve your everyday workflow.
          </p>
          <a href="tel:+23407061989638">+234(0)7061989638</a>
          <a href="mailto:support@ojdevices.ng">support@ojdevices.ng</a>
        </div>
        <div>
          <h4>Shop</h4>
          {footerLinks.shop.map((item) => (
            <NavLink key={item} to={shopRoutes[item]}>
              {item}
            </NavLink>
          ))}
          <NavLink to="/search?q=desktop">Desktops</NavLink>
          <NavLink to="/search?q=gadget">Gadgets</NavLink>
          <NavLink to="/search?q=component">Components</NavLink>
        </div>
        <div>
          <h4>Support</h4>
          {footerLinks.support.map((item) => (
            <NavLink key={item} to={supportRoutes[item]}>
              {item}
            </NavLink>
          ))}
          <NavLink to="/contact">Contact Us</NavLink>
        </div>
        <div className="footer-subscribe-panel">
          <h4>Be the first to know about exclusive laptop deals.</h4>
          <form className="newsletter-form footer-newsletter">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" aria-label="Subscribe">
              Go
            </button>
          </form>
          <form className="newsletter-form footer-newsletter">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" aria-label="Subscribe again">
              Go
            </button>
          </form>
          <p>Subscribe now and get insider-only updates and offers.</p>
        </div>
      </section>

      <div className="footer-bottom footer-bottom-reference">
        <span>© 2026 OJ Devices.</span>
        <div>
          <NavLink to="/support">Refund policy</NavLink>
          <NavLink to="/support">Privacy policy</NavLink>
          <NavLink to="/support">Terms of service</NavLink>
          <NavLink to="/support">Shipping policy</NavLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer
