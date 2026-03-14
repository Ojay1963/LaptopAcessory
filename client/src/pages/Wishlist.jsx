import { NavLink, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, clearWishlist, products, toggleCompare, isCompared } =
    useOutletContext()
  const saved = products.filter((item) => wishlist.includes(item.id))

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Wishlist</h1>
          <p>Keep track of the products you plan to buy later.</p>
        </div>
        <div className="hero-cta">
          <span>{saved.length} saved</span>
          {saved.length > 0 && (
            <button className="btn ghost" type="button" onClick={clearWishlist}>
              Clear wishlist
            </button>
          )}
        </div>
      </section>

      {saved.length === 0 ? (
        <section className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p className="small-note">Browse the catalog and tap the heart icon to save items.</p>
          <NavLink className="btn ghost" to="/laptops">
            Browse products
          </NavLink>
        </section>
      ) : (
        <section className="product-grid">
          {saved.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              addToCart={addToCart}
              isWishlisted={() => true}
              toggleWishlist={toggleWishlist}
              isCompared={isCompared}
              toggleCompare={toggleCompare}
            />
          ))}
        </section>
      )}

      <Footer />
    </div>
  )
}

export default Wishlist
