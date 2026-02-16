import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Laptops from './pages/Laptops'
import Accessories from './pages/Accessories'
import Deals from './pages/Deals'
import Support from './pages/Support'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductDetails from './pages/ProductDetails'
import Search from './pages/Search'
import Wishlist from './pages/Wishlist'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
