// src/pages/Cadastro.tsx
import { useState } from 'react';
import { Participante, Familia } from '../types';
import { DivisorBalanceado } from '../utils/DivisorBalanceado';

// Dados fictícios simulando a importação do CSV
const mockFamilias: Familia[] = [
  { id: 'f1', nome: 'Família Leão', cor: '#ea580c', membros: [], pontuacao: 0 },
  { id: 'f2', nome: 'Família Águia', cor: '#16a34a', membros: [], pontuacao: 0 },
  { id: 'f3', nome: 'Família Lobo', cor: '#4f46e5', membros: [], pontuacao: 0 },
  { id: 'f4', nome: 'Família Tubarão', cor: '#db2777', membros: [], pontuacao: 0 },
];

const mockParticipantes: Participante[] = [
  { id: 'p1', nome: 'Mariana Silva', status: 'Aguardando' },
  { id: 'p2', nome: 'João Pedro', status: 'Aguardando' },
  { id: 'p3', nome: 'Beatriz Costa', status: 'Aguardando' },
  { id: 'p4', nome: 'Lucas Almeida', status: 'Aguardando' },
  { id: 'p5', nome: 'Ana Souza', status: 'Aguardando' },
];

export default function Cadastro() {
  // Estados da nossa aplicação
  const [participantes, setParticipantes] = useState<Participante[]>(mockParticipantes);
  const [familias, setFamilias] = useState<Familia[]>(mockFamilias);

  // Lógica acionada quando o botão laranja de "Fazer Check-In" é clicado
  const handleCheckIn = (id: string) => {
    // 1. Muda o status do participante clicado de 'Aguardando' para 'Presente'
    const participantesAtualizados = participantes.map(p => 
      p.id === id ? { ...p, status: 'Presente' as const } : p
    );

    // 2. Instancia nosso algoritmo isolado (SOLID)
    const divisor = new DivisorBalanceado();
    
    // 3. Executa a divisão para alocar o jovem na família correta
    const familiasAtualizadas = divisor.dividir(participantesAtualizados, familias);

    // 4. Salva os novos dados, fazendo o React redesenhar a tela
    setParticipantes([...participantesAtualizados]);
    setFamilias(familiasAtualizadas);
  };

  // Cálculos rápidos para o subtítulo
  const presentes = participantes.filter(p => p.status === 'Presente').length;
  const total = participantes.length;

  return (
    <div>
      {/* Cabeçalho da Tela */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '28px', margin: '0 0 5px 0' }}>Recepção e Check-in</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            {presentes} de {total} jovens presentes • {familias.length} famílias ativas
          </p>
        </div>
        <button style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          ↑ Importar Inscritos (CSV)
        </button>
      </div>

      <input 
        type="text" 
        placeholder="🔍 Buscar por nome..." 
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px' }}
      />

      {/* Tabela de Participantes */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#fdfbf9', borderBottom: '2px solid #eee', color: '#666', fontSize: '12px' }}>
            <tr>
              <th style={{ padding: '15px' }}>NOME</th>
              <th style={{ padding: '15px' }}>STATUS</th>
              <th style={{ padding: '15px' }}>FAMÍLIA</th>
              <th style={{ padding: '15px' }}>AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {participantes.map(p => {
              // Encontra a família do participante (se ele tiver uma) para pegar a cor certa
              const familiaDoJovem = familias.find(f => f.id === p.familiaId);

              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.nome}</td>
                  
                  <td style={{ padding: '15px' }}>
                    {p.status === 'Presente' ? (
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>✓ Presente</span>
                    ) : (
                      <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⏱ Aguardando</span>
                    )}
                  </td>
                  
                  <td style={{ padding: '15px' }}>
                    {familiaDoJovem ? (
                      <span style={{ backgroundColor: familiaDoJovem.cor, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {familiaDoJovem.nome}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                  
                  <td style={{ padding: '15px' }}>
                    {p.status === 'Aguardando' ? (
                      <button onClick={() => handleCheckIn(p.id)} style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                        Fazer Check-In
                      </button>
                    ) : (
                      <button style={{ backgroundColor: 'transparent', border: '1px solid #ccc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}   