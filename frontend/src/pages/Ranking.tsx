import { useState, useEffect } from 'react';
import { buscarRankingAPI, buscarAuditoriaAPI } from '../services/api';

interface FamiliaRanking {
  id: string;
  nome: string;
  cor: string;
  pontos: number;
  membros: number;
  posicao: number;
}

interface RegistroAuditoria {
  id: string;
  dataHora: string;
  familia: string;
  cor: string;
  prova: string;
  fiscal: string;
  nota: number;
}

export default function Ranking() {
  const [ranking, setRanking] = useState<FamiliaRanking[]>([]);
  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDadosDaAPI = async () => {
      setCarregando(true);
      
      const [dadosRanking, dadosAuditoria] = await Promise.all([
        buscarRankingAPI(),
        buscarAuditoriaAPI()
      ]);

      if (dadosRanking.length > 0) {
        const rankingOrdenado = dadosRanking.sort((a: FamiliaRanking, b: FamiliaRanking) => b.pontos - a.pontos);
        const rankingComPosicao = rankingOrdenado.map((eq: FamiliaRanking, index: number) => ({ ...eq, posicao: index + 1 }));
        setRanking(rankingComPosicao);
      }
      
      if (dadosAuditoria.length > 0) setAuditoria(dadosAuditoria);
      
      setCarregando(false);
    };

    carregarDadosDaAPI();
  }, []);

  const handleExcluirLancamento = (id: string, nota: number, familiaNome: string) => {
    const confirmacao = window.confirm(`Tem a certeza que deseja EXCLUIR o lançamento de ${nota} pontos da ${familiaNome}?`);
    
    if (confirmacao) {
      setAuditoria(auditoriaAnterior => auditoriaAnterior.filter(item => item.id !== id));
      
      setRanking(rankingAnterior => {
        const novoRanking = rankingAnterior.map(equipe => {
          if (equipe.nome === familiaNome) {
            return { ...equipe, pontos: equipe.pontos - nota };
          }
            return equipe;
        });
        
        return novoRanking.sort((a, b) => b.pontos - a.pontos).map((eq, index) => ({...eq, posicao: index + 1}));
      });

      alert('✅ Lançamento excluído e placar recalculado!');
    }
  };

  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#71717a' }}>⏳ Conectando ao Servidor Oficial...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '32px', margin: '0 0 5px 0', color: '#27272a' }}>Dashboard do ScoreCamp</h2>
          <p style={{ color: '#71717a', margin: 0, fontSize: '16px' }}>Resultado consolidado em tempo real.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px', color: '#a1a1aa' }}>👥</span>
            <div>
              <div style={{ fontSize: '12px', color: '#71717a' }}>Famílias</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{ranking.length}</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px', color: '#a1a1aa' }}>📈</span>
            <div>
              <div style={{ fontSize: '12px', color: '#71717a' }}>Lançamentos</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{auditoria.length}</div>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '14px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>🏆 Ranking Geral</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
        {ranking.map(equipe => (
          <div key={equipe.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '25px', border: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: equipe.cor, width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                {equipe.posicao}º
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#27272a' }}>{equipe.nome}</h4>
                <p style={{ margin: 0, color: '#71717a', fontSize: '14px' }}>{equipe.membros} membros</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#27272a', lineHeight: '1' }}>{equipe.pontos}</div>
              <div style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Pontos</div>
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: '25px', right: '25px', height: '4px', backgroundColor: equipe.cor, borderRadius: '4px 4px 0 0', opacity: equipe.posicao === 1 ? 1 : 0.6 }}></div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '14px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>📋 Auditoria de Lançamentos</h3>
      
      <div style={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#fdfbf9', borderBottom: '2px solid #e4e4e7', color: '#71717a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <tr>
              <th style={{ padding: '20px' }}>Data/Hora</th>
              <th style={{ padding: '20px' }}>Família</th>
              <th style={{ padding: '20px' }}>Prova</th>
              <th style={{ padding: '20px' }}>Fiscal</th>
              <th style={{ padding: '20px', textAlign: 'right' }}>Nota</th>
              <th style={{ padding: '20px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {auditoria.map(registro => (
              <tr key={registro.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                <td style={{ padding: '20px', color: '#71717a' }}>{registro.dataHora}</td>
                <td style={{ padding: '20px', fontWeight: '500', color: '#27272a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: registro.cor }}></div>
                  {registro.familia}
                </td>
                <td style={{ padding: '20px', color: '#52525b' }}>{registro.prova}</td>
                <td style={{ padding: '20px', color: '#52525b' }}>{registro.fiscal}</td>
                <td style={{ padding: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#27272a' }}>{registro.nota}</td>
                <td style={{ padding: '20px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '15px' }} title="Editar (Em breve)">✏️</button>
                  <button 
                    onClick={() => handleExcluirLancamento(registro.id, registro.nota, registro.familia)}
                    title="Excluir Lançamento"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ef4444' }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}