function CatalogLoadingState({ cards = 8 }) {
  return (
    <section className="catalog-layout catalog-loading-state" aria-label="Loading catalog" aria-busy="true">
      <aside className="catalog-sidebar">
        <div className="catalog-sidebar-card skeleton-panel">
          <div className="skeleton skeleton-line title" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </div>
        <div className="catalog-sidebar-card skeleton-panel">
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
        </div>
      </aside>

      <div className="catalog-content">
        <div className="catalog-controls compact skeleton-toolbar">
          <div className="skeleton skeleton-line medium" />
        </div>
        <div className="market-grid">
          {Array.from({ length: cards }, (_, index) => (
            <article key={index} className="market-card catalog-tile skeleton-card">
              <div className="market-image-wrap skeleton-image">
                <div className="skeleton skeleton-block" />
              </div>
              <div className="product-body">
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line medium" />
                <div className="skeleton skeleton-line short" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CatalogLoadingState
