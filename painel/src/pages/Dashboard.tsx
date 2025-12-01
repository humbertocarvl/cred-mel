import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';

const Dashboard: React.FC = () => {
  const [totals, setTotals] = useState({
    inscritas: 0,
    credenciadas: 0,
    alojadas: 0,
    refeicoes: 0,
  });
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [participantsRes, mealsRes] = await Promise.all([
        api.get('/participants'),
        api.get('/meals')
      ]);
      const participants = participantsRes.data;
      const mealsData = mealsRes.data;
      setTotals({
        inscritas: participants.length,
        credenciadas: participants.filter((p: any) => p.credenciada).length,
        alojadas: participants.filter((p: any) => p.alojamento).length,
        refeicoes: mealsData.reduce((acc: number, m: any) => acc + (m.count || 0), 0)
      });
      setMeals(mealsData);
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
          <div className="table-wrapper">
            <table className="table-mel" style={{ minWidth: 420 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '1em', color: 'var(--mel-gold)', fontWeight: 'bold' }}>Carregando...</td></tr>
                ) : (
                  meals.map((m: any, idx: number) => (
                    <tr key={idx}>
                      <td>{m.date ? new Date(m.date).toLocaleDateString() : '-'}</td>
                      <td>{m.type || '-'}</td>
                      <td>{m.count || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
