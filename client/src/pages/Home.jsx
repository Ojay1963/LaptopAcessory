import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import CatalogSidebar from '../components/CatalogSidebar'
import CatalogLoadingState from '../components/CatalogLoadingState'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import { countBy, filterProducts, getProductBrand } from '../lib/catalog'

const ITEMS_PER_PAGE = 20

function Home() {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    products,
    productsLoading,
  } = useOutletContext()
  const [sortBy, setSortBy] = useState('featured')
  const [filters, setFilters] = useState({
    category: 'Accessory',
    inStockOnly: false,
    minPrice: '',
    maxPrice: '',
    brands: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const brands = useMemo(
    () =>
      [...new Set(products.filter((item) => item.category === 'Accessory').map((item) => getProductBrand(item)))].sort(),
    [products]
  )
  const featuredBrands = useMemo(() => brands.slice(0, 5), [brands])
  const inStockCount = useMemo(
    () => products.filter((item) => item.category === 'Accessory' && item.stock > 0).length,
    [products]
  )
  const brandCounts = useMemo(() => {
    const filteredForCounts = filterProducts(products, {
      category: 'Accessory',
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brands: [],
    })

    return countBy(filteredForCounts, getProductBrand)
  }, [filters.inStockOnly, filters.maxPrice, filters.minPrice, products])

  const list = useMemo(
    () =>
      filterProducts(products, {
        category: filters.category,
        sortBy,
        inStockOnly: filters.inStockOnly,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        brands: filters.brands,
      }),
    [filters, products, sortBy]
  )
  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE))
  const paginatedList = useMemo(
    () => list.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [currentPage, list]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, filters])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <div className="page catalog-page">
      <div className="breadcrumb">Home / Hardware & Accessories / Laptop Accessories</div>

      <section className="market-hero">
        <div className="market-hero-copy">
          <span className="eyebrow">OJ Devices Marketplace</span>
          <h1>Laptop Accessories</h1>
          <p>
            Shop chargers, audio gear, storage, bags, and desk essentials with a cleaner
            marketplace layout built for quick browsing.
          </p>
          <div className="market-hero-metrics">
            <div>
              <strong>{list.length}</strong>
              <span>Items live</span>
            </div>
            <div>
              <strong>{inStockCount}</strong>
              <span>Ready to ship</span>
            </div>
            <div>
              <strong>{brands.length}</strong>
              <span>Trusted brands</span>
            </div>
          </div>
        </div>
        <div className="market-hero-panel">
          <span className="eyebrow">Popular brands</span>
          <div className="market-hero-pills">
            {featuredBrands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
          <p className="small-note">
            Compare products, shortlist favourites, and move straight into checkout.
          </p>
        </div>
      </section>

      <section className="catalog-header">
        <div>
          <h2>Browse Accessories</h2>
        </div>
        <div className="catalog-sort">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Best Match</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name</option>
          </select>
        </div>
      </section>

      {productsLoading ? (
        <CatalogLoadingState />
      ) : (
        <section className="catalog-layout">
          <CatalogSidebar
            accent="Laptop Accessories"
            filters={filters}
            onFiltersChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            brands={brands}
            brandCounts={brandCounts}
          />

          <div className="catalog-content">
            <div className="catalog-controls compact">
              <span>{list.length} products found</span>
            </div>

            <div className="market-grid">
              {list.length === 0 && (
                <div className="empty-state">No accessories match your filters.</div>
              )}
              {paginatedList.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  addToCart={addToCart}
                  isWishlisted={isWishlisted}
                  toggleWishlist={toggleWishlist}
                  isCompared={isCompared}
                  toggleCompare={toggleCompare}
                  variant="catalog"
                />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default Home
