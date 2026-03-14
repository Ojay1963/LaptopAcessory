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
      <section className="newsletter-band">
        <div>
          <h3>Join now and enjoy 5% off your first order.</h3>
          <p>Enjoy special offers, tech trends and update when you subscribe.</p>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit" aria-label="Subscribe">
            {'->'}
          </button>
        </form>
      </section>

      <section className="footer">
        <div>
          <div className="footer-brand">
            <img className="footer-brand-logo" src={brandLogo} alt="OJ Devices logo" />
            <strong>OJ Devices</strong>
          </div>
          <h4>About Us</h4>
          <p>
            OJ Devices is a modern online marketplace for laptops, accessories,
            and reliable everyday tech products for work and home.
          </p>
          <NavLink className="footer-readmore" to="/contact">
            Read More
          </NavLink>
        </div>
        <div>
          <h4>Corporate Information</h4>
          <NavLink to="/contact">About Us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
          <NavLink to="/support">Investor Relations</NavLink>
        </div>
        <div>
          <h4>Important Links</h4>
          {footerLinks.support.map((item) => (
            <NavLink key={item} to={supportRoutes[item]}>
              {item}
            </NavLink>
          ))}
          {footerLinks.shop.map((item) => (
            <NavLink key={item} to={shopRoutes[item]}>
              {item}
            </NavLink>
          ))}
        </div>
        <div>
          <h4>Contact Details</h4>
          <p>29/31, Obafemi Awolowo Way, Ikeja, Lagos</p>
          <p>(+234) 801-4000-567</p>
          <p>hello@ojdevices.ng</p>
        </div>
      </section>

      <div className="footer-bottom">
        Copyright 2026 OJ Devices. All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
