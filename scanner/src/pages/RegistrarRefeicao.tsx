import React, { useState } from 'react';
import api from '../services/api';
import QRCodeReader from '../components/QRCodeReader';

interface MealOption {
  id: number;
  name: string;
}
interface Participant {
  id: number;
  name: string;
  contribuicao: boolean;
}

const RegistrarRefeicao: React.FC<{ mealOption: MealOption; onBack: () => void }> = ({ mealOption, onBack }) => {
  const [qrValue, setQrValue] = useState('');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleScan(value: string) {
    setQrValue(value);
    setSuccess('');
    setError('');
    setShowConfirm(false);
    // Buscar participante pelo valor do QR code
    try {
      const res = await api.get(`/participants?credencial=${value}`);
      const p = res.data[0];
      if (!p) {
        setError('Participante não encontrada.');
        setParticipant(null);
        return;
      }
      setParticipant(p);
      // Verificar se já retirou a refeição
      const mealRes = await api.get(`/meals?participantId=${p.id}&mealOptionId=${mealOption.id}`);
      if (mealRes.data.length > 0) {
        setError('Esta participante já retirou esta refeição.');
        return;
      }
      // Verificar contribuição
      if (!p.contribuicao) {
        setShowConfirm(true);
        setError('Participante não pagou a contribuição. Confirme a retirada.');
      }
    } catch {
      setError('Erro ao buscar participante.');
      setParticipant(null);
    }
  }

  async function registrarRefeicao() {
    if (!participant) return;
    try {
      await api.post('/meals', {
        participantId: participant.id,
        mealOptionId: mealOption.id,
        date: new Date().toISOString(),
      });
      setSuccess('Retirada registrada com sucesso!');
      setQrValue('');
      setParticipant(null);
      setShowConfirm(false);
      setError('');
    } catch {
      setError('Erro ao registrar retirada.');
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registrar retirada - {mealOption.name}</h2>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <QRCodeReader onScan={handleScan} />
      <div className="mt-2">Valor lido: <span className="font-mono">{qrValue}</span></div>
      {participant && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <div><strong>Nome:</strong> {participant.name}</div>
          <div><strong>Contribuição:</strong> {participant.contribuicao ? 'Sim' : 'Não'}</div>
        </div>
      )}
      {showConfirm && (
        <div className="mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded mr-2" onClick={registrarRefeicao}>Confirmar retirada</button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setShowConfirm(false); setQrValue(''); setParticipant(null); }}>Cancelar</button>
        </div>
      )}
      <button className="mt-6 bg-gray-600 text-white px-4 py-2 rounded" onClick={onBack}>Voltar</button>
    </div>
  );
};

export default RegistrarRefeicao;
