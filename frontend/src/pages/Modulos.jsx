import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Modulos() {
  const [cursos, setCursos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cursoSelecionado, setCursoSelecionado] = useState('');

  const [moduloTitulo, setModuloTitulo] = useState('');
  const [moduloOrdem, setModuloOrdem] = useState('');

  const [aulaModuloId, setAulaModuloId] = useState('');
  const [aulaTitulo, setAulaTitulo] = useState('');
  const [aulaTipo, setAulaTipo] = useState('Vídeo');
  const [aulaUrl, setAulaUrl] = useState('');
  const [aulaDuracao, setAulaDuracao] = useState('');
  const [aulaOrdem, setAulaOrdem] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resCursos, resModulos, resAulas] = await Promise.all([
        api.get('/cursos'),
        api.get('/modulos'),
        api.get('/aulas')
      ]);
      setCursos(resCursos.data);
      setModulos(resModulos.data);
      setAulas(resAulas.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarModulo = async (e) => {
    e.preventDefault();
    if (!cursoSelecionado) {
      alert('Selecione um curso primeiro!');
      return;
    }

    const novoModulo = {
      id_curso: Number(cursoSelecionado),
      titulo: moduloTitulo,
      ordem: Number(moduloOrdem) || 1
    };

    try {
      const response = await api.post('/modulos', novoModulo);
      setModulos([...modulos, response.data]);
      setModuloTitulo('');
      setModuloOrdem('');
      alert('Módulo adicionado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar módulo.');
    }
  };

  const handleCriarAula = async (e) => {
    e.preventDefault();
    if (!aulaModuloId) {
      alert('Selecione um módulo primeiro!');
      return;
    }

    const novaAula = {
      id_modulo: Number(aulaModuloId),
      titulo: aulaTitulo,
      tipoConteudo: aulaTipo,
      url_conteudo: aulaUrl,
      duracaoMinutos: Number(aulaDuracao) || 0,
      ordem: Number(aulaOrdem) || 1
    };

    try {
      const response = await api.post('/aulas', novaAula);
      setAulas([...aulas, response.data]);
      setAulaTitulo('');
      setAulaUrl('');
      setAulaDuracao('');
      setAulaOrdem('');
      alert('Aula adicionada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar aula.');
    }
  };

  const handleDeletarModulo = async (id) => {
    if (!window.confirm('Deseja excluir este módulo? Todas as aulas dele serão mantidas no banco.')) return;
    try {
      await api.delete(`/modulos/${id}`);
      setModulos(modulos.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletarAula = async (id) => {
    if (!window.confirm('Deseja excluir esta aula?')) return;
    try {
      await api.delete(`/aulas/${id}`);
      setAulas(aulas.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const modulosDoCurso = modulos
    .filter(m => m.id_curso === Number(cursoSelecionado))
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Estrutura de Conteúdo</h2>
        <p className="text-muted">Módulo CONTEÚDO — Gerenciamento hierárquico de Módulos e Aulas ordenadas</p>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4">
        <label className="form-label small fw-semibold text-muted">Selecione o Curso para Gerenciar *</label>
        <select 
          className="form-select" 
          value={cursoSelecionado} 
          onChange={e => {
            setCursoSelecionado(e.target.value);
            setAulaModuloId('');
          }}
        >
          <option value="">Escolha um curso da lista...</option>
          {cursos.map(c => (
            <option key={c.id} value={c.id}>{c.titulo}</option>
          ))}
        </select>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3">1. Adicionar Módulo</h5>
            <form onSubmit={handleCriarModulo}>
              <div className="mb-3">
                <label className="form-label small text-muted">Título do Módulo</label>
                <input type="text" className="form-control" value={moduloTitulo} onChange={e => setModuloTitulo(e.target.value)} placeholder="Ex: Módulo 1: Introdução" required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Ordem de Sequência</label>
                <input type="number" className="form-control" value={moduloOrdem} onChange={e => setModuloOrdem(e.target.value)} placeholder="Ex: 1" required />
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }} disabled={!cursoSelecionado}>
                Criar Módulo
              </button>
            </form>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">2. Adicionar Aula ao Módulo</h5>
            <form onSubmit={handleCriarAula}>
              <div className="mb-3">
                <label className="form-label small text-muted">Selecionar Módulo Alvo *</label>
                <select className="form-select" value={aulaModuloId} onChange={e => setAulaModuloId(e.target.value)} required>
                  <option value="">Selecione um módulo...</option>
                  {modulosDoCurso.map(m => (
                    <option key={m.id} value={m.id}>Mod {m.ordem} - {m.titulo}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Título da Aula</label>
                <input type="text" className="form-control" value={aulaTitulo} onChange={e => setAulaTitulo(e.target.value)} placeholder="Ex: O que é Virtual DOM?" required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted">Tipo</label>
                  <select className="form-select" value={aulaTipo} onChange={e => setAulaTipo(e.target.value)}>
                    <option value="Vídeo">Vídeo</option>
                    <option value="Texto">Texto</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Duração (Minutos)</label>
                  <input type="number" className="form-control" value={aulaDuracao} onChange={e => setAulaDuracao(e.target.value)} placeholder="15" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">URL do Conteúdo</label>
                <input type="text" className="form-control" value={aulaUrl} onChange={e => setAulaUrl(e.target.value)} placeholder="Ex: vimeo.com/..." />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Ordem na Grade</label>
                <input type="number" className="form-control" value={aulaOrdem} onChange={e => setAulaOrdem(e.target.value)} placeholder="Ex: 1" required />
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }} disabled={!aulaModuloId}>
                Criar Aula
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">Grade Curricular Atual</h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : !cursoSelecionado ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-arrow-up-circle fs-2 mb-2 d-block text-purple" style={{ color: '#6f42c1' }}></i>
                Selecione um curso acima para mapear a árvore de conteúdo.
              </div>
            ) : modulosDoCurso.length === 0 ? (
              <div className="text-center text-muted py-5">
                Nenhum módulo ou aula cadastrados para este curso ainda.
              </div>
            ) : (
              <div className="accordion" id="accordionGrade">
                {modulosDoCurso.map((mod, index) => {
                  const aulasDoModulo = aulas
                    .filter(a => a.id_modulo === mod.id)
                    .sort((a, b) => a.ordem - b.ordem);

                  return (
                    <div className="accordion-item mb-3 border shadow-sm rounded overflow-hidden" key={mod.id}>
                      <h2 className="accordion-header d-flex align-items-center bg-light px-3">
                        <button 
                          className="accordion-button collapsed bg-transparent shadow-none fw-bold flex-grow-1 text-dark py-3 ps-0" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#collapseMod-${mod.id}`}
                        >
                          Módulo {mod.ordem}: {mod.titulo}
                        </button>
                        <button className="btn btn-sm btn-outline-danger border-0 ms-2" onClick={() => handleDeletarModulo(mod.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </h2>

                      <div id={`collapseMod-${mod.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionGrade">
                        <div className="accordion-body p-0">
                          <ul className="list-group list-group-flush">
                            {aulasDoModulo.length === 0 ? (
                              <li className="list-group-item text-muted small py-3 text-center">Nenhuma aula adicionada neste módulo.</li>
                            ) : (
                              aulasDoModulo.map(aula => (
                                <li key={aula.id} className="list-group-item d-flex justify-content-between align-items-center py-2 pe-3 ps-4 border-bottom-0">
                                  <div>
                                    <span className="text-muted small fw-bold me-2">#{aula.ordem}</span>
                                    <span className="fw-semibold small">{aula.titulo}</span>
                                    <span className="badge ms-2 text-purple bg-purple-subtle" style={{ backgroundColor: '#f3f0fa', color: '#6f42c1', fontSize: '0.7rem' }}>
                                      {aula.tipoConteudo} {aula.duracaoMinutos ? `• ${aula.duracaoMinutos}min` : ''}
                                    </span>
                                  </div>
                                  <button className="btn btn-sm text-danger border-0 p-1" onClick={() => handleDeletarAula(aula.id)}>
                                    <i className="bi bi-x-circle"></i>
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}