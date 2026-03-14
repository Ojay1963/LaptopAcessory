function Rating({ value, count, size = 'sm' }) {
  const rounded = Math.round(value)
  const stars = Array.from({ length: 5 }, (_, index) => index < rounded)

  return (
    <div className={`rating rating-${size}`} aria-label={`Rated ${value} out of 5`}>
      <div className="stars" aria-hidden="true">
        {stars.map((filled, index) => (
          <span key={index} className={filled ? 'star filled' : 'star'}>
            &#9733;
          </span>
        ))}
      </div>
      <span className="rating-value">{value.toFixed(1)}</span>
      {typeof count === 'number' && <span className="rating-count">({count})</span>}
    </div>
  )
}

export default Rating
