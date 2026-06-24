
import { useState } from 'react';
import { salvarPontuacaoOffline } from '../services/db';

const mockFamilias = [
  { id: 'f1', nome: 'Família Pio' },
  { id: 'f2', nome: 'Família Miguel' },
  { id: 'f3', nome: 'Família Assis' },
  { id: 'f4', nome: 'Família Lolek' },
];

const mockProvas = [
  { id: 'pr1', nome: 'Cabo de Guerra', teto: 100 },
  { id: 'pr2', nome: 'Caça ao Tesouro', teto: 80 },
  { id: 'pr3', nome: 'Apresentação Teatral', teto: 50 },
];

export default function Pontuacao() {
  const [familiaId, setFamiliaId] = useState('');
  const [provaId, setProvaId] = useState('');
  const [nota, setNota] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const handleSalvar = async () => {
    if (!familiaId || !provaId || !nota) {
      setMensagem({ texto: '⚠️ Preencha todos os campos.', tipo: 'erro' });
      return;
    }

    const notaNumerica = Number(nota);
    const provaSelecionada = mockProvas.find(p => p.id === provaId);

    if (provaSelecionada && notaNumerica > provaSelecionada.teto) {
      setMensagem({ 
        texto: `❌ A nota máxima para ${provaSelecionada.nome} é ${provaSelecionada.teto}.`, 
        tipo: 'erro' 
      });
      return;
    }

    const novaPontuacao = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
      familiaId,
      prova: provaSelecionada?.nome || 'Prova Desconhecida',
      nota: notaNumerica,
      fiscal: 'Lucas', 
      timestamp: Date.now(), 
      sincronizado: false 
    };

    try {
      await salvarPontuacaoOffline(novaPontuacao);
      
      setMensagem({ texto: '✅ Ponto salvo offline com sucesso!', tipo: 'sucesso' });
      setFamiliaId('');
      setProvaId('');
      setNota('');
      
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch {
      setMensagem({ texto: '❌ Erro ao salvar no dispositivo.', tipo: 'erro' });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', padding: '30px', borderRadius: '15px', color: 'white', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.3)' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🏆</span> REGISTRO DE PONTOS
        </div>
        <h2 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>Lançar nota</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>Tudo é salvo no dispositivo. Funciona sem internet.</p>
      </div>

      {mensagem.texto && (
        <div style={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', backgroundColor: mensagem.tipo === 'erro' ? '#fee2e2' : '#dcfce7', color: mensagem.tipo === 'erro' ? '#991b1b' : '#166534' }}>
          {mensagem.texto}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>Família</label>
          <select 
            value={familiaId} 
            onChange={e => setFamiliaId(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', backgroundColor: '#fff' }}
          >
            <option value="">Selecione a família</option>
            {mockFamilias.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>Prova</label>
          <select 
            value={provaId} 
            onChange={e => setProvaId(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', backgroundColor: '#fff' }}
          >
            <option value="">Selecione a prova</option>
            {mockProvas.map(p => (
              <option key={p.id} value={p.id}>{p.nome} (Máx: {p.teto})</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>Nota</label>
          <input 
            type="number" 
            placeholder="0"
            value={nota}
            onChange={e => setNota(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', textAlign: 'center', backgroundColor: '#fff' }}
          />
        </div>

        <button 
          onClick={handleSalvar}
          style={{ width: '100%', padding: '18px', borderRadius: '8px', backgroundColor: '#fb923c', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' }}
        >
          💾 Salvar ponto
        </button>
      </div>
    </div>
  );
}