import React, { useEffect, useState } from 'react';
import api from '../services/api';
import QRCodeReader from '../components/QRCodeReader';
import MobileCard from '../components/MobileCard';
import ParticipantCardMobile from '../components/ParticipantCardMobile';
import MobileButton from '../components/MobileButton';
import ParticipantSearch from '../components/ParticipantSearch';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get('/participants').then(res => {
      const naoCredenciadas = res.data.filter((p: Participant) => !p.credenciada);
      setParticipants(naoCredenciadas);
    });
  }, [success]);

  function handleScan(value: string) {
    // set raw value and try to resolve participant by credencial
    setQrValue(value);
    setError('');
    setSuccess('');
    (async () => {
      try {
        const res = await api.get(`/participants?credencial=${encodeURIComponent(value)}`);
        const p = res.data && res.data[0];
        if (!p) {
          setError('Nenhum participante encontrado para este código.');
          return;
        }
        // auto-select found participant and ensure it's visible in the list
        setSelectedId(p.id);
        setParticipants(prev => {
          const exists = prev.find(x => x.id === p.id);
          if (exists) return prev;
          return [p, ...prev];
        });
        setSuccess(`${p.name} identificado(a)`);
        setTimeout(() => setSuccess(''), 2000);

        // Auto-submit (opção escolhida): se participante ainda não estiver credenciado
        if (!p.credenciada && !isSubmitting) {
          setIsSubmitting(true);
          try {
            await api.put(`/participants/${p.id}`, {
              credenciada: true,
              credenciada_em: new Date().toISOString(),
              credencial: value,
            });
            setSuccess(`✓ ${p.name} credenciado(a) com sucesso!`);
            // remove from list of not-yet-credentialed
            setParticipants(prev => prev.filter(x => x.id !== p.id));
            setSelectedId(null);
            setQrValue('');
            setTimeout(() => setSuccess(''), 3000);
          } catch (err) {
            setError('Erro ao credenciar participante automaticamente.');
          } finally {
            // delay to avoid duplicates from rapid scans (matches QR cooldown)
            setTimeout(() => setIsSubmitting(false), 3000);
          }
        } else if (p.credenciada) {
          setError('Participante já está credenciado(a).');
          setTimeout(() => setError(''), 3000);
        }
      } catch (err) {
        setError('Erro ao buscar participante pelo código.');
      }
    })();
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
    <div className="container-mobile">
      <MobileCard>
        <h1 className="text-2xl font-bold mb-4">Credenciamento</h1>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <div className="mobile-app">
          <div className="camera-area">
            <QRCodeReader onScan={handleScan} />
            <div className="mt-2 text-sm text-gray-700">Valor lido: <span className="font-mono">{qrValue || '-'}</span></div>
          </div>

          <div className="participant-action">
            <label className="block mb-2 font-semibold">Buscar e selecionar participante</label>
            <ParticipantSearch 
              participants={participants}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              placeholder="Digite o nome da participante..."
            />
            
            {selectedId && (() => {
              const p = participants.find(x => x.id === selectedId);
              return p ? (
                <div style={{ marginTop: 12 }}>
                  <ParticipantCardMobile participant={p} />
                </div>
              ) : null;
            })()}
          </div>

        </div>
      </MobileCard>
    </div>
  );
};

export default Credenciamento;
