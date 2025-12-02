import React, { useState } from 'react';
import api from '../services/api';
import QRCodeReader from '../components/QRCodeReader';
import MobileCard from '../components/MobileCard';
import MobileButton from '../components/MobileButton';
import ParticipantCardMobile from '../components/ParticipantCardMobile';

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
      // Verificar contribuição e registrar automaticamente se contribuiu
      if (p.contribuicao) {
        // Contribuiu: registrar automaticamente
        await api.post('/meals', {
          participantId: p.id,
          mealOptionId: mealOption.id,
          date: new Date().toISOString(),
        });
        setSuccess(`✓ Refeição registrada para ${p.name}`);
        setQrValue('');
        setParticipant(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Não contribuiu: pedir confirmação
        setShowConfirm(true);
        setError('⚠️ Participante não pagou a contribuição. Confirme a retirada.');
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
    <div className="container-mobile">
      <MobileCard>
        <h2 className="text-xl font-bold mb-4">Registrar retirada - {mealOption.name}</h2>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <QRCodeReader onScan={handleScan} />
        <div className="mt-2">Valor lido: <span className="font-mono">{qrValue}</span></div>
        {participant && (
          <div className="mt-4">
            <ParticipantCardMobile participant={participant} />
          </div>
        )}

        {showConfirm && (
          <div className="mt-4" style={{ display: 'flex', gap: 8 }}>
            <MobileButton onClick={registrarRefeicao} className="" full>Confirmar retirada</MobileButton>
            <MobileButton onClick={() => { setShowConfirm(false); setQrValue(''); setParticipant(null); }} className="" full>Cancelar</MobileButton>
          </div>
        )}

        <MobileButton onClick={onBack} className="mt-4">Voltar</MobileButton>
      </MobileCard>
    </div>
  );
};

export default RegistrarRefeicao;
