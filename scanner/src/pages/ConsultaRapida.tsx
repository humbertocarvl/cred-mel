import React, { useState } from 'react';
import api from '../services/api';
import QRCodeReader from '../components/QRCodeReader';
import MobileCard from '../components/MobileCard';
import ParticipantCardMobile from '../components/ParticipantCardMobile';

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
  credenciada_em?: string;
  credencial?: string;
}

const ConsultaRapida: React.FC = () => {
  const [qrValue, setQrValue] = useState('');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState('');

  async function handleScan(value: string) {
    setQrValue(value);
    setError('');
    setParticipant(null);
    try {
      const res = await api.get(`/participants?credencial=${value}`);
      const p = res.data[0];
      if (!p) {
        setError('Participante não encontrada.');
        return;
      }
      setParticipant(p);
    } catch {
      setError('Erro ao buscar participante.');
    }
  }

  return (
    <div className="container-mobile">
      <MobileCard>
        <h1 className="text-2xl font-bold mb-4">Consulta Rápida</h1>
        <QRCodeReader onScan={handleScan} />
        <div className="mt-2">Valor lido: <span className="font-mono">{qrValue}</span></div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {participant && (
          <div className="mt-4">
            <ParticipantCardMobile participant={participant} />
            <div style={{ marginTop: 8 }}>
              <div><strong>Tipo inscrição:</strong> {participant.tipoInscricao}</div>
              <div><strong>Credenciada:</strong> {participant.credenciada ? 'Sim' : 'Não'}</div>
              <div><strong>Credenciada em:</strong> {participant.credenciada_em ? new Date(participant.credenciada_em).toLocaleString() : '-'}</div>
              <div><strong>Alojada:</strong> {participant.alojamento ? '✓ Sim' : '✗ Não'}</div>
              <div><strong>Contribuiu:</strong> {participant.contribuicao ? '✓ Sim' : '✗ Não'}</div>
            </div>
          </div>
        )}
      </MobileCard>
    </div>
  );
};

export default ConsultaRapida;
