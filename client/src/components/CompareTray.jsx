import { formatPrice } from '../lib/format'

function CompareTray({ items, clearCompare, openCompare, removeFromCompare }) {
  return (
    <aside className="compare-tray">
      <div className="compare-tray-copy">
        <span className="eyebrow">Compare picks</span>
        <strong>{items.length} products shortlisted</strong>
        <p>Review specs, prices, and ratings side by side before you decide.</p>
      </div>

      <div className="compare-tray-items">
        {items.map((item) => (
          <div key={item.id} className="compare-mini-card">
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{formatPrice(item.price)}</span>
            </div>
            <button type="button" onClick={() => removeFromCompare(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="compare-tray-actions">
        <button className="btn ghost" type="button" onClick={clearCompare}>
          Clear
        </button>
        <button className="btn primary" type="button" onClick={openCompare}>
          Open compare view
        </button>
      </div>
    </aside>
  )
}

export default CompareTray
