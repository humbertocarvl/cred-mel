import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';

interface MealOption {
  id: number;
  name: string;
  description?: string;
}

const MealOptions: React.FC = () => {
  const [options, setOptions] = useState<MealOption[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<MealOption | null>(null);

  useEffect(() => {
    api.get('/meal-options').then(res => setOptions(res.data));
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
    api.delete(`/meal-options/${id}`).then(() => {
      setOptions(options.filter(opt => opt.id !== id));
    });
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
                  <tr key={opt.id}>
                    <td>{opt.name}</td>
                    <td>{opt.description}</td>
                    <td>
                      <button className="button" style={{ background: 'var(--mel-gold)', marginRight: '0.5rem' }} onClick={() => handleEdit(opt)}>Editar</button>
                      <button className="button" style={{ background: 'var(--mel-yellow)' }} onClick={() => handleDelete(opt.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MealOptions;
