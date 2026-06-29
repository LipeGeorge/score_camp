
import { Participante, Familia, IDivisorEquipes } from '../types';

export class DivisorBalanceado implements IDivisorEquipes {
  dividir(participantes: Participante[], familias: Familia[]): Familia[] {
    const familiasAtualizadas = familias.map(f => ({ ...f, membros: [...f.membros] }));
    
    const aptosParaSorteio = participantes.filter(p => p.status === 'Presente' && !p.familiaId);

    aptosParaSorteio.forEach(participante => {
      familiasAtualizadas.sort((a, b) => a.membros.length - b.membros.length);
      
      const familiaEscolhida = familiasAtualizadas[0];
      
      participante.familiaId = familiaEscolhida.id;
      familiaEscolhida.membros.push(participante);
    });

    return familiasAtualizadas;
  }
}