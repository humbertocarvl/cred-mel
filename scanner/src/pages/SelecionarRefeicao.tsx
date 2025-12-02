import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MobileCard from '../components/MobileCard';
import MobileButton from '../components/MobileButton';

interface MealOption {
  id: number;
  name: string;
}

const SelecionarRefeicao: React.FC<{ onSelect: (option: MealOption) => void }> = ({ onSelect }) => {
  const [options, setOptions] = useState<MealOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    api.get('/meal-options').then(res => setOptions(res.data));
  }, []);

  function handleSelect() {
    const option = options.find(opt => opt.id === selected);
    if (option) onSelect(option);
  }

  return (
    <div className="container-mobile">
      <MobileCard>
        <h2 className="text-xl font-bold mb-4">Selecione a refeição</h2>
        <select value={selected ?? ''} onChange={e => setSelected(Number(e.target.value))} className="border p-2 rounded w-full mb-4">
          <option value="">-- Escolha --</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        <MobileButton onClick={handleSelect} disabled={!selected} full>Avançar</MobileButton>
      </MobileCard>
    </div>
  );
};

export default SelecionarRefeicao;
