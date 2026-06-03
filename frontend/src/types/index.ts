// src/types/index.ts

export interface Participante {
    id: string;
    nome: string;
    status: 'Aguardando' | 'Presente';
    familiaId?: string; // Opcional, pois ele chega sem família da planilha CSV
  }
  
  export interface Familia {
    id: string;
    nome: string;
    cor: string; // ex: '#f97316' 
    membros: Participante[];
    pontuacao: number;
  }
  
  // DIP (Princípio da Inversão de Dependência)
  // O nosso sistema React dependerá desta interface, não de uma classe concreta.
  export interface IDivisorEquipes {
    dividir(participantes: Participante[], familias: Familia[]): Familia[];
  }