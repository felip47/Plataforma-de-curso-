import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [idEdicao, setIdEdicao] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('Aluno');

  const [usuarioMatricula, setUsuarioMatricula] = useState('');
  const [cursoMatricula, setCursoMatricula] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resUsers, resCourses, resEnrollments] = await Promise.all([
        api.get('/usuarios'),
        api.get('/cursos'),
        api.get('/matriculas')
      ]);
      setUsuarios(resUsers.data);
      setCursos(resCourses.data);
      setMatriculas(resEnrollments.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarUsuario = async (e) => {
    e.preventDefault();
    const usuarioData = { nome, email, tipo, password: "123" };

    try {
      if (idEdicao) {
        const response = await api.put(`/usuarios/${idEdicao}`, usuarioData);
        setUsuarios(usuarios.map(u => u.id === idEdicao ? response.data : u));
      } else {
        const response = await api.post('/usuarios', usuarioData);
        setUsuarios([...usuarios, response.data]);
      }
      handleCancelarEdicao();
    } catch (error) {
      alert('Erro ao salvar usuário.');
    }
  };

  const handleCriarMatricula = async (e) => {
    e.preventDefault();
    if (!usuarioMatricula || !cursoMatricula) return;

    const novaMatricula = {
      id_usuario: Number(usuarioMatricula),
      id_curso: Number(cursoMatricula),
      dataMatricula: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo'
    };

    try {
      const response = await api.post('/matriculas', novaMatricula);
      setMatriculas([...matriculas, response.data]);
      setUsuarioMatricula(''); setCursoMatricula('');
    } catch (error) {
      alert('Erro ao matricular.');
    }
  };

  const handleDeletarUsuario = async (id) => {
    if (!window.confirm('Remover usuário?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelarEdicao = () => {
    setIdEdicao(null); setNome(''); setEmail(''); setTipo('Aluno');
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Usuários e Matrículas</h2>
        <p className="text-muted">Gerenciamento integrado com tabelas em Português</p>
      </div>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">{idEdicao ? 'Editar Usuário' : 'Novo Usuário'}</h5>
            <form onSubmit={handleSalvarUsuario}>
              <div className="mb-3">
                <label className="form-label small text-muted">Nome *</label>
                <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">E-mail *</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Perfil *</label>
                <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                  <option value="Aluno">Aluno</option>
                  <option value="Professor">Professor</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }}>Salvar</button>
            </form>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Simular Matrícula</h5>
            <form onSubmit={handleCriarMatricula}>
              <div className="mb-3">
                <select className="form-select" value={usuarioMatricula} onChange={e => setUsuarioMatricula(e.target.value)} required>
                  <option value="">Escolha um aluno...</option>
                  {usuarios.filter(u => u.tipo === 'Aluno').map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <select className="form-select" value={cursoMatricula} onChange={e => setCursoMatricula(e.target.value)} required>
                  <option value="">Escolha um curso...</option>
                  {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100">Matricular Aluno</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}