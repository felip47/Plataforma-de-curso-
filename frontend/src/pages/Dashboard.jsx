import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ courses: 0, users: 0, enrollments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [resCursos, resUsuarios, resMatriculas, resPagamentos] = await Promise.all([
          api.get('/cursos'),
          api.get('/usuarios'),
          api.get('/matriculas'),
          api.get('/pagamentos')
        ]);

        const totalRevenue = resPagamentos.data.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
        const totalStudents = resUsuarios.data.filter(u => u.tipo === 'Aluno').length;

        setMetrics({
          courses: resCursos.data.length,
          users: totalStudents,
          enrollments: resMatriculas.data.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Visão Geral</h2>
        <p className="text-muted">Indicadores estratégicos em português</p>
      </div>
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4">
            <span className="text-muted small fw-bold text-uppercase d-block mb-1">Cursos Ativos</span>
            <h3 className="fw-bold mb-0">{metrics.courses}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4">
            <span className="text-muted small fw-bold text-uppercase d-block mb-1">Alunos</span>
            <h3 className="fw-bold mb-0">{metrics.users}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4">
            <span className="text-muted small fw-bold text-uppercase d-block mb-1">Matrículas</span>
            <h3 className="fw-bold mb-0">{metrics.enrollments}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4">
            <span className="text-muted small fw-bold text-uppercase d-block mb-1">Faturamento</span>
            <h3 className="fw-bold mb-0">R$ {metrics.revenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}