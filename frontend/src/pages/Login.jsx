import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      if (result.user.tipo === 'Administrador' || result.user.tipo === 'Professor') {
        navigate('/admin/dashboard');
      } else {
        navigate('/painel-aluno');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="fw-bold text-center mb-1">Entrar na Plataforma</h4>
        <p className="text-muted text-center small mb-4">Acesse utilizando suas credenciais cadastradas</p>
        
        {error && <div className="alert alert-danger small py-2 text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Endereço de E-mail</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Senha de Acesso</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn text-white w-100 py-2 mb-3" style={{ backgroundColor: '#6f42c1' }}>
            Autenticar Conta
          </button>
          <div className="text-center">
            <span className="small text-muted">É um aluno novo? </span>
            <Link to="/cadastro" className="small fw-bold text-decoration-none" style={{ color: '#6f42c1' }}>Crie sua conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}