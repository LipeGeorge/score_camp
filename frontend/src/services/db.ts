import { openDB, DBSchema } from 'idb';

export interface GincanaDB extends DBSchema {
  pontuacoes: {
    key: string;
    value: {
      id_local: string;        // O novo nome do ID local
      id_familia: number;      // Padrão exigido pelo Back-end
      id_prova: number;        // Padrão exigido pelo Back-end
      qtd_pontos: number;      // Padrão exigido pelo Back-end
      timestamp_dev: string;   // Padrão exigido pelo Back-end
      sincronizado: boolean; 
    };
  };
}

const DB_NAME = 'score-camp-db';
const STORE_NAME = 'pontuacoes';


export const initDB = async () => {
  return openDB<GincanaDB>(DB_NAME, 2, {
    upgrade(db, oldVersion) {

      if (oldVersion < 2 && db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id_local' });
      }
    },
  });
};


export const salvarPontuacaoOffline = async (pontuacao: GincanaDB['pontuacoes']['value']) => {
  const db = await initDB();
  await db.put(STORE_NAME, pontuacao);
};


export const buscarPontuacoesNaoSincronizadas = async () => {
  const db = await initDB();
  const todas = await db.getAll(STORE_NAME);
  return todas.filter(p => !p.sincronizado);
};

export const limparPontuacoesOffline = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};


export const marcarComoSincronizado = async (id_local: string) => {
  const db = await initDB();
  const pontuacao = await db.get(STORE_NAME, id_local);
  if (pontuacao) {
    pontuacao.sincronizado = true;
    await db.put(STORE_NAME, pontuacao);
  }
};