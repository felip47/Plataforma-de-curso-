export default function EmptyState({ icon = 'bi-search', title = 'Nada encontrado', text = '' }) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`}></i>
      <h5>{title}</h5>
      {text && <p className="text-muted small">{text}</p>}
    </div>
  )
}
