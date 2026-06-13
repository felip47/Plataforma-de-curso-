import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signed, user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span style={{ color: '#fff' }}>Plataforma</span>
          <span style={{ color: '#6f42c1' }}>Curso</span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <Link to="/" className={`nav-link px-3 ${isActive('/') ? 'active fw-bold text-white' : 'text-white-50'}`}>
                Início
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cursos" className={`nav-link px-3 ${isActive('/cursos') ? 'active fw-bold text-white' : 'text-white-50'}`}>
                Cursos
              </Link>
            </li>
            {signed && user.tipo === 'Aluno' && (
              <li className="nav-item">
                <Link to="/painel-aluno" className={`nav-link px-3 rounded ${isActive('/painel-aluno') ? 'active fw-bold text-white' : 'text-white-50'}`} style={isActive('/painel-aluno') ? { backgroundColor: '#6f42c1' } : {}}>
                  <i className="bi bi-person-workspace me-1"></i>
                  Painel do Aluno
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {signed ? (
              <>
                {(user.tipo === 'Administrador' || user.tipo === 'Professor') && (
                  <Link to="/admin" className="btn btn-outline-light btn-sm px-3 rounded-pill">
                    <i className="bi bi-shield-lock me-1"></i>
                    Admin
                  </Link>
                )}
                <span className="text-white-50 small d-none d-md-inline">{user.nome}</span>
                <button onClick={handleLogoutClick} className="btn btn-sm btn-danger px-3 rounded-pill">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm text-white px-4 rounded-pill" style={{ backgroundColor: '#6f42c1' }}>
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}