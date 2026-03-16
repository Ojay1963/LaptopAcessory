import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import CatalogSidebar from '../components/CatalogSidebar'
import CatalogLoadingState from '../components/CatalogLoadingState'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import { countBy, filterProducts, getProductBrand } from '../lib/catalog'

const ITEMS_PER_PAGE = 20

function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    products,
    productsLoading,
  } = useOutletContext()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [filters, setFilters] = useState({
    category: 'All',
    inStockOnly: false,
    minPrice: '',
    maxPrice: '',
    brands: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const brands = useMemo(
    () => [...new Set(products.map((item) => getProductBrand(item)))].sort(),
    [products]
  )
  const brandCounts = useMemo(() => {
    const filteredForCounts = filterProducts(products, {
      category: filters.category,
      query,
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brands: [],
    })

    return countBy(filteredForCounts, getProductBrand)
  }, [filters.category, filters.inStockOnly, filters.maxPrice, filters.minPrice, products, query])
  const categoryCounts = useMemo(() => {
    const filteredForCounts = filterProducts(products, {
      category: 'All',
      query,
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brands: filters.brands,
    })
    const counts = countBy(filteredForCounts, (item) => item.category)

    return {
      All: filteredForCounts.length,
      Laptop: counts.Laptop || 0,
      Accessory: counts.Accessory || 0,
    }
  }, [filters.brands, filters.inStockOnly, filters.maxPrice, filters.minPrice, products, query])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setQuery(params.get('q') || '')
  }, [location.search])

  const filtered = useMemo(() => {
    return filterProducts(products, {
      category: filters.category,
      query,
      sortBy,
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brands: filters.brands,
    })
  }, [filters, products, query, sortBy])
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginatedList = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [currentPage, filtered]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [query, sortBy, filters])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="page catalog-page">
      <div className="breadcrumb">Home / Search / Results</div>

      <section className="catalog-header">
        <div>
          <h1>Search results</h1>
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
            accent="Search Filters"
            filters={filters}
            onFiltersChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            brands={brands}
            brandCounts={brandCounts}
            categoryCounts={categoryCounts}
            showCategory
          />

          <div className="catalog-content">
            <div className="catalog-controls search-mode">
              <form className="filter-search" onSubmit={handleSubmit}>
                <input
                  type="search"
                  placeholder="Search products"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </form>
              <span>{filtered.length} products found</span>
            </div>

            <div className="market-grid">
              {filtered.length === 0 && (
                <div className="empty-state">No products matched your search.</div>
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

export default Search
