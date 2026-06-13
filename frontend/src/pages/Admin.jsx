import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Admin() {
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [idEdicao, setIdEdicao] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [instrutor, setInstrutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nivel, setNivel] = useState('Iniciante');
  const [duracao, setDuracao] = useState('');
  const [aulas, setAulas] = useState(0);
  const [preco, setPreco] = useState(0);
  const [gratis, setGratis] = useState(false);
  const [destaque, setDestaque] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resCursos, resCategorias, resUsuarios] = await Promise.all([
        api.get('/cursos'),
        api.get('/categorias'),
        api.get('/usuarios')
      ]);
      setCursos(resCursos.data);
      setCategorias(resCategorias.data);
      setProfessores(resUsuarios.data.filter(u => u.tipo === 'Professor'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarCurso = async (e) => {
    e.preventDefault();
    const cursoData = {
      titulo, descricao, instrutor, categoria, nivel,
      preco: gratis ? 0 : Number(preco), duracao, aulas: Number(aulas),
      gratis, destaque, topicos: [], avaliacao: 5.0, alunos: 0
    };

    try {
      if (idEdicao) {
        const response = await api.put(`/cursos/${idEdicao}`, cursoData);
        setCursos(cursos.map(c => c.id === idEdicao ? response.data : c));
      } else {
        const response = await api.post('/cursos', cursoData);
        setCursos([...cursos, response.data]);
      }
      handleCancelar();
    } catch (error) {
      alert('Erro ao salvar curso.');
    }
  };

  const handleDeletarCurso = async (id) => {
    if (!window.confirm('Excluir este curso?')) return;
    try {
      await api.delete(`/cursos/${id}`);
      setCursos(cursos.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditarClick = (curso) => {
    setIdEdicao(curso.id);
    setTitulo(curso.titulo);
    setDescricao(curso.descricao || '');
    setInstrutor(curso.instrutor || '');
    setCategoria(curso.categoria || '');
    setNivel(curso.nivel || 'Iniciante');
    setDuracao(curso.duracao || '');
    setAulas(curso.aulas || 0);
    setPreco(curso.preco || 0);
    setGratis(curso.gratis || false);
    setDestaque(curso.destaque || false);
  };

  const handleCancelar = () => {
    setIdEdicao(null); setTitulo(''); setDescricao(''); setInstrutor('');
    setCategoria(''); setNivel('Iniciante'); setDuracao(''); setAulas(0);
    setPreco(0); setGratis(false); setDestaque(false);
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Gerenciar Cursos</h2>
        <p className="text-muted">Módulo ACADÊMICO — Rotas em Português</p>
      </div>
      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">{idEdicao ? 'Editar Curso' : 'Novo Curso'}</h5>
            <form onSubmit={handleSalvarCurso}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Título do Curso *</label>
                <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Descrição</label>
                <textarea className="form-control" rows="2" value={descricao} onChange={e => setDescricao(e.target.value)} />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Instrutor *</label>
                  <select className="form-select" value={instrutor} onChange={e => setInstrutor(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {professores.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Categoria *</label>
                  <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {categorias.map(cat => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
                  </select>
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="form-check mt-2">
                    <input type="checkbox" className="form-check-input" id="g" checked={gratis} onChange={e => setGratis(e.target.checked)} />
                    <label className="form-check-label" htmlFor="g">Gratuito</label>
                  </div>
                </div>
                <div className="col-6">
                  <input type="number" className="form-control" value={gratis ? 0 : preco} onChange={e => setPreco(e.target.value)} disabled={gratis} placeholder="Preço" />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn text-white flex-grow-1" style={{ backgroundColor: '#6f42c1' }}>Salvar</button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancelar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Catálogo de Cursos</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Instrutor</th>
                    <th>Preço</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.map(c => (
                    <tr key={c.id}>
                      <td><div className="fw-bold small">{c.titulo}</div></td>
                      <td><span className="badge bg-light text-dark">{c.categoria}</span></td>
                      <td className="small text-muted">{c.instrutor}</td>
                      <td className="small fw-bold">{c.preco === 0 ? 'Grátis' : `R$ ${c.preco}`}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditarClick(c)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletarCurso(c.id)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}