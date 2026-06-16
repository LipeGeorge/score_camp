
import { openDB, DBSchema } from 'idb';

export interface GincanaDB extends DBSchema {
  pontuacoes: {
    key: string;
    value: {
      id: string;            
      familiaId: string;     
      prova: string;         
      nota: number;          
      fiscal: string;        
      timestamp: number;     
      sincronizado: boolean; 
    };
  };
}

const DB_NAME = 'score-camp-db';
const STORE_NAME = 'pontuacoes';

export const initDB = async () => {
  return openDB<GincanaDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const salvarPontuacaoOffline = async (pontuacao: GincanaDB['pontuacoes']['value']) => {
  const db = await initDB();
  await db.put(STORE_NAME, pontuacao);
};

export const buscarPontuacoesPendentes = async () => {
  const db = await initDB();
  const todas = await db.getAll(STORE_NAME);
  return todas.filter(p => !p.sincronizado);
};

export const marcarComoSincronizado = async (id: string) => {
  const db = await initDB();
  const pontuacao = await db.get(STORE_NAME, id);
  if (pontuacao) {
    pontuacao.sincronizado = true;
    await db.put(STORE_NAME, pontuacao);
  }
};