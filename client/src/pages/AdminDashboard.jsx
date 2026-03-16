import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminOverview,
  importImageUrlToCloudinary,
  uploadImageToCloudinary,
  updateAdminOrder,
  updateAdminSettings,
  updateAdminUser,
} from '../lib/api'
import { formatPrice } from '../lib/format'

const initialProduct = {
  name: '',
  category: 'Laptop',
  price: '',
  stock: '',
  image: '',
  imageFallback: '',
  desc: '',
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { authToken, currentUser, authLoading, pushToast } = useOutletContext()
  const [overview, setOverview] = useState(null)
  const [message, setMessage] = useState('')
  const [productForm, setProductForm] = useState(initialProduct)
  const [settingsForm, setSettingsForm] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [remoteImageUrl, setRemoteImageUrl] = useState('')

  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== 'admin')) {
      navigate('/auth')
    }
  }, [authLoading, currentUser, navigate])

  const refreshOverview = useCallback(async () => {
    if (!authToken) return
    try {
      const payload = await getAdminOverview(authToken)
      setOverview(payload)
      setSettingsForm(payload.settings)
    } catch (error) {
      setMessage(error.message)
    }
  }, [authToken])

  useEffect(() => {
    refreshOverview()
  }, [refreshOverview])

  const metrics = overview?.metrics
  const customProducts = useMemo(() => overview?.products || [], [overview])

  if (!currentUser || currentUser.role !== 'admin') return null

  const handleCreateProduct = async (event) => {
    event.preventDefault()
    try {
      await createAdminProduct(
        {
          ...productForm,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          features: [],
          specs: [],
        },
        authToken
      )
      setProductForm(initialProduct)
      pushToast('Product created')
      refreshOverview()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleProductImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setMessage('')
    try {
      const uploaded = await uploadImageToCloudinary(file, authToken)
      setProductForm((prev) => ({
        ...prev,
        image: uploaded.secure_url,
        imageFallback: uploaded.secure_url,
      }))
      pushToast('Image uploaded to Cloudinary')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const handleRemoteImageImport = async () => {
    if (!remoteImageUrl.trim()) return

    setUploadingImage(true)
    setMessage('')
    try {
      const imported = await importImageUrlToCloudinary(
        remoteImageUrl.trim(),
        productForm.name || 'catalog-product',
        authToken
      )
      setProductForm((prev) => ({
        ...prev,
        image: imported.image.secure_url,
        imageFallback: imported.image.secure_url,
      }))
      setRemoteImageUrl('')
      pushToast('Remote image imported to Cloudinary')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUpdateOrder = async (orderId, orderStatus) => {
    await updateAdminOrder(orderId, { orderStatus }, authToken)
    pushToast('Order updated')
    refreshOverview()
  }

  const handleUpdateUser = async (userId, status) => {
    await updateAdminUser(userId, { status }, authToken)
    pushToast('User updated')
    refreshOverview()
  }

  const handleSaveSettings = async (event) => {
    event.preventDefault()
    await updateAdminSettings(settingsForm, authToken)
    pushToast('Settings saved')
    refreshOverview()
  }

  const handleDeleteProduct = async (productId) => {
    await deleteAdminProduct(productId, authToken)
    pushToast('Product deleted')
    refreshOverview()
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users, products, orders, payments, and store settings.</p>
        </div>
        <div className="hero-cta">
          <span>{currentUser.email}</span>
        </div>
      </section>

      {message && <p className="banner-info">{message}</p>}

      <section className="badges">
        <div><h3>Users</h3><p>{metrics?.totalUsers ?? 0}</p></div>
        <div><h3>Orders</h3><p>{metrics?.totalOrders ?? 0}</p></div>
        <div><h3>Revenue</h3><p>{formatPrice(metrics?.totalRevenue ?? 0)}</p></div>
      </section>

      <section className="contact-grid">
        <form className="contact-form" onSubmit={handleCreateProduct}>
          <h3>Add Custom Product</h3>
          <label>Name<input value={productForm.name} onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))} /></label>
          <label>Category<select value={productForm.category} onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}><option>Laptop</option><option>Accessory</option></select></label>
          <label>Price<input value={productForm.price} onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))} /></label>
          <label>Stock<input value={productForm.stock} onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))} /></label>
          <label>
            Upload Image
            <input type="file" accept="image/*" onChange={handleProductImageUpload} disabled={uploadingImage} />
          </label>
          {uploadingImage && <p className="small-note">Uploading image to Cloudinary...</p>}
          <label>
            Import Image from URL
            <input
              value={remoteImageUrl}
              onChange={(event) => setRemoteImageUrl(event.target.value)}
              placeholder="https://example.com/product-image.jpg"
            />
          </label>
          <button className="btn ghost" type="button" onClick={handleRemoteImageImport} disabled={uploadingImage || !remoteImageUrl.trim()}>
            Import URL to Cloudinary
          </button>
          <label>Image URL<input value={productForm.image} onChange={(event) => setProductForm((prev) => ({ ...prev, image: event.target.value }))} /></label>
          {productForm.image && <img src={productForm.image} alt="Product upload preview" className="admin-upload-preview" />}
          <label>Description<textarea value={productForm.desc} onChange={(event) => setProductForm((prev) => ({ ...prev, desc: event.target.value }))} /></label>
          <button className="btn primary" type="submit">Create Product</button>
        </form>

        <form className="contact-form" onSubmit={handleSaveSettings}>
          <h3>Store Settings</h3>
          <label>Store Name<input value={settingsForm?.storeName || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, storeName: event.target.value }))} /></label>
          <label>Support Email<input value={settingsForm?.supportEmail || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportEmail: event.target.value }))} /></label>
          <label>Support Phone<input value={settingsForm?.supportPhone || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportPhone: event.target.value }))} /></label>
          <label>Brevo Sender Email<input value={settingsForm?.brevoSenderEmail || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, brevoSenderEmail: event.target.value }))} /></label>
          <button className="btn primary" type="submit">Save Settings</button>
        </form>
      </section>

      <section className="cart-grid">
        <div className="cart-items">
          <h3>Recent Orders</h3>
          {(overview?.recentOrders || []).map((order) => (
            <div key={order.id} className="cart-item">
              <div>
                <h4>{order.reference}</h4>
                <p className="small-note">{order.customer?.email}</p>
              </div>
              <div>
                <p className="small-note">{order.orderStatus}</p>
                <p className="small-note">{order.paymentStatus}</p>
              </div>
              <div className="product-actions">
                <strong>{formatPrice(order.total)}</strong>
                <button className="btn ghost" type="button" onClick={() => handleUpdateOrder(order.id, 'processing')}>Mark processing</button>
              </div>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Users</h3>
          {(overview?.users || []).slice(0, 8).map((user) => (
            <div key={user.id} className="summary-item">
              <span>{user.email}</span>
              <button className="btn ghost" type="button" onClick={() => handleUpdateUser(user.id, user.status === 'active' ? 'disabled' : 'active')}>
                {user.status === 'active' ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </aside>
      </section>

      <section className="cart-items">
        <h3>Audit Logs</h3>
        {(overview?.auditLogs || []).map((log) => (
          <div key={log.id} className="summary-item">
            <span>{log.action}</span>
            <span>{log.actorEmail}</span>
          </div>
        ))}
      </section>

      <section className="cart-items">
        <h3>Delete Custom Products</h3>
        {customProducts.filter((item) => item.id.startsWith('prd_')).map((product) => (
          <div key={product.id} className="summary-item">
            <span>{product.name}</span>
            <button className="btn ghost" type="button" onClick={() => handleDeleteProduct(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </section>
      <Footer />
    </div>
  )
}

export default AdminDashboard
