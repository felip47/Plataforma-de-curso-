import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cursoService } from '../services/api'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { categorias } from '../model/Course'

export default function Home() {
  const [destaques, setDestaques] = useState([])
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ cursos: 0, alunos: 0, instrutores: 0 })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await cursoService.listar()
        const data = res.data
        setTodos(data)
        setDestaques(data.filter(c => c.destaque).slice(0, 4))
        const totalAlunos = data.reduce((s, c) => s + (c.alunos || 0), 0)
        const instrs = [...new Set(data.map(c => c.instrutor))].length
        setStats({ cursos: data.length, alunos: totalAlunos, instrutores: instrs })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <>
      <section className="hero-section">
        <div className="container text-center">
          <h1 className="mb-3">Aprenda com os melhores.<br />Evolua na sua carreira.</h1>
          <p className="lead mb-4 opacity-75">
            Mais de {stats.cursos} cursos online para você dominar as tecnologias do mercado.
          </p>
          <Link to="/cursos" className="btn btn-warning btn-lg fw-bold px-5 me-3">
            <i className="bi bi-collection-play me-2"></i>Ver todos os cursos
          </Link>
          <Link to="/admin/novo" className="btn btn-outline-light btn-lg px-4">
            <i className="bi bi-plus-circle me-2"></i>Adicionar curso
          </Link>
        </div>
      </section>

      <section className="py-4" style={{ background: '#f4f6fb' }}>
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { icon: 'bi-collection', label: 'Cursos', val: stats.cursos },
              { icon: 'bi-people', label: 'Alunos', val: stats.alunos.toLocaleString() },
              { icon: 'bi-person-badge', label: 'Instrutores', val: stats.instrutores },
              { icon: 'bi-star', label: 'Avaliação Média', val: '4.7' },
            ].map(s => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="stat-card">
                  <i className={`bi ${s.icon} fs-2 mb-2`} style={{ color: '#6c3fc5' }}></i>
                  <div className="number">{s.val}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">Navegue por categoria</h2>
          <div className="text-center">
            {categorias.map(cat => (
              <Link key={cat} to={`/cursos?categoria=${encodeURIComponent(cat)}`}
                className="category-pill d-inline-block">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 pb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">🔥 Cursos em Destaque</h2>
            <Link to="/cursos" className="btn btn-outline-custom btn-sm">Ver todos</Link>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div className="row g-4">
              {destaques.length > 0 ? destaques.map(c => (
                <div className="col-sm-6 col-lg-3" key={c.id}>
                  <CourseCard curso={c} />
                </div>
              )) : todos.slice(0,4).map(c => (
                <div className="col-sm-6 col-lg-3" key={c.id}>
                  <CourseCard curso={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-5" style={{ background: '#6c3fc5' }}>
        <div className="container text-center text-white">
          <h2 className="fw-bold mb-3">Pronto para evoluir?</h2>
          <p className="lead opacity-75 mb-4">Comece hoje mesmo com nossos cursos gratuitos.</p>
          <Link to="/cursos?gratis=true" className="btn btn-warning btn-lg fw-bold px-5">
            <i className="bi bi-gift me-2"></i>Ver cursos gratuitos
          </Link>
        </div>
      </section>
    </>
  )
}
