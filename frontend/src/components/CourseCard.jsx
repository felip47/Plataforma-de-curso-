import { Link } from 'react-router-dom'

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <i key={i} className={`bi ${i <= Math.round(rating) ? 'bi-star-fill' : 'bi-star'}`} style={{ fontSize: '0.75rem' }}></i>
      ))}
      <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>({rating?.toFixed(1)})</span>
    </span>
  )
}

function AvatarInicial({ nome }) {
  const ini = nome ? nome[0].toUpperCase() : '?'
  return (
    <div className="instructor-avatar d-inline-flex justify-content-center align-items-center"
      style={{ background: '#6c3fc5', width: 32, height: 32 }}>
      {ini}
    </div>
  )
}

export default function CourseCard({ curso }) {
  const coverColors = ['#6c3fc5','#2563eb','#0891b2','#059669','#d97706','#dc2626']
  const color = coverColors[curso.id % coverColors.length] || '#6c3fc5'

  return (
    <div className="card course-card h-100">
      <div
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{ height: 160, background: `linear-gradient(135deg, ${color}cc, ${color})` }}
      >
        <i className="bi bi-play-circle-fill text-white" style={{ fontSize: '3rem', opacity: 0.8 }}></i>
        {curso.destaque && (
          <span className="position-absolute top-0 start-0 m-2 badge" style={{ background: '#f7971e' }}>
            <i className="bi bi-lightning-fill me-1"></i>Destaque
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <span className="badge-category mb-2 d-inline-block">{curso.categoria}</span>
        <h6 className="card-title fw-bold mb-1" style={{ lineHeight: 1.3 }}>{curso.titulo}</h6>
        <p className="text-muted small mb-2" style={{ lineHeight: 1.4 }}>
          {curso.descricao?.substring(0, 80)}{curso.descricao?.length > 80 ? '...' : ''}
        </p>
        <div className="d-flex align-items-center gap-2 mb-2">
          <AvatarInicial nome={curso.instrutor} />
          <span className="small text-muted">{curso.instrutor}</span>
        </div>
        <Stars rating={curso.avaliacao} />
        <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
          <span><i className="bi bi-clock me-1"></i>{curso.duracao}</span>
          <span><i className="bi bi-people me-1"></i>{curso.alunos?.toLocaleString()}</span>
        </div>
        <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
          <span className={`fw-bold fs-5 ${curso.gratis ? 'price-free' : 'price-tag'}`}>
            {curso.gratis ? 'Grátis' : `R$ ${Number(curso.preco).toFixed(2)}`}
          </span>
          <Link to={`/cursos/${curso.id}`} className="btn btn-sm btn-primary-custom">
            Ver curso
          </Link>
        </div>
      </div>
    </div>
  )
}
