import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import CompareTray from './CompareTray'
import { products as fallbackProducts } from '../data/products'
import brandLogo from '../images/OJ Devices logo.png'
import {
  clearStoredSession,
  getMe,
  getProducts,
  getStoredRefreshToken,
  getStoredToken,
  logoutSession,
  refreshSession,
  storeRefreshToken,
  storeToken,
} from '../lib/api'
import { formatPrice } from '../lib/format'
import { loadStoredJson, removeStoredValue, saveStoredJson } from '../lib/storage'

const CART_KEY = 'ojay_cart'
const WISHLIST_KEY = 'ojay_wishlist'
const COMPARE_KEY = 'ojay_compare'
const navLinks = [
  { label: 'Laptops', to: '/laptops' },
  { label: 'Phones', to: '/search?q=phone' },
  { label: 'Desktops', to: '/search?q=desktop' },
  { label: 'Smart Gadgets', to: '/accessories' },
  { label: 'Accessories', to: '/accessories' },
  { label: 'Components', to: '/search?q=component' },
  { label: 'Reviews', to: '/support' },
]

function Layout() {
  const [search, setSearch] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [cartHydrated, setCartHydrated] = useState(false)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setCartItems(loadStoredJson(CART_KEY, []))
    setWishlist(loadStoredJson(WISHLIST_KEY, []))
    setCompareIds(loadStoredJson(COMPARE_KEY, []))
    setCartHydrated(true)
  }, [])

  useEffect(() => {
    saveStoredJson(CART_KEY, cartItems)
  }, [cartItems])

  useEffect(() => {
    saveStoredJson(WISHLIST_KEY, wishlist)
  }, [wishlist])

  useEffect(() => {
    saveStoredJson(COMPARE_KEY, compareIds)
  }, [compareIds])

  useEffect(() => {
    const controller = new AbortController()

    const loadProducts = async () => {
      setProductsLoading(true)
      try {
        const apiProducts = await getProducts(controller.signal)
        setProducts(Array.isArray(apiProducts) && apiProducts.length > 0 ? apiProducts : fallbackProducts)
        setProductsError('')
      } catch (error) {
        if (error.name === 'AbortError') return
        setProducts(fallbackProducts)
        setProductsError('')
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const token = getStoredToken()
    const storedRefreshToken = getStoredRefreshToken()

    if (!token && !storedRefreshToken) {
      setAuthLoading(false)
      return
    }

    if (token) setAuthToken(token)
    if (storedRefreshToken) setRefreshToken(storedRefreshToken)

    const restoreSession = async () => {
      try {
        if (token) {
          try {
            const payload = await getMe(token)
            setCurrentUser(payload.user)
            return
          } catch {
            if (!storedRefreshToken) throw new Error('Session expired')
          }
        }

        if (storedRefreshToken) {
          const refreshed = await refreshSession(storedRefreshToken)
          storeToken(refreshed.token)
          storeRefreshToken(refreshed.refreshToken)
          setAuthToken(refreshed.token)
          setRefreshToken(refreshed.refreshToken)
          setCurrentUser(refreshed.user)
        }
      } catch {
        clearStoredSession()
        setAuthToken('')
        setRefreshToken('')
        setCurrentUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    restoreSession()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const completeAuth = ({ token, refreshToken: nextRefreshToken, user }) => {
    storeToken(token)
    storeRefreshToken(nextRefreshToken || '')
    setAuthToken(token)
    setRefreshToken(nextRefreshToken || '')
    setCurrentUser(user)
  }

  const logout = async () => {
    const activeRefreshToken = refreshToken || getStoredRefreshToken()

    try {
      if (activeRefreshToken) {
        await logoutSession(activeRefreshToken)
      }
    } catch {
      // Keep local logout resilient if revoke fails.
    }

    clearStoredSession()
    setAuthToken('')
    setRefreshToken('')
    setCurrentUser(null)
    pushToast('Signed out successfully')
    navigate('/')
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

        return prev.map((entry) => (entry.id === item.id ? { ...entry, qty: nextQty } : entry))
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
        const maxQty = typeof entry.stock === 'number' ? Math.max(1, entry.stock) : nextQty
        return { ...entry, qty: Math.min(nextQty, maxQty) }
      })
    })
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((entry) => entry.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
    removeStoredValue(CART_KEY)
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

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        pushToast('Removed from compare')
        return prev.filter((itemId) => itemId !== id)
      }

      if (prev.length >= 4) {
        pushToast('Compare tray is full')
        return prev
      }

      pushToast('Added to compare')
      return [...prev, id]
    })
  }

  const removeFromCompare = (id) => {
    setCompareIds((prev) => prev.filter((itemId) => itemId !== id))
  }

  const clearCompare = () => {
    setCompareIds([])
    removeStoredValue(COMPARE_KEY)
    setCompareOpen(false)
  }

  const isWishlisted = (id) => wishlist.includes(id)
  const isCompared = (id) => compareIds.includes(id)

  const clearWishlist = () => {
    setWishlist([])
    pushToast('Wishlist cleared')
    removeStoredValue(WISHLIST_KEY)
  }

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.qty, 0), [cartItems])
  const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + item.qty * item.price, 0), [cartItems])
  const compareProducts = useMemo(
    () => compareIds.map((id) => products.find((item) => item.id === id)).filter(Boolean),
    [compareIds, products]
  )

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="announcement-bar">
        <div className="announcement-socials" aria-hidden="true">
          <span>f</span>
          <span>x</span>
          <span>ig</span>
          <span>yt</span>
          <span>tt</span>
        </div>
        <p>Great news! You can now enjoy free nationwide delivery on all orders this season.</p>
      </div>

      <header className="topbar topbar-reference">
        <NavLink className="brand-mark brand-mark-reference" to="/" aria-label="OJ Devices home">
          <img className="brand-logo brand-logo-reference" src={brandLogo} alt="OJ Devices logo" />
          <span className="brand-name-reference">OJ Devices</span>
        </NavLink>

        <nav className="primary-nav" aria-label="Primary">
          {navLinks.map((item) => (
            <NavLink key={item.label} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions topbar-actions-reference">
          <form className="search search-compact" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" aria-label="Search">
              Go
            </button>
          </form>
          {currentUser ? (
            <>
              {currentUser.role === 'admin' ? (
                <NavLink className="icon-link" to="/admin" aria-label="Admin dashboard">
                  Admin
                </NavLink>
              ) : (
                <NavLink className="icon-link" to="/account" aria-label="Account">
                  Account
                </NavLink>
              )}
              <button className="icon-link" type="button" onClick={logout} aria-label="Logout">
                Logout
              </button>
            </>
          ) : (
            <NavLink className="icon-link" to="/auth" aria-label="Sign in">
              {authLoading ? '...' : 'Sign in'}
            </NavLink>
          )}
          <button
            className={compareProducts.length > 0 ? 'icon-link active' : 'icon-link'}
            type="button"
            onClick={() => setCompareOpen(true)}
            aria-label="Compare products"
          >
            Compare
            {compareProducts.length > 0 && <span className="icon-count">{compareProducts.length}</span>}
          </button>
          <NavLink className="icon-link" to="/wishlist" aria-label="Wishlist">
            Wishlist
          </NavLink>
          <NavLink className="icon-link" to="/cart" aria-label="Cart">
            Cart
            <span className="icon-count">{cartCount}</span>
          </NavLink>
        </div>
      </header>

      <main id="main-content">
        <Outlet
          context={{
            addToCart,
            cartItems,
            cartHydrated,
            updateQty,
            removeItem,
            cartTotal,
            clearCart,
            pushToast,
            wishlist,
            toggleWishlist,
            isWishlisted,
            clearWishlist,
            compareIds,
            toggleCompare,
            isCompared,
            clearCompare,
            products,
            productsLoading,
            productsError,
            authToken,
            currentUser,
            authLoading,
            completeAuth,
            logout,
          }}
        />
      </main>

      {compareProducts.length > 0 && (
        <CompareTray
          items={compareProducts}
          clearCompare={clearCompare}
          openCompare={() => setCompareOpen(true)}
          removeFromCompare={removeFromCompare}
        />
      )}

      {compareOpen && compareProducts.length > 0 && (
        <div className="modal-backdrop">
          <div className="modal compare-modal">
            <div className="modal-head">
              <div>
                <h3>Compare products</h3>
                <p className="small-note">A fast side-by-side view before checkout.</p>
              </div>
              <button className="btn ghost" type="button" onClick={() => setCompareOpen(false)}>
                Close
              </button>
            </div>
            <div className="compare-grid">
              {compareProducts.map((item) => (
                <article key={item.id} className="compare-panel">
                  <img src={item.image} alt={item.name} />
                  <div className="compare-panel-head">
                    <h4>{item.name}</h4>
                    <strong>{formatPrice(item.price)}</strong>
                  </div>
                  <div className="compare-pill-row">
                    {item.features.map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>
                  <ul className="compare-specs">
                    {(item.specs || []).slice(0, 5).map((spec) => (
                      <li key={spec.label}>
                        <span>{spec.label}</span>
                        <strong>{spec.value}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="compare-panel-actions">
                    <NavLink className="btn ghost" to={`/product/${item.id}`} onClick={() => setCompareOpen(false)}>
                      View details
                    </NavLink>
                    <button className="btn primary" type="button" onClick={() => addToCart(item)}>
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast" role="status">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Layout
