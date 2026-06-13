import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CursoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signed } = useAuth();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jaMatriculado, setJaMatriculado] = useState(false);

  useEffect(() => {
    async function carregarCursoEMatricula() {
      try {
        const resCurso = await api.get(`/cursos/${id}`);
        setCurso(resCurso.data);

        if (signed && user && user.tipo === 'Aluno') {
          const resEnrollments = await api.get(`/matriculas?id_usuario=${user.id}&id_curso=${id}`);
          if (resEnrollments.data.length > 0) {
            setJaMatriculado(true);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarCursoEMatricula();
  }, [id, signed, user]);

  const handleMatricula = async () => {
    if (!signed) { navigate('/login'); return; }
    if (user.tipo !== 'Aluno') { alert('Apenas Alunos podem se matricular.'); return; }

    try {
      await api.post('/matriculas', {
        id_usuario: user.id,
        id_curso: Number(id),
        dataMatricula: new Date().toLocaleDateString('pt-BR'),
        status: 'Ativo'
      });

      if (curso.preco > 0) {
        const resSubs = await api.post('/assinaturas', {
          id_usuario: user.id,
          id_curso: Number(id),
          dataInicio: new Date().toLocaleDateString('pt-BR'),
          status: 'Ativo',
          valorCobrado: curso.preco
        });

        await api.post('/pagamentos', {
          id_assinatura: resSubs.data.id,
          valor: curso.preco,
          dataPagamento: new Date().toLocaleDateString('pt-BR'),
          status: 'Pago',
          codigoTransacao: `TRX-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }

      setJaMatriculado(true);
      alert('Inscrição confirmada com sucesso!');
    } catch (error) {
      alert('Erro ao processar matrícula.');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!curso) return <div className="container py-5 text-center">Curso não encontrado.</div>;

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-12 col-lg-8">
          <span className="badge bg-primary mb-2">{curso.categoria}</span>
          <h1 className="fw-bold">{curso.titulo}</h1>
          <p className="text-muted fs-5 mt-2">{curso.descricao}</p>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white">
            <h3 className="fw-bold mb-3" style={{ color: '#6f42c1' }}>
              {curso.preco === 0 ? 'Gratuito' : `R$ ${Number(curso.preco).toFixed(2)}`}
            </h3>
            {jaMatriculado ? (
              <button className="btn btn-success w-100" onClick={() => navigate('/painel-aluno')}>Acessar Meu Painel</button>
            ) : (
              <button className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }} onClick={handleMatricula}>Matricular-se</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}