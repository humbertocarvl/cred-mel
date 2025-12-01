import React, { useState } from 'react';
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Consulta Rápida</h1>
      <QRCodeReader onScan={handleScan} />
      <div className="mt-2">Valor lido: <span className="font-mono">{qrValue}</span></div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {participant && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <div><strong>Nome:</strong> {participant.name}</div>
          <div><strong>Cidade:</strong> {participant.city}</div>
          <div><strong>Estado:</strong> {participant.state}</div>
          <div><strong>E-mail:</strong> {participant.email}</div>
          <div><strong>Telefone:</strong> {participant.whatsapp}</div>
          <div><strong>Contribuição:</strong> {participant.contribuicao ? 'Sim' : 'Não'}</div>
          <div><strong>Alojamento:</strong> {participant.alojamento ? 'Sim' : 'Não'}</div>
          <div><strong>Tipo de inscrição:</strong> {participant.tipoInscricao}</div>
          <div><strong>Credenciada:</strong> {participant.credenciada ? 'Sim' : 'Não'}</div>
          <div><strong>Credenciada em:</strong> {participant.credenciada_em ? new Date(participant.credenciada_em).toLocaleString() : '-'}</div>
          <div><strong>Credencial:</strong> {participant.credencial || '-'}</div>
        </div>
      )}
    </div>
  );
};

export default ConsultaRapida;
