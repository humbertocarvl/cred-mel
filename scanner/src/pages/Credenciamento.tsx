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
    setQrValue(value);
    setError('');
    setSuccess('');
    
    // Buscar se já existe alguém com este QR
    (async () => {
      try {
        const res = await api.get(`/participants?credencial=${encodeURIComponent(value)}`);
        const p = res.data && res.data[0];
        
        if (p && p.credenciada) {
          // QR já está associado a uma participante credenciada
          setError(`Este QR já está associado a ${p.name} (${p.city}/${p.state})`);
          setSelectedId(null);
          setTimeout(() => setError(''), 5000);
        } else if (!p) {
          // QR livre - permitir associação manual
          setSuccess('QR code livre! Selecione a participante e clique em Credenciar.');
          setTimeout(() => setSuccess(''), 5000);
        }
      } catch (err) {
        console.error('Erro ao buscar participante:', err);
      }
    })();
  }

  async function handleCredenciar() {
    if (!selectedId || !qrValue) {
      setError('Selecione uma participante e escaneie a pulseira.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // Verificar novamente se o QR não foi associado enquanto selecionava
      const checkRes = await api.get(`/participants?credencial=${encodeURIComponent(qrValue)}`);
      const existing = checkRes.data && checkRes.data[0];
      
      if (existing && existing.credenciada && existing.id !== selectedId) {
        setError(`Este QR já foi associado a ${existing.name} por outra pessoa.`);
        setIsSubmitting(false);
        return;
      }
      
      await api.put(`/participants/${selectedId}`, {
        credenciada: true,
        credenciada_em: new Date().toISOString(),
        credencial: qrValue,
      });
      
      const participantName = participants.find(p => p.id === selectedId)?.name || 'Participante';
      setSuccess(`✓ ${participantName} credenciado(a) com sucesso!`);
      
      // Remover da lista de não credenciadas
      setParticipants(prev => prev.filter(x => x.id !== selectedId));
      setSelectedId(null);
      setQrValue('');
      
      setTimeout(() => {
        setSuccess('');
        setIsSubmitting(false);
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao credenciar participante.');
      setIsSubmitting(false);
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
                  <MobileButton 
                    onClick={handleCredenciar} 
                    disabled={!qrValue || isSubmitting}
                    style={{ marginTop: 12, width: '100%' }}
                  >
                    {isSubmitting ? 'Credenciando...' : 'Credenciar'}
                  </MobileButton>
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
