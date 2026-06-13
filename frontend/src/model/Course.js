export const createCourse = ({
  id = null,
  titulo = '',
  descricao = '',
  instrutor = '',
  categoria = '',
  nivel = 'Iniciante',
  preco = 0,
  duracao = '',
  aulas = 0,
  imagem = '',
  avaliacao = 0,
  alunos = 0,
  gratis = false,
  destaque = false,
  topicos = [],
}) => ({
  id, titulo, descricao, instrutor, categoria,
  nivel, preco, duracao, aulas, imagem,
  avaliacao, alunos, gratis, destaque, topicos,
})

export const niveis = ['Iniciante', 'Intermediário', 'Avançado']

export const categorias = [
  'Programação', 'Design', 'Marketing',
  'Negócios', 'Data Science', 'DevOps', 'Mobile',
]
