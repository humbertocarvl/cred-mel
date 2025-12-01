import React, { useState, useEffect } from 'react';
import UserForm from '../components/UserForm';
import Card from '../components/Card';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/users');
        setUsers(res.data || []);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // token invalid / unauthorized — redirect to login
          navigate('/login');
          return;
        }
        setError(err?.response?.data?.message || 'Erro ao buscar usuárias');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  async function handleAdd(data: any) {
    setError(null);
    try {
      const res = await api.post('/users', data);
      // backend should return created user; fall back to submitted data
      const created = res.data && Object.keys(res.data).length ? res.data : { ...data, id: Date.now() };
      setUsers(prev => [...prev, created]);
      setShowForm(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        navigate('/login');
        return;
      }
      setError(err?.response?.data?.message || 'Erro ao criar usuária');
    }
  }

  async function handleToggle(id: number) {
    setError(null);
    try {
      const res = await api.patch(`/users/${id}/toggle`);
      const updated = res.data;
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        navigate('/login');
        return;
      }
      setError(err?.response?.data?.message || 'Erro ao alternar status');
    }
  }

  return (
    <div className="dashboard-mel" style={{ background: 'var(--mel-gray)', minHeight: '100vh', padding: '1em 0' }}>
      <div className="container">
        <h1 className="page-title">Usuárias do Scanner</h1>

        <Card>
          <button className="button" onClick={() => setShowForm(true)}>
            Novo usuário
          </button>
          {showForm && <UserForm onSubmit={handleAdd} />}
        </Card>

        <Card>
          {users.length === 0 ? (
            <div style={{ color: 'var(--mel-black)', fontWeight: 'bold' }}>Nenhum usuário cadastrado</div>
          ) : (
            <table className="table-mel">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.active ? 'Ativo' : 'Inativo'}</td>
                    <td>
                      <button className="button" style={{ background: 'var(--mel-gold)' }} onClick={() => handleToggle(u.id)}>
                        {u.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Users;
