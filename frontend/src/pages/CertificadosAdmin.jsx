import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Certificados() {
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [progresso, setProgresso] = useState('100');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resUsuarios, resCursos, resCertificados] = await Promise.all([
        api.get('/usuarios'),
        api.get('/cursos'),
        api.get('/certificados')
      ]);
      setUsuarios(resUsuarios.data);
      setCursos(resCursos.data);
      setCertificados(resCertificados.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmitirCertificado = async (e) => {
    e.preventDefault();
    if (!usuarioSelecionado || !cursoSelecionado) {
      alert('Selecione o aluno e o curso!');
      return;
    }

    const jaEmitido = certificados.some(
      c => c.id_usuario === Number(usuarioSelecionado) && c.id_curso === Number(cursoSelecionado)
    );

    if (jaEmitido) {
      alert('Este aluno já possui certificado para este curso!');
      return;
    }

    const novoCertificado = {
      id_usuario: Number(usuarioSelecionado),
      id_curso: Number(cursoSelecionado),
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      codigoAutenticidade: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      percentualConclusao: Number(progresso)
    };

    try {
      const response = await api.post('/certificados', novoCertificado);
      setCertificados([...certificados, response.data]);
      setUsuarioSelecionado('');
      setCursoSelecionado('');
      alert('Certificado emitido com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao emitir certificado.');
    }
  };

  const handleRevogarCertificado = async (id) => {
    if (!window.confirm('Deseja revogar este certificado?')) return;
    try {
      await api.delete(`/certificados/${id}`);
      setCertificados(certificados.filter(c => c.id !== id));
      alert('Certificado revogado.');
    } catch (error) {
      console.error(error);
    }
  };

  const getNomeUsuario = (id) => {
    const user = usuarios.find(u => u.id === id);
    return user ? user.nome : `Usuário #${id}`;
  };

  const getTituloCurso = (id) => {
    const curso = cursos.find(c => c.id === id);
    return curso ? curso.titulo : `Curso #${id}`;
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Progresso e Certificados</h2>
        <p className="text-muted">Módulo de Conclusão — Registro de performance acadêmica e emissão de títulos</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Emitir Título de Conclusão</h5>
            <form onSubmit={handleEmitirCertificado}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Selecionar Aluno *</label>
                <select className="form-select" value={usuarioSelecionado} onChange={e => setUsuarioSelecionado(e.target.value)} required>
                  <option value="">Escolha o aluno...</option>
                  {usuarios.filter(u => u.tipo === 'Aluno').map(u => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Selecionar Curso Concluído *</label>
                <select className="form-select" value={cursoSelecionado} onChange={e => setCursoSelecionado(e.target.value)} required>
                  <option value="">Escolha o curso...</option>
                  {cursos.map(c => (
                    <option key={c.id} value={c.id}>{c.titulo}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Percentual de Progresso (%) *</label>
                <input type="number" className="form-control" min="1" max="100" value={progresso} onChange={e => setProgresso(e.target.value)} required />
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }} disabled={usuarios.length === 0 || cursos.length === 0}>
                Chancelar Certificado
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Registros de Certificados Emitidos</h5>
            {loading ? (
              <div className="text-center py-3"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Aluno / Curso</th>
                      <th>Código / Data</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificados.length === 0 ? (
                      <tr><td colSpan="3" className="text-center text-muted py-3">Nenhum certificado emitido até o momento.</td></tr>
                    ) : (
                      certificados.map(c => (
                        <tr key={c.id}>
                          <td>
                            <div className="fw-bold small">{getNomeUsuario(c.id_usuario)}</div>
                            <span className="text-purple small d-block" style={{ color: '#6f42c1' }}>{getTituloCurso(c.id_curso)} ({c.percentualConclusao}%)</span>
                          </td>
                          <td>
                            <div className="font-monospace small fw-bold text-success">{c.codigoAutenticidade}</div>
                            <span className="text-muted small">{c.dataEmissao}</span>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRevogarCertificado(c.id)}><i className="bi bi-trash"></i></button>
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