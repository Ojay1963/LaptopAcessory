import { NavLink } from 'react-router-dom'
import Footer from '../components/Footer'

function NotFound() {
  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Page not found</h1>
          <p>The page you requested does not exist or may have been moved.</p>
        </div>
        <div className="hero-cta">
          <NavLink className="btn primary" to="/">
            Back home
          </NavLink>
          <NavLink className="btn ghost" to="/search">
            Search catalog
          </NavLink>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default NotFound
