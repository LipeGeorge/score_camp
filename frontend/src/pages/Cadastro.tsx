import { useState, useEffect } from 'react';
import api from '../services/api';

interface Participante {
  id: number;
  nome: string;
  rg: string;
  familia_id: number | null;
  check_in: boolean;
}

interface Familia {
  id: number;
  nome: string;
  cor: string;
}

export default function Cadastro() {

  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [familias, setFamilias] = useState<Familia[]>([]);


  const [abaAtiva, setAbaAtiva] = useState<'inscritos' | 'provas' | 'familias'>('inscritos');
  
  const [nomeProva, setNomeProva] = useState('');
  const [pontuacao, setPontuacao] = useState('');
  const [mensagemProva, setMensagemProva] = useState('');

  const [nomeFamilia, setNomeFamilia] = useState('');
  const [corFamilia, setCorFamilia] = useState('#ea580c'); // Laranja como padrão
  const [mensagemFamilia, setMensagemFamilia] = useState('');

  const carregarDados = async () => {
    try {
      const headersSeguranca = { headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' } };
      
      const [resInscritos, resFamilias] = await Promise.all([
        api.get('/inscritos/', headersSeguranca),
        api.get('/familia/', headersSeguranca)
      ]);

      const inscritosLista = Array.isArray(resInscritos.data.inscritos) ? resInscritos.data.inscritos : [];
      const familiasLista = Array.isArray(resFamilias.data) ? resFamilias.data : [];

      setParticipantes(inscritosLista);
      setFamilias(familiasLista);
      
    } catch (err: unknown) {
      console.error("❌ Erro ao carregar dados da API:", err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCheckIn = async (id: number) => {
    try {
      const response = await api.patch(`/inscritos/checkin/${id}`, {}, {
        headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
      });
      
      if (response.status === 200) {
        alert('✅ Check-in realizado! (Se estava sem equipe, o sistema escolheu uma aleatoriamente)');
        carregarDados(); 
      }
    } catch (error: unknown) {
      console.error(error);
      alert('Erro ao realizar check-in.');
    }
  };

  const handleImportar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      try {
        await api.post('/inscritos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
            'X_API_KEY_BACKEND': 'ScoreCampV1Show' 
          }
        });
        
        alert('🎉 Inscritos importados com sucesso!');
        carregarDados();
      } catch (error: unknown) {
        console.error("Erro na importação:", error);
        alert('❌ Erro ao importar. Certifique-se de que a planilha tem as colunas "nome" e "rg".');
      }
    }
  };

  const handleSubmitProva = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/provas/cadastrar', { nome: nomeProva, teto: Number(pontuacao) }, {
        headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
      });
      
      setMensagemProva('🏆 Prova cadastrada com sucesso!');
      setNomeProva(''); 
      setPontuacao('');
      setTimeout(() => setMensagemProva(''), 3000);
    } catch (error: unknown) {
      console.error(error);
      setMensagemProva('❌ Erro ao cadastrar a prova. Verifique os dados ou a conexão.');
    }
  };

  const handleSubmitFamilia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      await api.post('/familia/cadastrar', { nome: nomeFamilia, cor: corFamilia }, {
        headers: { 'X_API_KEY_BACKEND': 'ScoreCampV1Show' }
      });
      
      setMensagemFamilia('⛺ Família cadastrada com sucesso!');
      setNomeFamilia(''); 
      setCorFamilia('#ea580c');
      
      carregarDados(); 
      setTimeout(() => setMensagemFamilia(''), 3000);
    } catch (error: unknown) {
      console.error(error);
      setMensagemFamilia('❌ Erro ao cadastrar a família. Verifique a conexão.');
    }
  };

  const presentes = Array.isArray(participantes) ? participantes.filter(p => p.check_in).length : 0;
  const total = Array.isArray(participantes) ? participantes.length : 0;

  return (
    <div>
      {/* --- MENU DE ABAS --- */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <button 
          onClick={() => setAbaAtiva('inscritos')}
          style={{ 
            backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer',
            color: abaAtiva === 'inscritos' ? '#ea580c' : '#666',
            fontWeight: abaAtiva === 'inscritos' ? 'bold' : 'normal',
          }}
        >
          📋 Recepção
        </button>
        
        <button 
          onClick={() => setAbaAtiva('provas')}
          style={{ 
            backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer',
            color: abaAtiva === 'provas' ? '#ea580c' : '#666',
            fontWeight: abaAtiva === 'provas' ? 'bold' : 'normal',
          }}
        >
          🏆 Provas
        </button>

        <button 
          onClick={() => setAbaAtiva('familias')}
          style={{ 
            backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer',
            color: abaAtiva === 'familias' ? '#ea580c' : '#666',
            fontWeight: abaAtiva === 'familias' ? 'bold' : 'normal',
          }}
        >
          ⛺ Famílias
        </button>
      </div>

      {/* --- ABA 1: INSCRITOS --- */}
      {abaAtiva === 'inscritos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                {presentes} de {total} jovens presentes • {familias.length} famílias ativas
              </p>
            </div>
            
            <input type="file" accept=".csv,.xlsx,.xls" id="importar" hidden onChange={handleImportar} />
            <label htmlFor="importar" style={{ backgroundColor: '#ea580c', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>↑ Importar Planilha</label>
          </div>

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
                  const familiaDoJovem = familias.find(f => f.id === p.familia_id);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.nome}</td>
                      <td style={{ padding: '15px' }}>
                        {p.check_in ? (
                          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>✓ Presente</span>
                        ) : (
                          <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⏱ Aguardando</span>
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {familiaDoJovem ? (
                          <span style={{ backgroundColor: familiaDoJovem.cor, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textShadow: '0px 1px 2px rgba(0,0,0,0.4)' }}>
                            {familiaDoJovem.nome}
                          </span>
                        ) : <span style={{ color: '#999' }}>—</span>}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {!p.check_in && (
                          <button onClick={() => handleCheckIn(p.id)} style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            Fazer Check-In
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
      )}

      {/* --- ABA 2: PROVAS --- */}
      {abaAtiva === 'provas' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '25px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Configurar Nova Prova</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Defina o nome da gincana e o valor máximo de pontos.
          </p>

          <form onSubmit={handleSubmitProva} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#444' }}>Nome da Prova:</label>
              <input 
                type="text" value={nomeProva} onChange={(e) => setNomeProva(e.target.value)} required 
                placeholder="Ex: Torta na Cara..."
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#444' }}>Pontuação Máxima:</label>
              <input 
                type="number" value={pontuacao} onChange={(e) => setPontuacao(e.target.value)} required min="1"
                placeholder="Ex: 100"
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }}
              />
            </div>

            <button type="submit" style={{ backgroundColor: '#ea580c', color: 'white', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '16px', marginTop: '10px' }}>
              Salvar Prova
            </button>
          </form>
          
          {mensagemProva && (
             <div style={{ marginTop: '20px', padding: '15px', borderRadius: '6px', fontWeight: 'bold', backgroundColor: mensagemProva.includes('❌') ? '#fee2e2' : '#dcfce7', color: mensagemProva.includes('❌') ? '#991b1b' : '#166534' }}>
               {mensagemProva}
             </div>
           )}
        </div>
      )}

      {/* --- ABA 3: FAMÍLIAS (NOVO) --- */}
      {abaAtiva === 'familias' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Formulário de Cadastro */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Cadastrar Família</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Crie as equipes do acampamento e defina uma cor para elas.
            </p>

            <form onSubmit={handleSubmitFamilia} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#444' }}>Nome da Equipe:</label>
                <input 
                  type="text" value={nomeFamilia} onChange={(e) => setNomeFamilia(e.target.value)} required 
                  placeholder="Ex: Tribo de Judá..."
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#444' }}>Cor da Equipe:</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="color" value={corFamilia} onChange={(e) => setCorFamilia(e.target.value)} required 
                    style={{ width: '50px', height: '50px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                  />
                  <span style={{ color: '#666', fontSize: '14px', fontFamily: 'monospace' }}>{corFamilia.toUpperCase()}</span>
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: '#ea580c', color: 'white', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '16px', marginTop: '10px' }}>
                Salvar Família
              </button>
            </form>
            
            {mensagemFamilia && (
              <div style={{ marginTop: '20px', padding: '15px', borderRadius: '6px', fontWeight: 'bold', backgroundColor: mensagemFamilia.includes('❌') ? '#fee2e2' : '#dcfce7', color: mensagemFamilia.includes('❌') ? '#991b1b' : '#166534' }}>
                {mensagemFamilia}
              </div>
            )}
          </div>

          {/* Listagem de Famílias */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '25px' }}>
             <h3 style={{ marginTop: 0, color: '#333' }}>Famílias Cadastradas ({familias.length})</h3>
             
             {familias.length === 0 ? (
               <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhuma família cadastrada ainda.</p>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                 {familias.map(familia => (
                   <div key={familia.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                     <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: familia.cor, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                     <div style={{ fontWeight: 'bold', color: '#374151', fontSize: '16px' }}>{familia.nome}</div>
                   </div>
                 ))}
               </div>
             )}
          </div>
          
        </div>
      )}
    </div>
  );
}