import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', minHeight: '100vh' }}>
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <i className="bi bi-shield-lock-fill me-2 fs-4" style={{ color: '#6f42c1' }}></i>
        <span className="fs-5 fw-bold">Painel de Controle</span>
      </div>
      <hr />

      <ul className="nav nav-pills flex-column mb-4">
        <li className="nav-item mb-1">
          <Link to="/admin/dashboard" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/dashboard') ? 'active' : ''}`} style={isActive('/admin/dashboard') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-speedometer2 fs-5"></i>
            <span>Dashboard</span>
          </Link>
        </li>
      </ul>

      <div className="text-muted small fw-bold text-uppercase px-2 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
        Módulo Acadêmico
      </div>
      <ul className="nav nav-pills flex-column mb-3">
        <li className="nav-item mb-1">
          <Link to="/admin/categorias" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/categorias') ? 'active' : ''}`} style={isActive('/admin/categorias') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-folder fs-5"></i>
            <span>Gerenciar Categorias</span>
          </Link>
        </li>
        <li className="nav-item mb-1">
          <Link to="/admin/cursos" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/cursos') ? 'active' : ''}`} style={isActive('/admin/cursos') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-book fs-5"></i>
            <span>Gerenciar Cursos</span>
          </Link>
        </li>
        <li className="nav-item mb-1">
          <Link to="/admin/conteudo" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/conteudo') ? 'active' : ''}`} style={isActive('/admin/conteudo') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-collection-play fs-5"></i>
            <span>Módulos e Aulas</span>
          </Link>
        </li>
        <li className="nav-item mb-1">
          <Link to="/admin/trilhas" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/trilhas') ? 'active' : ''}`} style={isActive('/admin/trilhas') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-signpost-split fs-5"></i>
            <span>Trilhas de Conhecimento</span>
          </Link>
        </li>
      </ul>

      <div className="text-muted small fw-bold text-uppercase px-2 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
        Usuários e Progresso
      </div>
      <ul className="nav nav-pills flex-column mb-3">
        <li className="nav-item mb-1">
          <Link to="/admin/usuarios" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/usuarios') ? 'active' : ''}`} style={isActive('/admin/usuarios') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-people fs-5"></i>
            <span>Usuários e Matrículas</span>
          </Link>
        </li>
        <li className="nav-item mb-1">
          <Link to="/admin/certificados" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/certificados') ? 'active' : ''}`} style={isActive('/admin/certificados') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-award fs-5"></i>
            <span>Progresso e Certificados</span>
          </Link>
        </li>
      </ul>

      <div className="text-muted small fw-bold text-uppercase px-2 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
        Módulo Financeiro
      </div>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-1">
          <Link to="/admin/financeiro" className={`nav-link text-white d-flex align-items-center gap-2 ${isActive('/admin/financeiro') ? 'active' : ''}`} style={isActive('/admin/financeiro') ? { backgroundColor: '#6f42c1' } : {}}>
            <i className="bi bi-credit-card-2-front fs-5"></i>
            <span>Planos e Assinaturas</span>
          </Link>
        </li>
      </ul>

      <hr />
      <div>
        <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
          <i className="bi bi-box-arrow-left me-2"></i>
          <span>Sair do Painel</span>
        </Link>
      </div>
    </div>
  );
}