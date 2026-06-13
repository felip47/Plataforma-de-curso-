import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cursoService } from '../services/api'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { categorias, niveis } from '../model/Course'

export default function Cursos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)

  const q = searchParams.get('q') || ''
  const catFiltro = searchParams.get('categoria') || ''
  const nivelFiltro = searchParams.get('nivel') || ''
  const gratisFiltro = searchParams.get('gratis') || ''

  useEffect(() => {
    cursoService.listar()
      .then(r => setCursos(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = cursos.filter(c => {
    if (q && !c.titulo.toLowerCase().includes(q.toLowerCase()) &&
        !c.descricao?.toLowerCase().includes(q.toLowerCase())) return false
    if (catFiltro && c.categoria !== catFiltro) return false
    if (nivelFiltro && c.nivel !== nivelFiltro) return false
    if (gratisFiltro === 'true' && !c.gratis) return false
    return true
  })

  const setFiltro = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else p.delete(key)
    setSearchParams(p)
  }

  const limpar = () => setSearchParams({})

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold mb-1">Todos os Cursos</h1>
          <p className="opacity-75 mb-0">{filtrados.length} curso(s) encontrado(s)</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 sidebar-filters">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-funnel me-2"></i>Filtros</h6>
                <button className="btn btn-link btn-sm p-0 text-muted" onClick={limpar}>Limpar</button>
              </div>

              <div className="mb-3">
                <input
                  className="form-control form-control-sm"
                  placeholder="Buscar por título..."
                  value={q}
                  onChange={e => setFiltro('q', e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Categoria</label>
                {categorias.map(cat => (
                  <div className="form-check" key={cat}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="cat"
                      id={`cat-${cat}`}
                      checked={catFiltro === cat}
                      onChange={() => setFiltro('categoria', catFiltro === cat ? '' : cat)}
                    />
                    <label className="form-check-label small" htmlFor={`cat-${cat}`}>{cat}</label>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Nível</label>
                {niveis.map(n => (
                  <div className="form-check" key={n}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="nivel"
                      id={`niv-${n}`}
                      checked={nivelFiltro === n}
                      onChange={() => setFiltro('nivel', nivelFiltro === n ? '' : n)}
                    />
                    <label className="form-check-label small" htmlFor={`niv-${n}`}>{n}</label>
                  </div>
                ))}
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gratis"
                  checked={gratisFiltro === 'true'}
                  onChange={e => setFiltro('gratis', e.target.checked ? 'true' : '')}
                />
                <label className="form-check-label small" htmlFor="gratis">
                  <i className="bi bi-gift me-1 text-success"></i>Somente gratuitos
                </label>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {loading ? <LoadingSpinner /> : filtrados.length === 0 ? (
              <EmptyState icon="bi-search" title="Nenhum curso encontrado" text="Tente outros filtros." />
            ) : (
              <div className="row g-4">
                {filtrados.map(c => (
                  <div className="col-sm-6 col-xl-4" key={c.id}>
                    <CourseCard curso={c} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
