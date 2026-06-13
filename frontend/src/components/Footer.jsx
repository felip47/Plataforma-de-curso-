import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <h5 className="text-white fw-bold">
              Plataforma<span style={{ color: '#f7971e' }}>Curso</span>
            </h5>
            <p className="small">A plataforma de cursos online para quem quer crescer na carreira tech.</p>
          </div>
          <div className="col-md-2 mb-3">
            <h6 className="text-white">Plataforma</h6>
            <ul className="list-unstyled small">
              <li><Link to="/cursos">Cursos</Link></li>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
          <div className="col-md-2 mb-3">
            <h6 className="text-white">Categorias</h6>
            <ul className="list-unstyled small">
              <li><Link to="/cursos?categoria=Programação">Programação</Link></li>
              <li><Link to="/cursos?categoria=Design">Design</Link></li>
              <li><Link to="/cursos?categoria=Data Science">Data Science</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-white">Contato</h6>
            <p className="small">
              <i className="bi bi-envelope me-2"></i>contato@plataformadecurso.com<br />
              <i className="bi bi-telephone me-2"></i>(62) 99999-0000
            </p>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center small mb-0">
          &copy; {new Date().getFullYear()} Plataforma de curso — PUC Goiás — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
