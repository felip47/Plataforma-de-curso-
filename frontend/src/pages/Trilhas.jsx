import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Trilhas() {
  const [trilhas, setTrilhas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resTrilhas, resCursos] = await Promise.all([
        api.get('/trilhas'),
        api.get('/cursos')
      ]);
      setTrilhas(resTrilhas.data);
      setCursos(resCursos.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarTrilha = async (e) => {
    e.preventDefault();
    const novaTrilha = { nome, descricao };

    try {
      const response = await api.post('/trilhas', novaTrilha);
      setTrilhas([...trilhas, response.data]);
      setNome('');
      setDescricao('');
      alert('Trilha criada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar trilha.');
    }
  };

  const handleExcluirTrilha = async (id) => {
    if (!window.confirm('Deseja excluir esta trilha?')) return;
    try {
      await api.delete(`/trilhas/${id}`);
      setTrilhas(trilhas.filter(t => t.id !== id));
      alert('Trilha removida com sucesso!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Trilhas de Conhecimento</h2>
        <p className="text-muted">Módulo ACADÊMICO — Agrupamento de cursos por jornadas de aprendizado</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Nova Trilha</h5>
            <form onSubmit={handleCriarTrilha}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nome da Trilha *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  placeholder="Ex: Formação Frontend Expert" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Descrição *</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={descricao} 
                  onChange={e => setDescricao(e.target.value)} 
                  placeholder="Descreva o objetivo desta trilha..." 
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }}>
                Criar Trilha
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Trilhas Disponíveis</h5>
            {loading ? (
              <div className="text-center py-3"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Trilha</th>
                      <th className="text-center" style={{ width: '100px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trilhas.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center text-muted py-3">Nenhuma trilha cadastrada no db.json.</td>
                      </tr>
                    ) : (
                      trilhas.map(t => (
                        <tr key={t.id}>
                          <td>
                            <div className="fw-bold">{t.nome}</div>
                            <span className="text-muted small">{t.descricao}</span>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluirTrilha(t.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}