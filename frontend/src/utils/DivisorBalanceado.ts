    // src/utils/DivisorBalanceado.ts
import { Participante, Familia, IDivisorEquipes } from '../types';

export class DivisorBalanceado implements IDivisorEquipes {
  dividir(participantes: Participante[], familias: Familia[]): Familia[] {
    // 1. Criamos cópias para não ferir o princípio de Imutabilidade do React
    const familiasAtualizadas = familias.map(f => ({ ...f, membros: [...f.membros] }));
    
    // 2. Separamos quem já está 'Presente' (fez check-in) mas ainda não tem família
    const aptosParaSorteio = participantes.filter(p => p.status === 'Presente' && !p.familiaId);

    // 3. Distribuição balanceada
    aptosParaSorteio.forEach(participante => {
      // Ordena as famílias da que tem MENOS membros para a que tem MAIS
      familiasAtualizadas.sort((a, b) => a.membros.length - b.membros.length);
      
      // A primeira família da lista sempre será a mais "vazia" no momento
      const familiaEscolhida = familiasAtualizadas[0];
      
      // Vincula o jovem à família
      participante.familiaId = familiaEscolhida.id;
      familiaEscolhida.membros.push(participante);
    });

    return familiasAtualizadas;
  }
}