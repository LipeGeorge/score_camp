
import { useState, useEffect } from 'react';
import api from "../services/api";

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

  const carregarDados = async () => {
    try {
      const [resInscritos, resFamilias] = await Promise.all([
        api.get('/inscritos/'),
        api.get('/familia/')
      ]);
      setParticipantes(resInscritos.data);
      setFamilias(resFamilias.data);
    } catch (err) {
      console.error("Erro ao carregar dados do servidor:", err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCheckIn = async (id: number) => {
    try {
      const response = await api.patch(`/inscritos/checkin/${id}`);
      if (response.status === 200) {
        alert('✅ Check-in realizado com sucesso!');
        carregarDados(); 
      }
    } catch (error) {
      console.error("Erro no check-in:", error);
      alert('Erro ao realizar check-in. Tente novamente.');
    }
  };

  const handleImportar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      try {
        await api.post('/inscritos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('🎉 Inscritos importados com sucesso!');
        carregarDados(); 
      } catch (error) {
        console.error("Erro no upload:", error);
        alert('Erro ao importar arquivo. Verifique o console.');
      }
    }
  };

  const presentes = participantes.filter(p => p.check_in).length;
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
        <input type="file" accept=".csv,.xlsx" id="importar" hidden onChange={handleImportar} />
        <label htmlFor="importar" style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          ↑ Importar Inscritos
        </label>
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
                      <span style={{ backgroundColor: familiaDoJovem.cor, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {familiaDoJovem.nome}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                  
                  <td style={{ padding: '15px' }}>
                    {!p.check_in ? (
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