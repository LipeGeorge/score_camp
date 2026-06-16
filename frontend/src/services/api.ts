
import axios from 'axios';
import { GincanaDB } from './db';

const api = axios.create({
  baseURL: 'https://api-scorecamp.exemplo.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const sincronizarPontuacoesAPI = async (pontuacoesPendentes: GincanaDB['pontuacoes']['value'][]) => {
  if (pontuacoesPendentes.length === 0) return true;

  try {
    const resposta = await api.post('/pontuacoes/sync', {
      lote: pontuacoesPendentes
    });

    return resposta.status === 200 || resposta.status === 201;
  } catch (erro) {
    console.error('Falha na sincronização com o FastAPI:', erro);
    throw erro; 
  }
};

export default api;