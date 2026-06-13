import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import Cursos from './pages/Cursos';
import CursoDetalhe from './pages/CursoDetalhe';
import PainelAluno from './pages/PainelAluno';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import FormCurso from './pages/FormCurso';
import Categorias from './pages/Categorias';
import Modulos from './pages/Modulos';
import Trilhas from './pages/Trilhas';
import Usuarios from './pages/Usuarios';
import CertificadosAdmin from './pages/CertificadosAdmin';
import PlanosFinanceiros from './pages/PlanosFinanceiros';

function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || (user.tipo !== 'Administrador' && user.tipo !== 'Professor')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Outlet />
      </main>
    </div>
  );
}

function AlunoRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.tipo !== 'Aluno') {
    return <Navigate to="/login" replace />;
  }

  return <PainelAluno />;
}

function NotFound() {
  return (
    <div className="container py-5 text-center">
      <i className="bi bi-emoji-frown" style={{ fontSize: '4rem', color: '#6c3fc5' }}></i>
      <h2 className="mt-3">Página não encontrada</h2>
      <a href="/" className="btn btn-primary-custom mt-3">Voltar ao início</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalhe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/painel-aluno" element={<AlunoRoute />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="conteudo" element={<Modulos />} />
          <Route path="trilhas" element={<Trilhas />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="certificados" element={<CertificadosAdmin />} />
          <Route path="financeiro" element={<PlanosFinanceiros />} />
          <Route path="cursos" element={<Admin />} />
          <Route path="novo" element={<FormCurso />} />
          <Route path="editar/:id" element={<FormCurso />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}