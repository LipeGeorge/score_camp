import { useState } from 'react';
import Cadastro from './pages/Cadastro';
import Pontuacao from './pages/Pontuacao';
import Ranking from './pages/Ranking';
import { useSync } from './hooks/useSync';

type Aba = 'home' | 'cadastro' | 'pontuacao' | 'ranking';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('home');

  useSync();

  const renderHeader = () => (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ backgroundColor: '#f97316', padding: '10px', borderRadius: '50%', color: 'white' }}>🔥</div>
        <div>
          <h1 style={{ fontSize: '18px', margin: 0 }}>Acamp's ScoreCamp</h1>
          <span style={{ fontSize: '12px', color: '#666' }}>SISTEMA OFICIAL - PJJ</span>
        </div>
      </div>
      <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
        📶 Online
      </div>
    </header>
  );

  if (abaAtiva === 'home') {
    return (
      <div style={{ fontFamily: 'sans-serif', padding: '30px', backgroundColor: '#fdfbf9', minHeight: '100vh' }}>
        {renderHeader()}
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ backgroundColor: '#fed7aa', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#ea580c' }}>
            🏕️ PROJETO JUVENTUDE PARA JESUS
          </span>
          <h2 style={{ fontSize: '36px', marginTop: '15px' }}>Bem-vindo ao ScoreCamp</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #fce7f3', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#f97316', width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px' }}></div>
            <h3>Cadastrar</h3>
            <p style={{ color: '#666', fontSize: '14px', minHeight: '50px' }}>Importe inscritos, faça check-in e organize as famílias.</p>
            <button onClick={() => setAbaAtiva('cadastro')} style={{ color: '#ea580c', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
              Entrar no painel →
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #dcfce7', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#10b981', width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px' }}></div>
            <h3>Pontuação</h3>
            <p style={{ color: '#666', fontSize: '14px', minHeight: '50px' }}>Registro rápido de pontos direto do celular, mesmo offline.</p>
            <button onClick={() => setAbaAtiva('pontuacao')} style={{ color: '#ea580c', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
              Entrar no painel →
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #f3e8ff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#a855f7', width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px' }}></div>
            <h3>Ranking</h3>
            <p style={{ color: '#666', fontSize: '14px', minHeight: '50px' }}>Acompanhe o ranking geral e audite todos os lançamentos.</p>
            <button onClick={() => setAbaAtiva('ranking')} style={{ color: '#ea580c', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
              Entrar no painel →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '30px', backgroundColor: '#fdfbf9', minHeight: '100vh' }}>
      {renderHeader()}
      
      <button onClick={() => setAbaAtiva('home')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc' }}>
        ← Voltar para Início
      </button>

      <main style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        {abaAtiva === 'cadastro' && <Cadastro />}
        {abaAtiva === 'pontuacao' && <Pontuacao />}
        {abaAtiva === 'ranking' && <Ranking />}
      </main>
    </div>
  );
}