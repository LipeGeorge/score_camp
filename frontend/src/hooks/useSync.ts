import { useEffect } from 'react';
import { buscarPontuacoesNaoSincronizadas, marcarComoSincronizado } from '../services/db';
import api from '../services/api';

export function useSync() {
  useEffect(() => {
    const tentarSincronizar = async () => {

      if (!navigator.onLine) return;

      try {
  
        const pendentes = await buscarPontuacoesNaoSincronizadas();
        
        if (pendentes.length > 0) {
          console.log(`📡 Sincronizando ${pendentes.length} pacotes pendentes em background...`);
          

          const payloadEnvio = pendentes.map(p => ({
            id_familia: p.id_familia,
            id_prova: p.id_prova,
            qtd_pontos: p.qtd_pontos,
            timestamp_dev: p.timestamp_dev
          }));


          await api.post('/pontuacao/sync', payloadEnvio, {
            headers: {
              'X_API_KEY_BACKEND': 'ScoreCampV1Show'
            }
          });


          for (const item of pendentes) {
            await marcarComoSincronizado(item.id_local);
          }
          console.log('✅ Sincronização em background concluída com sucesso!');
        }
      } catch (erro) {
        console.error('❌ Falha na sincronização em background. Tentaremos novamente depois.', erro);
      }
    };


    window.addEventListener('online', tentarSincronizar);

    const intervalo = setInterval(tentarSincronizar, 30000);

    return () => {
      window.removeEventListener('online', tentarSincronizar);
      clearInterval(intervalo);
    };
  }, []); 
}