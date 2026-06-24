import axios from 'axios';
import { GincanaDB } from './db';

const api = axios.create({
  baseURL: 'https://score-camp.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const sincronizarPontuacoesAPI = async (pontuacoesPendentes: GincanaDB['pontuacoes']['value'][]) => {
  if (pontuacoesPendentes.length === 0) return true;
  try {
    // ⚠️ AVISO: Esta requisição vai falhar (Erro 404) até
    // atualizar a API no Render com as rotas de pontuação.
    const resposta = await api.post('/pontuacoes/sync', { lote: pontuacoesPendentes });
    return resposta.status === 200 || resposta.status === 201;
  } catch (erro) {
    console.error('Falha na sincronização com o FastAPI:', erro);
    throw erro;
  }
};

export const buscarRankingAPI = async () => {
  try {
    const resposta = await api.get('/familia/'); 
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar as famílias:', erro);
    return []; 
  }
};

export const buscarAuditoriaAPI = async () => {
  try {
    // ⚠️ AVISO: Esta rota também vai dar Erro 404 até a API ser atualizada na nuvem.
    // Usaremos a nomenclatura padrão que definimos: '/pontuacoes/historico'
    const resposta = await api.get('/pontuacoes/historico');
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar a auditoria:', erro);
    return [];
  }
};

export default api;