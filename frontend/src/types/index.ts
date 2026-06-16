

export interface Participante {
    id: string;
    nome: string;
    status: 'Aguardando' | 'Presente';
    familiaId?: string; 
  }
  
  export interface Familia {
    id: string;
    nome: string;
    cor: string; 
    membros: Participante[];
    pontuacao: number;
  }
  
  export interface IDivisorEquipes {
    dividir(participantes: Participante[], familias: Familia[]): Familia[];
  }