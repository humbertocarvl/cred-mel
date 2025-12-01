import { useState } from 'react';
import api from '../services/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(email: string, password: string) {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao autenticar');
      setLoading(false);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
  }

  return { login, logout, loading, error };
}
