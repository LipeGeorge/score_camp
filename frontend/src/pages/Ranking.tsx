/*
import { useState, useEffect } from 'react';
import api from '../services/api';

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
      
      try {
      
        const resRanking = await api.get('/pontuacao/ranking', {
          headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
        });
        
        console.log("📊 [DEBUG] Dados brutos do Ranking recebidos:", resRanking.data);
        
      
        const dadosArray = Array.isArray(resRanking.data) ? resRanking.data : (resRanking.data.ranking || []);
        let rankingPadronizado: FamiliaRanking[] = [];

        if (dadosArray.length > 0) {
          // MAPEAMENTO À PROVA DE BALAS
          rankingPadronizado = dadosArray.map((item: any, index: number) => ({
            id: item.id?.toString() || item.id_familia?.toString() || String(index),
            nome: item.nome || item.nome_familia || 'Família Desconhecida',
            cor: item.cor || '#94a3b8',
            pontos: Number(item.pontos !== undefined ? item.pontos : (item.qtd_pontos || 0)),
            membros: item.membros || 0,
            posicao: 0 
          }));

          const rankingOrdenado = [...rankingPadronizado].sort((a, b) => b.pontos - a.pontos);
          const rankingComPosicao = rankingOrdenado.map((eq, index) => ({ ...eq, posicao: index + 1 }));
          setRanking(rankingComPosicao);
        }

      
        try {
      
          if (rankingPadronizado.length > 0) {
            const promessasDeHistorico = rankingPadronizado.map(async (equipe) => {
              try {
                const resHist = await api.get(`/pontuacao/historico/familia/${equipe.id}`, {
                  headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
                });
                
                const dadosHistorico = Array.isArray(resHist.data) ? resHist.data : [];
                
              
                const historicoFormatado = dadosHistorico.map((item: any, index: number) => ({
                  id: item.id?.toString() || `provisorio-${equipe.id}-${index}`, 
                  dataHora: item.timestamp_dev ? new Date(item.timestamp_dev).toLocaleString('pt-BR') : 'Data não informada',
                  familia: equipe.nome,
                  cor: equipe.cor,
                  prova: item.nome_prova || `Prova ${item.id_prova || 'Desconhecida'}`,
                  fiscal: 'Admin',
                  nota: Number(item.qtd_pontos || item.pontos || 0)
                }));
  
                return historicoFormatado;
              } catch {
                console.warn(`⚠️ Histórico vazio ou erro na família ${equipe.nome}`);
                return [];
              }
            });
  
            const resultados = await Promise.all(promessasDeHistorico);
            const auditoriaCompleta = resultados.flat();
            
            setAuditoria(auditoriaCompleta);
          }
        } catch (erro) {
          console.error("❌ Erro ao montar o histórico das famílias:", erro);
        }

      } catch (erro) {
        console.error("❌ Erro ao carregar os dados do dashboard:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDaAPI();
  }, []);

  const handleExcluirLancamento = async (id: string, nota: number, familiaNome: string) => {
    // Se o ID tiver "provisorio", significa que o backend não enviou o ID real na rota do histórico
    if (id.includes('provisorio')) {
      alert("❌ O servidor não forneceu o ID exato deste lançamento. Peça ao Back-end para incluir o 'id' na resposta da rota de histórico da família!");
      return;
    }

    const confirmacao = window.confirm(`Tem a certeza que deseja EXCLUIR o lançamento de ${nota} pontos da ${familiaNome}?`);
    
    if (confirmacao) {
      try {
        await api.delete(`/pontuacao/apagar/${id}`, {
          headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
        });

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

        alert('✅ Lançamento excluído com sucesso do servidor e placar recalculado!');
      } catch (erro) {
        console.error(erro);
        alert('❌ Erro ao tentar excluir no servidor. Verifique a conexão.');
      }
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
      
      {ranking.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b' }}>
          Nenhuma família encontrada. Cadastre famílias e pontuações para visualizar o ranking!
        </div>
      ) : (
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
      )}

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
            {auditoria.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum lançamento de pontos encontrado.
                </td>
              </tr>
            ) : (
              auditoria.map(registro => (
                <tr key={registro.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '20px', color: '#71717a' }}>{registro.dataHora}</td>
                  <td style={{ padding: '20px', fontWeight: '500', color: '#27272a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: registro.cor || '#ccc' }}></div>
                    {registro.familia || 'Desconhecida'}
                  </td>
                  <td style={{ padding: '20px', color: '#52525b' }}>{registro.prova}</td>
                  <td style={{ padding: '20px', color: '#52525b' }}>{registro.fiscal || 'Admin'}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}*/

