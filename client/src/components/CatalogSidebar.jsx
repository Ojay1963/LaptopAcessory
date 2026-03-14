import { useMemo, useState } from 'react'

const sectionDefaults = {
  price: true,
  category: true,
  brand: true,
  availability: true,
}

function SidebarSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="sidebar-section">
      <button className="filter-row-button" type="button" onClick={onToggle}>
        <span>{title}</span>
        <span aria-hidden="true">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="sidebar-section-body">{children}</div>}
    </div>
  )
}

function CatalogSidebar({
  title = 'Filters',
  accent = 'Laptop Accessories',
  filters,
  onFiltersChange,
  brands = [],
  brandCounts = {},
  categoryCounts = {},
  showCategory = false,
}) {
  const [openSections, setOpenSections] = useState(sectionDefaults)

  const selectedBrandSet = useMemo(() => new Set(filters.brands || []), [filters.brands])

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleBrand = (brand) => {
    const nextBrands = selectedBrandSet.has(brand)
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand]

    onFiltersChange({ brands: nextBrands })
  }

  const resetFilters = () => {
    onFiltersChange({
      category: showCategory ? 'All' : filters.category,
      inStockOnly: false,
      minPrice: '',
      maxPrice: '',
      brands: [],
    })
  }

  const allCount = categoryCounts.All ?? 0
  const laptopCount = categoryCounts.Laptop ?? 0
  const accessoryCount = categoryCounts.Accessory ?? 0

  return (
    <aside className="catalog-sidebar">
      <div className="catalog-sidebar-card">
        <div className="catalog-sidebar-heading">
          <strong>{title}</strong>
          <button className="sidebar-reset" type="button" onClick={resetFilters}>
            Reset
          </button>
        </div>

        <SidebarSection
          title="Price"
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="price-filter">
            <div className="price-filter-top">
              <span>Min</span>
              <span>Max</span>
            </div>
            <div className="inline-price-inputs sidebar-price-inputs">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(event) => onFiltersChange({ minPrice: event.target.value })}
                placeholder="0"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(event) => onFiltersChange({ maxPrice: event.target.value })}
                placeholder="3500000"
              />
            </div>
          </div>
        </SidebarSection>

        {showCategory && (
          <SidebarSection
            title="Category"
            isOpen={openSections.category}
            onToggle={() => toggleSection('category')}
          >
            <label className="sidebar-option">
              <input
                type="radio"
                checked={filters.category === 'All'}
                disabled={allCount === 0}
                onChange={() => onFiltersChange({ category: 'All' })}
              />
              <span className="sidebar-option-label">All ({allCount})</span>
            </label>
            <label className="sidebar-option">
              <input
                type="radio"
                checked={filters.category === 'Laptop'}
                disabled={laptopCount === 0}
                onChange={() => onFiltersChange({ category: 'Laptop' })}
              />
              <span className="sidebar-option-label">Laptops ({laptopCount})</span>
            </label>
            <label className="sidebar-option">
              <input
                type="radio"
                checked={filters.category === 'Accessory'}
                disabled={accessoryCount === 0}
                onChange={() => onFiltersChange({ category: 'Accessory' })}
              />
              <span className="sidebar-option-label">Accessories ({accessoryCount})</span>
            </label>
          </SidebarSection>
        )}

        <SidebarSection
          title="Brand"
          isOpen={openSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <div className="sidebar-options-list">
            {brands.length === 0 ? (
              <p className="small-note">No brand filters available.</p>
            ) : (
              brands.map((brand) => (
                <label
                  key={brand}
                  className={`sidebar-option${(brandCounts[brand] ?? 0) === 0 ? ' is-disabled' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrandSet.has(brand)}
                    disabled={(brandCounts[brand] ?? 0) === 0}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span className="sidebar-option-label">{brand} ({brandCounts[brand] ?? 0})</span>
                </label>
              ))
            )}
          </div>
        </SidebarSection>

        <SidebarSection
          title="Availability"
          isOpen={openSections.availability}
          onToggle={() => toggleSection('availability')}
        >
          <label className="sidebar-option">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(event) => onFiltersChange({ inStockOnly: event.target.checked })}
            />
            <span className="sidebar-option-label">In stock only</span>
          </label>
        </SidebarSection>
      </div>

      <div className="catalog-sidebar-card promo">
        <span className="eyebrow">{accent}</span>
        <h3>Need help choosing?</h3>
        <p>Compare laptops, shortlist accessories, and request a quick quote from support.</p>
      </div>
    </aside>
  )
}

export default CatalogSidebar
