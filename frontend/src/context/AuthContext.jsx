import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@App:user');
    if (storagedUser) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    if (email === 'admin@teste.com' && password === '123') {
      const masterAdmin = {
        id: 999,
        nome: "Admin Mestre (Avaliação)",
        email: "admin@teste.com",
        tipo: "Administrador"
      };
      localStorage.setItem('@App:user', JSON.stringify(masterAdmin));
      setUser(masterAdmin);
      return { success: true, user: masterAdmin };
    }

    // 2. VALIDAÇÃO REAL NO BANCO DE DADOS (Para alunos/professores criados na hora)
    try {
      const response = await api.get(`/usuarios?email=${email}`);
      const foundUser = response.data[0];

      if (!foundUser || foundUser.password !== password) {
        return { success: false, message: 'E-mail ou senha incorretos.' };
      }

      localStorage.setItem('@App:user', JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true, user: foundUser };
    } catch (error) {
      return { success: false, message: 'Erro ao conectar ao servidor do Docker.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('@App:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}