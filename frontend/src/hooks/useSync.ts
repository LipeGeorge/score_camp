
import { useEffect } from 'react';
import { buscarPontuacoesPendentes, marcarComoSincronizado } from '../services/db';
import { sincronizarPontuacoesAPI } from '../services/api';

export function useSync() {
  useEffect(() => {
    const tentarSincronizar = async () => {
      if (!navigator.onLine) return;

      try {
        const pendentes = await buscarPontuacoesPendentes();
        
        if (pendentes.length > 0) {
          console.log(`📡 Sincronizando ${pendentes.length} pacotes pendentes...`);
          
          const sucesso = await sincronizarPontuacoesAPI(pendentes);

          if (sucesso) {
            for (const item of pendentes) {
              await marcarComoSincronizado(item.id);
            }
            console.log('✅ Sincronização concluída com sucesso!');
          }
        }
      } catch (erro) {
        console.error('❌ Falha na sincronização em background. Tentaremos novamente.', erro);
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