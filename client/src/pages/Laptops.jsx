import { useEffect, useMemo, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import CatalogSidebar from '../components/CatalogSidebar'
import CatalogLoadingState from '../components/CatalogLoadingState'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import { countBy, filterProducts, getProductBrand } from '../lib/catalog'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const ITEMS_PER_PAGE = 16

function Laptops() {
  const query = useQuery().get('q') || ''
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
    category: 'Laptop',
    inStockOnly: false,
    minPrice: '',
    maxPrice: '',
    brands: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const brands = useMemo(
    () =>
      [...new Set(products.filter((item) => item.category === 'Laptop').map((item) => getProductBrand(item)))].sort(),
    [products]
  )
  const brandCounts = useMemo(() => {
    const filteredForCounts = filterProducts(products, {
      category: 'Laptop',
      query,
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brands: [],
    })

    return countBy(filteredForCounts, getProductBrand)
  }, [filters.inStockOnly, filters.maxPrice, filters.minPrice, products, query])

  const list = useMemo(
    () =>
      filterProducts(products, {
        category: filters.category,
        query,
        sortBy,
        inStockOnly: filters.inStockOnly,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        brands: filters.brands,
      }),
    [filters, products, query, sortBy]
  )
  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE))
  const paginatedList = useMemo(
    () => list.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [currentPage, list]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [query, sortBy, filters])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <div className="page catalog-page">
      <div className="breadcrumb">Home / Computers / Laptops</div>

      <section className="catalog-header">
        <div>
          <h1>Laptops</h1>
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
              {list.length === 0 && <div className="empty-state">No laptops match your filters.</div>}
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

export default Laptops
