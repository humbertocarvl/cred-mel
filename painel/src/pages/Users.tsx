import React, { useState, useEffect } from 'react';
import UserForm from '../components/UserForm';
import Card from '../components/Card';
import api from '../services/api';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordId, setChangePasswordId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');

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
          window.location.href = '/login';
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
        window.location.href = '/login';
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
        window.location.href = '/login';
        return;
      }
      setError(err?.response?.data?.message || 'Erro ao alternar status');
    }
  }

  async function handleChangePassword() {
    if (!changePasswordId || !newPassword) {
      setError('Digite uma nova senha');
      return;
    }
    setError(null);
    try {
      await api.patch(`/users/${changePasswordId}/password`, { password: newPassword });
      setChangePasswordId(null);
      setNewPassword('');
      alert('Senha alterada com sucesso!');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        window.location.href = '/login';
        return;
      }
      setError(err?.response?.data?.message || 'Erro ao alterar senha');
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
          {error && <div style={{ color: 'red', marginTop: '1em', fontWeight: 'bold' }}>{error}</div>}
          {showForm && <UserForm onSubmit={handleAdd} />}
        </Card>

        <Card>
          {loading ? (
            <div style={{ color: 'var(--mel-gold)', fontWeight: 'bold' }}>Carregando...</div>
          ) : users.length === 0 ? (
            <div style={{ color: 'var(--mel-black)', fontWeight: 'bold' }}>Nenhum usuário cadastrado</div>
          ) : (
            <div className="table-wrapper">
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
                      <button className="button" style={{ background: 'var(--mel-gold)', marginRight: '0.5em' }} onClick={() => handleToggle(u.id)}>
                        {u.active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button className="button" style={{ background: 'var(--mel-yellow)' }} onClick={() => setChangePasswordId(u.id)}>
                        Alterar Senha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </Card>

        {changePasswordId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" style={{ padding: '1rem' }}>
            <div className="card" style={{ background: 'var(--mel-white)', maxWidth: '400px', width: '100%', margin: 'auto', borderRadius: 'var(--mel-border-radius)', boxShadow: '0 2px 8px rgba(34,34,34,0.12)', padding: '1.5em' }}>
              <h2 style={{ color: 'var(--mel-gold)', fontFamily: 'var(--mel-font-title)', fontWeight: 'bold', marginBottom: '1em' }}>Alterar Senha</h2>
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', marginBottom: '1em' }}
              />
              {error && <div style={{ color: 'red', marginBottom: '1em' }}>{error}</div>}
              <button className="button" style={{ background: 'var(--mel-yellow)', marginRight: '0.5em' }} onClick={handleChangePassword}>
                Confirmar
              </button>
              <button className="button" style={{ background: 'var(--mel-gray)' }} onClick={() => { setChangePasswordId(null); setNewPassword(''); setError(null); }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
