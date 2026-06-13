import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { cursoService } from '../services/api'
import { categorias, niveis } from '../model/Course'

const VAZIO = {
  titulo: '', descricao: '', instrutor: '', categoria: 'Programação',
  nivel: 'Iniciante', preco: '', duracao: '', aulas: '',
  avaliacao: 4.5, alunos: 0, gratis: false, destaque: false, topicos: [],
}

export default function FormCurso() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState(VAZIO)
  const [topicoInput, setTopicoInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(editando)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!editando) return
    cursoService.buscarPorId(id)
      .then(r => setForm({ ...VAZIO, ...r.data }))
      .catch(() => navigate('/admin'))
      .finally(() => setCarregando(false))
  }, [id])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const addTopico = () => {
    if (!topicoInput.trim()) return
    set('topicos', [...(form.topicos || []), topicoInput.trim()])
    setTopicoInput('')
  }

  const removeTopico = (i) => {
    set('topicos', form.topicos.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    if (!form.titulo || !form.instrutor || !form.categoria) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }
    setLoading(true)
    try {
      const dados = {
        ...form,
        preco: form.gratis ? 0 : Number(form.preco) || 0,
        aulas: Number(form.aulas) || 0,
        alunos: Number(form.alunos) || 0,
        avaliacao: Number(form.avaliacao) || 4.5,
      }
      if (editando) await cursoService.atualizar(id, dados)
      else await cursoService.criar(dados)
      navigate('/admin')
    } catch (e) {
      setErro('Erro ao salvar o curso. Verifique se o JSON Server está rodando.')
    } finally {
      setLoading(false)
    }
  }

  if (carregando) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" style={{ color: '#6c3fc5' }}></div>
    </div>
  )

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold mb-1">
            <i className={`bi ${editando ? 'bi-pencil-square' : 'bi-plus-circle'} me-3`}></i>
            {editando ? 'Editar Curso' : 'Novo Curso'}
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 opacity-75">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50">Início</Link></li>
              <li className="breadcrumb-item"><Link to="/admin" className="text-white-50">Admin</Link></li>
              <li className="breadcrumb-item active text-white">{editando ? 'Editar' : 'Novo'}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              {erro && (
                <div className="alert alert-danger d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i>{erro}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Título do Curso *</label>
                    <input className="form-control" value={form.titulo}
                      onChange={e => set('titulo', e.target.value)} required
                      placeholder="Ex: React do Zero ao Avançado" />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Descrição</label>
                    <textarea className="form-control" rows={3} value={form.descricao}
                      onChange={e => set('descricao', e.target.value)}
                      placeholder="Descreva o conteúdo do curso..." />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Instrutor *</label>
                    <input className="form-control" value={form.instrutor}
                      onChange={e => set('instrutor', e.target.value)} required
                      placeholder="Nome do instrutor" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Categoria *</label>
                    <select className="form-select" value={form.categoria}
                      onChange={e => set('categoria', e.target.value)}>
                      {categorias.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Nível</label>
                    <select className="form-select" value={form.nivel}
                      onChange={e => set('nivel', e.target.value)}>
                      {niveis.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Duração</label>
                    <input className="form-control" value={form.duracao}
                      onChange={e => set('duracao', e.target.value)}
                      placeholder="Ex: 12h 30min" />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Nº de Aulas</label>
                    <input className="form-control" type="number" min="0" value={form.aulas}
                      onChange={e => set('aulas', e.target.value)} placeholder="0" />
                  </div>

                  <div className="col-md-4">
                    <div className="form-check mt-4">
                      <input className="form-check-input" type="checkbox" id="gratis"
                        checked={form.gratis}
                        onChange={e => set('gratis', e.target.checked)} />
                      <label className="form-check-label fw-semibold" htmlFor="gratis">
                        <i className="bi bi-gift me-1 text-success"></i>Gratuito
                      </label>
                    </div>
                  </div>

                  {!form.gratis && (
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Preço (R$)</label>
                      <input className="form-control" type="number" min="0" step="0.01"
                        value={form.preco}
                        onChange={e => set('preco', e.target.value)} placeholder="0.00" />
                    </div>
                  )}

                  <div className="col-md-4">
                    <div className="form-check mt-4">
                      <input className="form-check-input" type="checkbox" id="destaque"
                        checked={form.destaque}
                        onChange={e => set('destaque', e.target.checked)} />
                      <label className="form-check-label fw-semibold" htmlFor="destaque">
                        <i className="bi bi-lightning-fill me-1 text-warning"></i>Destaque
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Avaliação (0-5)</label>
                    <input className="form-control" type="number" min="0" max="5" step="0.1"
                      value={form.avaliacao}
                      onChange={e => set('avaliacao', e.target.value)} />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Nº de Alunos</label>
                    <input className="form-control" type="number" min="0"
                      value={form.alunos}
                      onChange={e => set('alunos', e.target.value)} />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Tópicos do Curso</label>
                    <div className="input-group mb-2">
                      <input className="form-control" value={topicoInput}
                        onChange={e => setTopicoInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopico())}
                        placeholder="Ex: Introdução ao React..." />
                      <button type="button" className="btn btn-primary-custom" onClick={addTopico}>
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                    {form.topicos?.map((t, i) => (
                      <div key={i} className="d-flex align-items-center gap-2 mb-1">
                        <div className="lesson-item flex-grow-1 mb-0">{t}</div>
                        <button type="button" className="btn btn-sm btn-outline-danger"
                          onClick={() => removeTopico(i)}>
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="col-12 d-flex gap-2 pt-2">
                    <button type="submit" className="btn btn-primary-custom px-4 fw-bold" disabled={loading}>
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Salvando...</>
                        : <><i className={`bi ${editando ? 'bi-check2' : 'bi-plus-circle'} me-2`}></i>
                            {editando ? 'Salvar Alterações' : 'Criar Curso'}</>
                      }
                    </button>
                    <Link to="/admin" className="btn btn-outline-secondary px-4">Cancelar</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
