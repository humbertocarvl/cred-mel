import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';

interface MealDetail {
  mealOptionId: number;
  mealOptionName: string;
  count: number;
  participants: Array<{ id: number; name: string; email: string }>;
}

const Dashboard: React.FC = () => {
  const [totals, setTotals] = useState({
    inscritas: 0,
    credenciadas: 0,
    alojadas: 0,
  });
  const [mealDetails, setMealDetails] = useState<MealDetail[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        console.log('Carregando dados do dashboard...');
        console.log('API URL:', import.meta.env.VITE_API_URL);
        const [participantsRes, mealsRes, mealOptionsRes] = await Promise.all([
          api.get('/participants'),
          api.get('/meals'),
          api.get('/meal-options')
        ]);
        console.log('Resposta completa de meals:', JSON.stringify(mealsRes.data, null, 2));
        const participants = participantsRes.data;
        const meals = mealsRes.data;
        const mealOptions = mealOptionsRes.data;

        console.log('Participantes:', participants.length);
        console.log('Meals:', meals.length);
        console.log('Meal Options:', mealOptions.length);
        console.log('Meals data:', meals);
        console.log('MealOptions data:', mealOptions);

        setTotals({
          inscritas: participants.length,
          credenciadas: participants.filter((p: any) => p.credenciada).length,
          alojadas: participants.filter((p: any) => p.credenciada && p.alojamento).length
        });

        // Verificar se meals tem estrutura antiga (type, count) ou nova (mealOptionId, participantId)
        const isOldStructure = meals.length > 0 && meals[0].type !== undefined;
        console.log('Estrutura antiga detectada:', isOldStructure);

        let details: MealDetail[] = [];

        if (isOldStructure) {
          // Estrutura antiga: {type, count, date}
          details = meals.map((meal: any) => ({
            mealOptionId: 0, // Não tem ID na estrutura antiga
            mealOptionName: meal.type,
            count: meal.count,
            participants: [] // Não tem lista de participantes na estrutura antiga
          }));
        } else {
          // Estrutura nova: processar normalmente
          const mealMap = new Map<number, { name: string; participants: Array<{ id: number; name: string; email: string }> }>();
          
          console.log('Iniciando processamento de meals...');
          for (const meal of meals) {
            console.log('Processando meal:', meal);
            const option = mealOptions.find((o: any) => o.id === meal.mealOptionId);
            console.log('Option encontrada:', option);
            if (!option) continue;
          
          if (!mealMap.has(meal.mealOptionId)) {
            mealMap.set(meal.mealOptionId, { name: option.name, participants: [] });
          }
          
          const participant = participants.find((p: any) => p.id === meal.participantId);
          if (participant) {
            mealMap.get(meal.mealOptionId)!.participants.push({
              id: participant.id,
              name: participant.name,
              email: participant.email
            });
          }
        }

        details = Array.from(mealMap.entries()).map(([id, data]) => ({
          mealOptionId: id,
          mealOptionName: data.name,
          count: data.participants.length,
          participants: data.participants
        }));
      }

        console.log('MealDetails final:', details);
        setMealDetails(details);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-mel" style={{ background: 'var(--mel-gray)', minHeight: '100vh', padding: '1em 0' }}>
      <div className="container">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="metrics-grid">
          <MetricCard title="Inscritas" value={loading ? '...' : totals.inscritas} />
          <MetricCard title="Credenciadas" value={loading ? '...' : totals.credenciadas} />
          <MetricCard title="Alojadas" value={loading ? '...' : totals.alojadas} />
        </div>

        <Card>
          <h2 className="card-heading">Detalhamento de refeições</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '1em', color: 'var(--mel-gold)', fontWeight: 'bold' }}>Carregando...</div>
          ) : mealDetails.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1em', color: 'var(--mel-black)' }}>Nenhuma refeição registrada</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mealDetails.map((meal) => (
                <div key={meal.mealOptionId} style={{ 
                  border: '1px solid var(--mel-gold)', 
                  borderRadius: 'var(--mel-border-radius)', 
                  padding: '1rem',
                  background: 'var(--mel-white)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--mel-font-title)', color: 'var(--mel-gold)', margin: 0 }}>
                      {meal.mealOptionName}
                    </h3>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--mel-black)' }}>
                      {meal.count} retiradas
                    </span>
                  </div>
                  <button 
                    className="button" 
                    style={{ background: expandedMeal === meal.mealOptionId ? 'var(--mel-gray)' : 'var(--mel-yellow)', padding: '0.5em 1em', fontSize: '0.9em' }}
                    onClick={() => setExpandedMeal(expandedMeal === meal.mealOptionId ? null : meal.mealOptionId)}
                    disabled={meal.participants.length === 0}
                  >
                    {expandedMeal === meal.mealOptionId ? 'Ocultar participantes' : 'Ver participantes'}
                  </button>
                  {meal.participants.length === 0 && (
                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5em' }}>Lista de participantes não disponível (estrutura antiga)</p>
                  )}
                  {expandedMeal === meal.mealOptionId && meal.participants.length > 0 && (
                    <div style={{ marginTop: '1rem', maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', padding: '0.5rem' }}>
                      {meal.participants.map((p) => (
                        <div key={p.id} style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: '0.9em', color: '#666' }}>{p.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
