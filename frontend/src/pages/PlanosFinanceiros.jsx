import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Financeiro() {
  const [planos, setPlanos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nomePlano, setNomePlano] = useState('');
  const [precoPlano, setPrecoPlano] = useState('');
  const [periodicidade, setPeriodicidade] = useState('Mensal');
  const [descricaoPlano, setDescricaoPlano] = useState('');

  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [planoSelecionado, setPlanoSelecionado] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resPlanos, resUsuarios, resAssinaturas] = await Promise.all([
        api.get('/planos'),
        api.get('/usuarios'),
        api.get('/assinaturas')
      ]);
      setPlanos(resPlanos.data);
      setUsuarios(resUsuarios.data);
      setAssinaturas(resAssinaturas.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarPlano = async (e) => {
    e.preventDefault();
    const novoPlano = {
      nome: nomePlano,
      preco: Number(precoPlano) || 0,
      periodicidade,
      descricao: descricaoPlano,
      status: 'Ativo'
    };

    try {
      const response = await api.post('/planos', novoPlano);
      setPlanos([...planos, response.data]);
      setNomePlano('');
      setPrecoPlano('');
      setDescricaoPlano('');
      setPeriodicidade('Mensal');
      alert('Plano comercial configurado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar plano.');
    }
  };

  const handleCriarAssinatura = async (e) => {
    e.preventDefault();
    if (!usuarioSelecionado || !planoSelecionado) {
      alert('Selecione o aluno e o plano!');
      return;
    }

    const plano = planos.find(p => p.id === Number(planoSelecionado));
    const novaAssinatura = {
      id_usuario: Number(usuarioSelecionado),
      id_plano: Number(planoSelecionado),
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
      valorCobrado: plano.preco
    };

    try {
      const response = await api.post('/assinaturas', novaAssinatura);
      
      await api.post('/pagamentos', {
        id_assinatura: response.data.id,
        valor: plano.preco,
        dataPagamento: new Date().toLocaleDateString('pt-BR'),
        status: 'Pago',
        codigoTransacao: `TRX-${Math.floor(100000 + Math.random() * 900000)}`
      });

      setAssinaturas([...assinaturas, response.data]);
      setUsuarioSelecionado('');
      setPlanoSelecionado('');
      alert('Assinatura ativada e transação financeira gerada!');
    } catch (error) {
      console.error(error);
      alert('Erro ao processar assinatura.');
    }
  };

  const handleExcluirPlano = async (id) => {
    if (!window.confirm('Deseja remover esta oferta comercial?')) return;
    try {
      await api.delete(`/planos/${id}`);
      setPlanos(planos.filter(p => p.id !== id));
      alert('Plano removido.');
    } catch (error) {
      console.error(error);
    }
  };

  const getNomeUsuario = (id) => {
    const user = usuarios.find(u => u.id === id);
    return user ? user.nome : `Usuário #${id}`;
  };

  const getNomePlano = (id) => {
    const plano = planos.find(p => p.id === id);
    return plano ? `${plano.nome} (${plano.periodicidade})` : `Plano #${id}`;
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Módulo Financeiro</h2>
        <p className="text-muted">Ofertas comerciais, periodicidades de acesso e fluxo de checkout</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Configurar Plano Comercial</h5>
            <form onSubmit={handleCriarPlano}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Nome do Plano *</label>
                <input type="text" className="form-control" value={nomePlano} onChange={e => setNomePlano(e.target.value)} placeholder="Ex: Plano Premium Anual" required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Preço (R$) *</label>
                  <input type="number" step="0.01" className="form-control" value={precoPlano} onChange={e => setPrecoPlano(e.target.value)} placeholder="89.90" required />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Periodicidade *</label>
                  <select className="form-select" value={periodicidade} onChange={e => setPeriodicidade(e.target.value)}>
                    <option value="Mensal">Mensal</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Descrição da Oferta *</label>
                <textarea className="form-control" rows="2" value={descricaoPlano} onChange={e => setDescricaoPlano(e.target.value)} placeholder="Ex: Acesso irrestrito a todas as formações..." required></textarea>
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#6f42c1' }}>
                Publicar Oferta
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Simular Checkout de Assinatura</h5>
            <form onSubmit={handleCriarAssinatura}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Selecionar Cliente *</label>
                <select className="form-select" value={usuarioSelecionado} onChange={e => setUsuarioSelecionado(e.target.value)} required>
                  <option value="">Escolha um usuário...</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Selecionar Plano Comercial *</label>
                <select className="form-select" value={planoSelecionado} onChange={e => setPlanoSelecionado(e.target.value)} required>
                  <option value="">Escolha um plano de acesso...</option>
                  {planos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} — R$ {Number(p.preco).toFixed(2)} ({p.periodicidade})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#28a745' }} disabled={planos.length === 0 || usuarios.length === 0}>
                Efetivar Assinatura e Gerar Receita
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Planos de Acesso Ativos</h5>
            {loading ? (
              <div className="text-center py-3"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Plano</th>
                      <th>Preço</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planos.length === 0 ? (
                      <tr><td colSpan="3" className="text-center text-muted py-3">Nenhum plano configurado.</td></tr>
                    ) : (
                      planos.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="fw-bold">{p.nome}</div>
                            <span className="badge bg-light text-dark small">{p.periodicidade}</span>
                          </td>
                          <td className="fw-semibold text-success small">R$ {Number(p.preco).toFixed(2)}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluirPlano(p.id)}><i className="bi bi-trash"></i></button>
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

        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Histórico de Cobranças e Assinaturas</h5>
            {loading ? (
              <div className="text-center py-3"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Cliente</th>
                      <th>Plano Contratado</th>
                      <th>Data Início</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assinaturas.length === 0 ? (
                      <tr><td colSpan="4" className="text-center text-muted py-3">Nenhuma transação registrada.</td></tr>
                    ) : (
                      assinaturas.map(a => (
                        <tr key={a.id}>
                          <td className="fw-bold small">{getNomeUsuario(a.id_usuario)}</td>
                          <td className="small text-muted">{getNomePlano(a.id_plano)}</td>
                          <td className="small text-muted">{a.dataInicio}</td>
                          <td><span className="badge bg-success-subtle text-success">Ativa • Pago</span></td>
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