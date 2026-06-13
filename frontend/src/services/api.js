import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})


export const cursoService = {
  listar: () => api.get('/cursos'),
  buscarPorId: (id) => api.get(`/cursos/${id}`),
  criar: (dados) => api.post('/cursos', dados),
  atualizar: (id, dados) => api.put(`/cursos/${id}`, dados),
  deletar: (id) => api.delete(`/cursos/${id}`),
  buscarPorCategoria: (categoria) =>
    api.get(`/cursos?categoria=${encodeURIComponent(categoria)}`),
  destaques: () => api.get('/cursos?destaque=true'),
}


export const categoriaService = {
  listar: () => api.get('/categorias'),
  criar: (dados) => api.post('/categorias', dados),
  deletar: (id) => api.delete(`/categorias/${id}`),
}


export const usuarioService = {
  listar: () => api.get('/usuarios'),
  criar: (dados) => api.post('/usuarios', dados),
  matricular: (dadosMatricula) => api.post('/matriculas', dadosMatricula),
}

export default api