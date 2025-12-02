import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../services/api';
import Card from '../components/Card';

interface MealOption {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
}

interface Meal {
  id: number;
  participantId: number;
  mealOptionId: number;
  date: string;
}

interface Participant {
  id: number;
  name: string;
  email: string;
  city: string;
  state: string;
}

const MealOptions: React.FC = () => {
  const [options, setOptions] = useState<MealOption[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<MealOption | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [mealParticipants, setMealParticipants] = useState<{ [key: number]: Participant[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/meal-options').then(res => {
      setOptions(res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error('Erro ao carregar refeições:', err);
      setLoading(false);
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      api.put(`/meal-options/${editing.id}`, { name, description }).then(res => {
        setOptions(options.map(opt => opt.id === editing.id ? res.data : opt));
        setEditing(null);
        setName('');
        setDescription('');
      });
    } else {
      api.post('/meal-options', { name, description }).then(res => {
        setOptions([...options, res.data]);
        setName('');
        setDescription('');
      });
    }
  }

  function handleEdit(opt: MealOption) {
    setEditing(opt);
    setName(opt.name);
    setDescription(opt.description || '');
  }

  function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta refeição?')) return;
    api.delete(`/meal-options/${id}`).then(() => {
      setOptions(options.filter(opt => opt.id !== id));
    }).catch(err => {
      console.error('Erro ao excluir refeição:', err);
      alert('Erro ao excluir refeição');
    });
  }

  async function loadMealParticipants(mealOptionId: number) {
    if (mealParticipants[mealOptionId]) return; // Já carregado
    
    try {
      const [mealsRes, participantsRes] = await Promise.all([
        api.get('/meals'),
        api.get('/participants')
      ]);
      
      const meals: Meal[] = mealsRes.data.filter((m: Meal) => m.mealOptionId === mealOptionId);
      const allParticipants: Participant[] = participantsRes.data;
      
      const participants = meals.map(meal => {
        const p = allParticipants.find(participant => participant.id === meal.participantId);
        return p || null;
      }).filter(p => p !== null) as Participant[];
      
      setMealParticipants(prev => ({ ...prev, [mealOptionId]: participants }));
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    }
  }

  function handleExpandMeal(mealOptionId: number) {
    if (expandedMeal === mealOptionId) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealOptionId);
      loadMealParticipants(mealOptionId);
    }
  }

  async function exportMealXLSX(mealOption: MealOption) {
    await loadMealParticipants(mealOption.id);
    const participants = mealParticipants[mealOption.id] || [];
    
    const data = participants.map(p => ({
      'Nome': p.name,
      'E-mail': p.email,
      'Cidade': p.city,
      'Estado': p.state
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, mealOption.name.substring(0, 30));
    XLSX.writeFile(wb, `${mealOption.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  }

  return (
    <div className="dashboard-mel" style={{ background: 'var(--mel-gray)', minHeight: '100vh', padding: '1em 0' }}>
      <div className="container">
        <h1 className="page-title">Refeições cadastradas</h1>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da refeição" style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }} required />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição (opcional)" style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }} />
            <button type="submit" className="button">{editing ? 'Salvar' : 'Cadastrar'}</button>
            {editing && <button type="button" className="button" style={{ background: 'var(--mel-gray)', marginLeft: '0.5rem' }} onClick={() => { setEditing(null); setName(''); setDescription(''); }}>Cancelar</button>}
          </form>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mel-gold)', fontWeight: 'bold' }}>
                Carregando refeições...
              </div>
            ) : options.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mel-black)' }}>
                Nenhuma refeição cadastrada. Use o formulário acima para adicionar.
              </div>
            ) : (
              <table className="table-mel">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {options.map(opt => (
                  <React.Fragment key={opt.id}>
                    <tr>
                      <td>{opt.name}</td>
                      <td>{opt.description}</td>
                      <td>
                        <button className="button" style={{ background: 'var(--mel-gold)', marginRight: '0.5rem' }} onClick={() => handleEdit(opt)}>Editar</button>
                        <button className="button" style={{ background: 'var(--mel-yellow)', marginRight: '0.5rem' }} onClick={() => handleDelete(opt.id)}>
                          Excluir
                        </button>
                        <button className="button" style={{ background: 'var(--mel-gold)', marginRight: '0.5rem' }} onClick={() => handleExpandMeal(opt.id)}>
                          {expandedMeal === opt.id ? 'Ocultar' : 'Ver'} Participantes
                        </button>
                        <button className="button" style={{ background: 'var(--mel-yellow)' }} onClick={() => exportMealXLSX(opt)}>
                          Exportar XLSX
                        </button>
                      </td>
                    </tr>
                    {expandedMeal === opt.id && (
                      <tr>
                        <td colSpan={3} style={{ background: '#f9f9f9', padding: '1rem' }}>
                          {mealParticipants[opt.id] ? (
                            mealParticipants[opt.id].length > 0 ? (
                              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <strong>Participantes ({mealParticipants[opt.id].length}):</strong>
                                <div style={{ marginTop: '0.5rem' }}>
                                  {mealParticipants[opt.id].map((p, idx) => (
                                    <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                      <strong>{p.name}</strong>
                                      <div style={{ fontSize: '0.9em', color: '#666' }}>{p.email} • {p.city}/{p.state}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div>Nenhuma participante registrou retirada desta refeição</div>
                            )
                          ) : (
                            <div>Carregando...</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MealOptions;
