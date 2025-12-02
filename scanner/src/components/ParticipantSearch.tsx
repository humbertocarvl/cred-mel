import React, { useState, useEffect, useRef } from 'react';

interface Participant {
  id: number;
  name: string;
  city: string;
  state: string;
  email: string;
  credenciada?: boolean;
}

interface ParticipantSearchProps {
  participants: Participant[];
  onSelect: (id: number) => void;
  selectedId: number | null;
  placeholder?: string;
}

const ParticipantSearch: React.FC<ParticipantSearchProps> = ({ 
  participants, 
  onSelect, 
  selectedId,
  placeholder = "Buscar participante..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredParticipants([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = participants
      .filter(p => 
        p.name.toLowerCase().includes(term) // Busca apenas pelo nome
      )
      .slice(0, 50); // Limitar a 50 resultados para performance

    setFilteredParticipants(filtered);
    setIsOpen(filtered.length > 0);
  }, [searchTerm, participants]);

  useEffect(() => {
    const selected = participants.find(p => p.id === selectedId);
    if (selected && !searchTerm) {
      setSearchTerm(`${selected.name} - ${selected.city}/${selected.state}`);
    }
  }, [selectedId, participants]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (participant: Participant) => {
    setSearchTerm(`${participant.name} - ${participant.city}/${participant.state}`);
    onSelect(participant.id);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length === 0) {
      onSelect(0); // Clear selection
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => filteredParticipants.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
        style={{ fontSize: '16px' }}
      />
      
      {isOpen && filteredParticipants.length > 0 && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 100
          }}
        >
          {filteredParticipants.map(p => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f7f7f7'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontWeight: 600, color: '#222', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '2px' }}>
                📍 {p.city} — {p.state}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>✉️ {p.email}</div>
            </div>
          ))}
        </div>
      )}

      {searchTerm.length > 0 && filteredParticipants.length === 0 && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '12px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginTop: '4px',
            color: '#666',
            fontSize: '0.875rem'
          }}
        >
          Nenhuma participante encontrada
        </div>
      )}
    </div>
  );
};

export default ParticipantSearch;
