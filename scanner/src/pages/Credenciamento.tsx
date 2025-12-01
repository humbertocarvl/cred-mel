import React, { useEffect, useState } from 'react';
import api from '../services/api';
import QRCodeReader from '../components/QRCodeReader';

interface Participant {
  id: number;
  name: string;
  city: string;
  state: string;
  email: string;
  whatsapp: string;
  contribuicao: boolean;
  alojamento: boolean;
  tipoInscricao: string;
  credenciada: boolean;
}

const Credenciamento: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qrValue, setQrValue] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/participants').then(res => {
      const naoCredenciadas = res.data.filter((p: Participant) => !p.credenciada);
      setParticipants(naoCredenciadas);
    });
  }, [success]);

  function handleScan(value: string) {
    setQrValue(value);
  }

  async function handleCredenciar() {
    if (!selectedId || !qrValue) {
      setError('Selecione uma participante e escaneie a pulseira.');
      return;
    }
    setError('');
    try {
      await api.put(`/participants/${selectedId}`, {
        credenciada: true,
        credenciada_em: new Date().toISOString(),
        credencial: qrValue,
      });
      setSuccess('Credenciamento realizado com sucesso!');
      setSelectedId(null);
      setQrValue('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao credenciar participante.');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Credenciamento</h1>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <QRCodeReader onScan={handleScan} />
        <div className="mt-2">Valor lido: <span className="font-mono">{qrValue}</span></div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Selecione uma participante:</label>
        <select value={selectedId ?? ''} onChange={e => setSelectedId(Number(e.target.value))} className="border p-2 rounded w-full">
          <option value="">-- Escolha --</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>{p.name} - {p.city}/{p.state}</option>
          ))}
        </select>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCredenciar}>Credenciar</button>
    </div>
  );
};

export default Credenciamento;
