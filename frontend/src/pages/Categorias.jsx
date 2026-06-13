import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!novaCategoria.trim()) return;

    try {
      if (editandoId) {
        const response = await api.put(`/categorias/${editandoId}`, {
          nome: novaCategoria
        });
        setCategorias(categorias.map(cat => cat.id === editandoId ? response.data : cat));
        alert('Categoria atualizada com sucesso!');
      } else {
        const response = await api.post('/categorias', {
          nome: novaCategoria
        });
        setCategorias([...categorias, response.data]);
        alert('Categoria salva com sucesso!');
      }
      cancelarEdicao();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar as informações.');
    }
  };

  const handleExcluir = async (id, nome) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`);
    if (!confirmar) return;

    try {
      await api.delete(`/categorias/${id}`);
      setCategorias(categorias.filter(cat => cat.id !== id));
      alert('Categoria removida com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Não foi possível excluir.');
    }
  };

  const iniciarEdicao = (categoria) => {
    setEditandoId(categoria.id);
    setNovaCategoria(categoria.nome);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovaCategoria('');
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Gerenciar Categorias</h2>
        <p className="text-muted">Módulo CORE — Persistência de dados real via JSON Server</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">
              {editandoId ? 'Editar Categoria' : 'Nova Categoria'}
            </h5>
            <form onSubmit={handleSalvar}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nome da Categoria *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Inteligência Artificial"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  required
                />
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn text-white flex-grow-1" style={{ backgroundColor: '#6f42c1' }}>
                  <i className={`bi ${editandoId ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                  {editandoId ? 'Atualizar' : 'Salvar Categoria'}
                </button>

                {editandoId && (
                  <button type="button" className="btn btn-light border" onClick={cancelarEdicao}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Categorias Cadastradas</h5>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Nome da Categoria</th>
                      <th style={{ width: '120px' }} className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-3">Nenhuma categoria encontrada no db.json.</td>
                      </tr>
                    ) : (
                      categorias.map((cat) => (
                        <tr key={cat.id}>
                          <td className="text-muted">#{cat.id}</td>
                          <td className="fw-bold">{cat.nome}</td>
                          <td className="text-center">
                            <div className="btn-group gap-1">
                              <button 
                                className="btn btn-sm btn-outline-primary rounded"
                                onClick={() => iniciarEdicao(cat)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger rounded"
                                onClick={() => handleExcluir(cat.id, cat.nome)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
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