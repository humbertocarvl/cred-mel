import React, { useState } from 'react';
import SelecionarRefeicao from './SelecionarRefeicao';
import RegistrarRefeicao from './RegistrarRefeicao';

const Refeicoes: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  if (!selectedMeal) {
    return <SelecionarRefeicao onSelect={setSelectedMeal} />;
  }

  return <RegistrarRefeicao mealOption={selectedMeal} onBack={() => setSelectedMeal(null)} />;
};

export default Refeicoes;
