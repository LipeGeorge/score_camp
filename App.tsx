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
            <div style={{ backgroundColor: '#f97316', width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clipboard-list-icon lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
            </div>
            <h3>Cadastrar</h3>
            <p style={{ color: '#666', fontSize: '14px', minHeight: '50px' }}>Importe inscritos, faça check-in e organize as famílias.</p>
            <button onClick={() => setAbaAtiva('cadastro')} style={{ color: '#ea580c', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
              Entrar no painel →
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #dcfce7', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#10b981', width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/></svg>
            </div>
            <h3>Pontuação</h3>
            <p style={{ color: '#666', fontSize: '14px', minHeight: '50px' }}>Registro rápido de pontos direto do celular, mesmo offline.</p>
            <button onClick={() => setAbaAtiva('pontuacao')} style={{ color: '#ea580c', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
              Entrar no painel →
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #f3e8ff', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#a855f7', width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-podium-icon lucide-podium"><path d="M12 6V2h-1"/><path d="M9 15a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1"/><path d="M9 21V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10"/></svg>            </div>
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