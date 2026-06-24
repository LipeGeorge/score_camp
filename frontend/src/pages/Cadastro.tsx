// src/pages/Cadastro.tsx
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

  // Carrega os dados reais da API, acessando a chave 'inscritos' corretamente
  const carregarDados = async () => {
    try {
      const [resInscritos, resFamilias] = await Promise.all([
        api.get('/inscritos/'),
        api.get('/familia/')
      ]);

      // A API devolve { "inscritos": [...] }, logo acessamos .data.inscritos
      const inscritosLista = Array.isArray(resInscritos.data.inscritos) ? resInscritos.data.inscritos : [];
      const familiasLista = Array.isArray(resFamilias.data) ? resFamilias.data : [];

      setParticipantes(inscritosLista);
      setFamilias(familiasLista);
      
      console.log("✅ Dados carregados com sucesso:", inscritosLista);
    } catch (err: unknown) {
      console.error("❌ Erro ao carregar dados da API:", err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCheckIn = async (id: number) => {
    try {
      const response = await api.patch(`/inscritos/checkin/${id}`);
      if (response.status === 200) {
        alert('✅ Check-in realizado!');
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
        await api.post('/inscritos/upload', formData);
        alert('🎉 Inscritos importados!');
        carregarDados();
      } catch (error: unknown) {
        console.error(error);
        alert('Erro ao importar arquivo.');
      }
    }
  };

  const presentes = Array.isArray(participantes) ? participantes.filter(p => p.check_in).length : 0;
  const total = Array.isArray(participantes) ? participantes.length : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '28px', margin: '0 0 5px 0' }}>Recepção e Check-in</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            {presentes} de {total} jovens presentes • {familias.length} famílias ativas
          </p>
        </div>
        <input type="file" accept=".csv,.xlsx" id="importar" hidden onChange={handleImportar} />
        <label htmlFor="importar" style={{ backgroundColor: '#ea580c', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>↑ Importar Inscritos</label>
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
                      <span style={{ backgroundColor: familiaDoJovem.cor, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
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
  );
}