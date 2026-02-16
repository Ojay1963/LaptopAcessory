import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { products as localProducts } from '../data/products'
import { getProducts } from '../lib/api'

const THEME_KEY = 'ojay_theme'
const CART_KEY = 'ojay_cart'
const WISHLIST_KEY = 'ojay_wishlist'

function Layout() {
  const [search, setSearch] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [toasts, setToasts] = useState([])
  const [theme, setTheme] = useState('dark')
  const [products, setProducts] = useState(localProducts)
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY)
    const next = saved === 'light' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }, [])

  useEffect(() => {
    const rawCart = localStorage.getItem(CART_KEY)
    if (rawCart) {
      try {
        setCartItems(JSON.parse(rawCart))
      } catch {
        localStorage.removeItem(CART_KEY)
      }
    }
    const rawWishlist = localStorage.getItem(WISHLIST_KEY)
    if (rawWishlist) {
      try {
        setWishlist(JSON.parse(rawWishlist))
      } catch {
        localStorage.removeItem(WISHLIST_KEY)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    const controller = new AbortController()

    const loadProducts = async () => {
      setProductsLoading(true)
      try {
        const apiProducts = await getProducts(controller.signal)
        setProducts(apiProducts)
        setProductsError('')
      } catch (error) {
        if (error.name === 'AbortError') return
        setProducts(localProducts)
        setProductsError('API unavailable, showing local catalog.')
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(THEME_KEY, next)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const pushToast = (message) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 2400)
  }

  const addToCart = (item) => {
    if (item.stock === 0) {
      pushToast(`${item.name} is out of stock`)
      return
    }
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id)
      if (existing) {
        const nextQty =
          typeof item.stock === 'number' ? Math.min(existing.qty + 1, item.stock) : existing.qty + 1
        if (typeof item.stock === 'number' && nextQty === existing.qty) {
          pushToast('Stock limit reached')
          return prev
        }
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, qty: nextQty } : entry
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
    pushToast(`${item.name} added to cart`)
  }

  const updateQty = (id, nextQty) => {
    setCartItems((prev) => {
      if (nextQty <= 0) {
        return prev.filter((entry) => entry.id !== id)
      }
      return prev.map((entry) => {
        if (entry.id !== id) return entry
        const maxQty =
          typeof entry.stock === 'number' ? Math.max(1, entry.stock) : nextQty
        const safeQty = Math.min(nextQty, maxQty)
        return { ...entry, qty: safeQty }
      })
    })
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((entry) => entry.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        pushToast('Removed from wishlist')
        return prev.filter((itemId) => itemId !== id)
      }
      pushToast('Added to wishlist')
      return [...prev, id]
    })
  }

  const isWishlisted = (id) => wishlist.includes(id)

  const clearWishlist = () => {
    setWishlist([])
    pushToast('Wishlist cleared')
  }

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems]
  )
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty * item.price, 0),
    [cartItems]
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <NavLink className="brand-mark" to="/">
            Ojay
          </NavLink>
          <span className="brand-sub">Tech Hub</span>
        </div>
        <form className="search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search laptops, accessories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <nav className="nav-links">
          <NavLink to="/laptops">Laptops</NavLink>
          <NavLink to="/accessories">Accessories</NavLink>
          <NavLink to="/deals">Deals</NavLink>
          <NavLink to="/wishlist">Wishlist</NavLink>
          <NavLink to="/support">Support</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <NavLink className="cart-link" to="/cart">
            Cart <span className="cart-count">{cartCount}</span>
          </NavLink>
        </div>
      </header>

      <main>
        <Outlet
          context={{
            addToCart,
            cartItems,
            updateQty,
            removeItem,
            cartTotal,
            clearCart,
            pushToast,
            wishlist,
            toggleWishlist,
            isWishlisted,
            clearWishlist,
            products,
            productsLoading,
            productsError,
          }}
        />
      </main>

      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Layout
