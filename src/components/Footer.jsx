import { NavLink } from 'react-router-dom'
import { footerLinks } from '../data/products'

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>Ojay Tech Hub</h3>
        <p>
          Your one-stop destination for premium laptops and accessories in
          Nigeria. We deliver quality tech to your doorstep with trusted
          warranties.
        </p>
        <div className="socials">
          <span>FB</span>
          <span>IG</span>
          <span>TW</span>
          <span>IN</span>
        </div>
      </div>
      <div>
        <h4>Shop</h4>
        {footerLinks.shop.map((item) => (
          <NavLink key={item} to={item === 'Laptops' ? '/laptops' : item === 'Accessories' ? '/accessories' : '/deals'}>
            {item}
          </NavLink>
        ))}
      </div>
      <div>
        <h4>Support</h4>
        {footerLinks.support.map((item) => (
          <NavLink key={item} to={item === 'Contact Us' ? '/contact' : '/support'}>
            {item}
          </NavLink>
        ))}
      </div>
      <div>
        <h4>Contact</h4>
        <p>123 Computer Village, Ikeja, Lagos, Nigeria</p>
        <p>+234 800 123 4567</p>
        <p>support@ojaytechhub.ng</p>
      </div>
    </footer>
  )
}

export default Footer
