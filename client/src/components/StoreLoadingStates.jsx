function ProductDetailsLoadingState() {
  return (
    <div className="page product-page" aria-label="Loading product details" aria-busy="true">
      <div className="breadcrumb skeleton skeleton-line medium" />

      <section className="product-detail-shell product-detail-loading">
        <div className="product-gallery-panel">
          <div className="product-gallery-main skeleton-image">
            <div className="skeleton skeleton-block" />
          </div>
          <div className="product-thumbs">
            <div className="product-thumb skeleton">
              <div className="skeleton skeleton-block" />
            </div>
            <div className="product-thumb skeleton">
              <div className="skeleton skeleton-block" />
            </div>
          </div>
        </div>

        <div className="product-purchase-panel">
          <div className="skeleton skeleton-line title" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton purchase-skeleton" />
          <div className="skeleton skeleton-line medium" />
          <div className="detail-accordion">
            <div className="accordion-item">
              <div className="skeleton skeleton-line medium" />
            </div>
            <div className="accordion-item">
              <div className="skeleton skeleton-line medium" />
            </div>
            <div className="accordion-item">
              <div className="skeleton skeleton-line medium" />
            </div>
          </div>
        </div>
      </section>

      <section className="related-products-section">
        <div className="skeleton skeleton-line title" />
        <div className="market-grid related-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <article key={index} className="market-card catalog-tile skeleton-card">
              <div className="market-image-wrap skeleton-image">
                <div className="skeleton skeleton-block" />
              </div>
              <div className="product-body">
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line medium" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function CartLoadingState() {
  return (
    <div className="page" aria-label="Loading cart" aria-busy="true">
      <section className="page-hero">
        <div>
          <div className="skeleton skeleton-line title" />
          <div className="skeleton skeleton-line medium" />
        </div>
        <div className="hero-cta cart-hero-loading">
          <div className="skeleton skeleton-line short" />
          <div className="skeleton cart-button-skeleton" />
        </div>
      </section>

      <section className="cart-grid">
        <div className="cart-items">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="cart-item cart-item-skeleton">
              <div className="skeleton cart-thumb-skeleton" />
              <div className="cart-item-body cart-body-skeleton">
                <div className="skeleton skeleton-line medium" />
                <div className="skeleton skeleton-line short" />
                <div className="skeleton cart-button-skeleton" />
              </div>
              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton cart-button-skeleton" />
        </aside>
      </section>
    </div>
  )
}

export { CartLoadingState, ProductDetailsLoadingState }
