import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PainelAluno() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [resCourses, resEnrollments, resSubs] = await Promise.all([
          api.get('/cursos'),
          api.get('/matriculas'),
          api.get('/assinaturas')
        ]);
        
        setCursos(resCourses.data);
        setMatriculas(resEnrollments.data);
        setAssinaturas(resSubs.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  if (!user) return null;

  const minhasMatriculas = matriculas.filter(m => m.id_usuario === user.id);
  const meusCursos = cursos.filter(c => minhasMatriculas.some(m => m.id_curso === c.id));
  const minhasAssinaturas = assinaturas.filter(a => a.id_usuario === user.id);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
        <h2 className="fw-bold m-0">Olá, {user.nome}!</h2>
        <p className="m-0 mt-1 opacity-75">{user.email} • Área Estudantil</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-4">Meus Cursos em Andamento</h5>
            {meusCursos.map(curso => (
              <div className="p-3 border rounded bg-light mb-2" key={curso.id}>
                <h6 className="fw-bold mb-1">{curso.titulo}</h6>
                <span className="text-muted small">{curso.duracao} • Nível {curso.nivel}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Histórico Financeiro</h5>
            {minhasAssinaturas.map(ass => (
              <div className="p-3 border rounded bg-light mb-2" key={ass.id}>
                <div className="fw-bold text-success">Acesso Liberado</div>
                <div className="small text-muted">Investimento: R$ {Number(ass.valorCobrado).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}