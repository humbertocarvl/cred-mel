import React from 'react';

interface ParticipantProps {
  id?: number;
  name?: string;
  city?: string;
  state?: string;
  email?: string;
  whatsapp?: string;
  credencial?: string;
}

const ParticipantCardMobile: React.FC<{ participant?: ParticipantProps }> = ({ participant }) => {
  if (!participant) return <div className="participant-card-mobile">Nenhum participante</div>;
  return (
    <div className="participant-card-mobile">
      <div className="name">{participant.name}</div>
      <div className="meta">{participant.city} — {participant.state}</div>
      <div className="small">{participant.email || ''} • {participant.whatsapp || ''}</div>
      <div className="cred">Credencial: <span className="font-mono">{participant.credencial || '-'}</span></div>
    </div>
  );
};

export default ParticipantCardMobile;
