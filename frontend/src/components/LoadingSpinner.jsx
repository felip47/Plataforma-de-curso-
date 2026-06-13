export default function LoadingSpinner({ text = 'Carregando...' }) {
  return (
    <div className="loading-spinner flex-column gap-3">
      <div className="spinner-border" style={{ color: '#6c3fc5' }} role="status"></div>
      <span className="text-muted">{text}</span>
    </div>
  )
}
