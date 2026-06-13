import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const checkUser = await api.get(`/usuarios?email=${email}`);
      if (checkUser.data.length > 0) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      await api.post('/usuarios', {
        nome,
        email,
        password,
        tipo: 'Aluno'
      });

      alert('Cadastro realizado com sucesso! Faça seu login.');
      navigate('/login');
    } catch (err) {
      setError('Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="fw-bold text-center mb-1">Criar Conta Aluno</h4>
        <p className="text-muted text-center small mb-4">Cadastre-se para acessar os cursos</p>

        {error && <div className="alert alert-danger small py-2 text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Nome Completo</label>
            <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo" required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Endereço de E-mail</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Senha de Acesso</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn text-white w-100 py-2 mb-3" style={{ backgroundColor: '#6f42c1' }}>
            Cadastrar
          </button>
          <div className="text-center">
            <span className="small text-muted">Já tem uma conta? </span>
            <Link to="/login" className="small fw-bold text-decoration-none" style={{ color: '#6f42c1' }}>Entrar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}