import { useState, useEffect } from 'react';
import api from '../services/api';

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
      
      try {
      
        const resRanking = await api.get('/pontuacao/ranking', {
          headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
        });
        
        console.log("📊 [DEBUG] Dados brutos do Ranking recebidos:", resRanking.data);

        // Handle object structure {family: points}
        let dadosArray: any[] = [];

        if (Array.isArray(resRanking.data)) {
          dadosArray = resRanking.data;
        } else if (resRanking.data.ranking && Array.isArray(resRanking.data.ranking)) {
          dadosArray = resRanking.data.ranking;
        } else if (typeof resRanking.data === 'object' && resRanking.data !== null) {
          // Convert {family: points} to array format
          dadosArray = Object.entries(resRanking.data).map(([nome, pontos]) => ({
            nome: nome,
            pontos: pontos
          }));
        }

        console.log("📊 [DEBUG] dadosArray.length:", dadosArray.length);
        let rankingPadronizado: FamiliaRanking[] = [];

        if (dadosArray.length > 0) {
          // MAPEAMENTO À PROVA DE BALAS
          rankingPadronizado = dadosArray.map((item: any, index: number) => ({
            id: item.id?.toString() || item.id_familia?.toString() || String(index),
            nome: item.nome || item.nome_familia || 'Família Desconhecida',
            cor: item.cor || '#94a3b8',
            pontos: Number(item.pontos !== undefined ? item.pontos : (item.qtd_pontos || 0)),
            membros: item.membros || 0,
            posicao: 0
          }));

          const rankingOrdenado = [...rankingPadronizado].sort((a, b) => b.pontos - a.pontos);
          const rankingComPosicao = rankingOrdenado.map((eq, index) => ({ ...eq, posicao: index + 1 }));

          setRanking(rankingComPosicao);
        }

      
        try {
      
          if (rankingPadronizado.length > 0) {
            const promessasDeHistorico = rankingPadronizado.map(async (equipe) => {
              try {
                const resHist = await api.get(`/pontuacao/historico/familia/${equipe.id}`, {
                  headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
                });
                
                const dadosHistorico = Array.isArray(resHist.data) ? resHist.data : [];
                
              
                const historicoFormatado = dadosHistorico.map((item: any, index: number) => ({
                  id: item.id?.toString() || `provisorio-${equipe.id}-${index}`, 
                  dataHora: item.timestamp_dev ? new Date(item.timestamp_dev).toLocaleString('pt-BR') : 'Data não informada',
                  familia: equipe.nome,
                  cor: equipe.cor,
                  prova: item.nome_prova || `Prova ${item.id_prova || 'Desconhecida'}`,
                  fiscal: 'Admin',
                  nota: Number(item.qtd_pontos || item.pontos || 0)
                }));
  
                return historicoFormatado;
              } catch {
                console.warn(`⚠️ Histórico vazio ou erro na família ${equipe.nome}`);
                return [];
              }
            });
  
            const resultados = await Promise.all(promessasDeHistorico);
            const auditoriaCompleta = resultados.flat();
            
            setAuditoria(auditoriaCompleta);
          }
        } catch (erro) {
          console.error("❌ Erro ao montar o histórico das famílias:", erro);
        }

      } catch (erro) {
        console.error("❌ Erro ao carregar os dados do dashboard:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDaAPI();
  }, []);

  const handleExcluirLancamento = async (id: string, nota: number, familiaNome: string) => {
    // Se o ID tiver "provisorio", significa que o backend não enviou o ID real na rota do histórico
    if (id.includes('provisorio')) {
      alert("❌ O servidor não forneceu o ID exato deste lançamento. Peça ao Back-end para incluir o 'id' na resposta da rota de histórico da família!");
      return;
    }

    const confirmacao = window.confirm(`Tem a certeza que deseja EXCLUIR o lançamento de ${nota} pontos da ${familiaNome}?`);
    
    if (confirmacao) {
      try {
        await api.delete(`/pontuacao/apagar/${id}`, {
          headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
        });

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

        alert('✅ Lançamento excluído com sucesso do servidor e placar recalculado!');
      } catch (erro) {
        console.error(erro);
        alert('❌ Erro ao tentar excluir no servidor. Verifique a conexão.');
      }
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
      
      {ranking.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b' }}>
          Nenhuma família encontrada. Cadastre famílias e pontuações para visualizar o ranking!
        </div>
      ) : (
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
      )}

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
            {auditoria.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum lançamento de pontos encontrado.
                </td>
              </tr>
            ) : (
              auditoria.map(registro => (
                <tr key={registro.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '20px', color: '#71717a' }}>{registro.dataHora}</td>
                  <td style={{ padding: '20px', fontWeight: '500', color: '#27272a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: registro.cor || '#ccc' }}></div>
                    {registro.familia || 'Desconhecida'}
                  </td>
                  <td style={{ padding: '20px', color: '#52525b' }}>{registro.prova}</td>
                  <td style={{ padding: '20px', color: '#52525b' }}>{registro.fiscal || 'Admin'}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}