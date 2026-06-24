
import { useState, useEffect } from 'react';
import { salvarPontuacaoOffline } from '../services/db';
import api from '../services/api';

interface Familia {
  id: number;
  nome: string;
}

interface Prova {
  id: number;
  nome: string;
  teto: number;
}

export default function Pontuacao() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);


  const [familiaId, setFamiliaId] = useState('');
  const [provaId, setProvaId] = useState('');
  const [nota, setNota] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const resFamilias = await api.get('/familia/');
        console.log("✅ Famílias recebidas da nuvem:", resFamilias.data);
        setFamilias(resFamilias.data);
      } catch (erro) {
        console.error("❌ Erro ao buscar famílias:", erro);
      }

      try {
        const resProvas = await api.get('/provas/listar');
        console.log("✅ Provas recebidas da nuvem:", resProvas.data);
        setProvas(resProvas.data);
      } catch (erro) {
        console.error("❌ Erro ao buscar provas:", erro);
      }
    };
    
    carregarOpcoes();
  }, []);

  const handleSalvar = async () => {
    if (!familiaId || !provaId || !nota) {
      setMensagem({ texto: '⚠️ Preencha todos os campos.', tipo: 'erro' });
      return;
    }

    const notaNumerica = Number(nota);
    
    const provaSelecionada = provas.find(p => p.id === Number(provaId));

    if (provaSelecionada && notaNumerica > provaSelecionada.teto) {
      setMensagem({ 
        texto: `❌ A nota máxima para ${provaSelecionada.nome} é ${provaSelecionada.teto}.`, 
        tipo: 'erro' 
      });
      return;
    }

    const novaPontuacao = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
      familiaId: familiaId, // Mantido como string para não quebrar a tipagem do banco local
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
            {familias.map(f => (
              <option key={f.id} value={f.id.toString()}>{f.nome}</option>
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
            {provas.map(p => (
              <option key={p.id} value={p.id.toString()}>{p.nome} (Máx: {p.teto})</option>
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