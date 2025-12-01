import React, { useEffect, useState } from 'react';
import api from '../services/api';

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Selecione a refeição</h2>
      <select value={selected ?? ''} onChange={e => setSelected(Number(e.target.value))} className="border p-2 rounded w-full mb-4">
        <option value="">-- Escolha --</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSelect} disabled={!selected}>Avançar</button>
    </div>
  );
};

export default SelecionarRefeicao;
