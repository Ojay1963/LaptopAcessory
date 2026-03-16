import { useEffect, useMemo, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import CatalogLoadingState from '../components/CatalogLoadingState'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import { filterProducts, getProductBrand } from '../lib/catalog'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const ITEMS_PER_PAGE = 16
const collectionTabs = ['Mini', 'Standard 14"', 'Widescreen 16"', 'High Performance 16"']

function Laptops() {
  const query = useQuery().get('q') || ''
  const { addToCart, toggleWishlist, isWishlisted, toggleCompare, isCompared, products, productsLoading } =
    useOutletContext()
  const [sortBy, setSortBy] = useState('featured')
  const [filters, setFilters] = useState({
    category: 'Laptop',
    inStockOnly: false,
    minPrice: '',
    maxPrice: '',
    brands: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCollection, setActiveCollection] = useState(collectionTabs[0])

  const brands = useMemo(
    () =>
      [...new Set(products.filter((item) => item.category === 'Laptop').map((item) => getProductBrand(item)))].sort(),
    [products]
  )

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

  const promoTile = {
    id: 'promo-smart-tech',
    eyebrow: 'Smart Tech.',
    title: 'Elevate your digital lifestyle with the cutting-edge smart world.',
    cta: 'Shop now',
  }

  const mixedGridItems = useMemo(() => {
    if (paginatedList.length < 8) return paginatedList
    const next = [...paginatedList]
    next.splice(7, 0, promoTile)
    return next
  }, [paginatedList])

  useEffect(() => {
    setCurrentPage(1)
  }, [query, sortBy, filters])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <div className="page catalog-page catalog-page-reference">
      <div className="breadcrumb breadcrumb-reference">
        <span>⌂</span>
        <span>Collections</span>
        <span>Laptops</span>
      </div>

      <section className="catalog-hero-reference">
        <h1>Laptops</h1>
        <div className="catalog-watermark" aria-hidden="true">
          Laptop Computing
        </div>
      </section>

      <section className="catalog-toolbar-reference">
        <div className="catalog-toolbar-left">
          <button className="filter-button-reference" type="button">
            ⌘ Show filters
          </button>

          <div className="collection-tabs-reference">
            {collectionTabs.map((tab) => (
              <button
                key={tab}
                className={activeCollection === tab ? 'active' : ''}
                type="button"
                onClick={() => setActiveCollection(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-sort catalog-sort-reference">
          <span>Sort by:</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Date, new to old</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="rating">Top rated</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </section>

      {productsLoading ? (
        <CatalogLoadingState />
      ) : (
        <section className="catalog-content catalog-content-reference">
          <div className="catalog-controls compact catalog-controls-reference">
            <span>{list.length} products found</span>

            <div className="catalog-brand-pills">
              {brands.slice(0, 5).map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={filters.brands.includes(brand) ? 'active' : ''}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      brands: prev.brands.includes(brand)
                        ? prev.brands.filter((item) => item !== brand)
                        : [brand],
                    }))
                  }
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="market-grid market-grid-reference">
            {list.length === 0 && <div className="empty-state">No laptops match your filters.</div>}
            {mixedGridItems.map((item) =>
              item.id === promoTile.id ? (
                <aside key={item.id} className="catalog-promo-card">
                  <div className="catalog-promo-image" />
                  <div className="catalog-promo-content">
                    <span>{promoTile.eyebrow}</span>
                    <h3>{promoTile.title}</h3>
                    <button type="button">{promoTile.cta} →</button>
                  </div>
                </aside>
              ) : (
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
              )
            )}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
      )}

      <Footer />
    </div>
  )
}

export default Laptops
