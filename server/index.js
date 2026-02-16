import cors from 'cors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { features, footerLinks, products } from '../src/data/products.js'

const app = express()
const PORT = Number(process.env.PORT) || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../dist')

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true,
  })
)

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'ojay-api',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/products', (req, res) => {
  const { category, q, sort } = req.query
  let list = [...products]

  if (category === 'Laptop' || category === 'Accessory') {
    list = list.filter((item) => item.category === category)
  }

  if (typeof q === 'string' && q.trim()) {
    const normalized = q.trim().toLowerCase()
    list = list.filter((item) => {
      const haystack = `${item.name} ${item.desc} ${item.category} ${item.features.join(' ')}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  res.json({
    count: list.length,
    products: list,
  })
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id)
  if (!product) {
    res.status(404).json({ message: 'Product not found' })
    return
  }
  res.json(product)
})

app.get('/api/meta', (_req, res) => {
  res.json({ features, footerLinks })
})

app.use(express.static(distPath))

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next()
    return
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
