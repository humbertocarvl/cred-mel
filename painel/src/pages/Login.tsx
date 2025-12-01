import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--mel-gray)' }}>
      <form className="card" style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: 'var(--mel-font-title)', color: 'var(--mel-gold)', fontWeight: 'bold', fontSize: '2em', marginBottom: '1em' }}>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '1em', fontWeight: 'bold' }}>{error}</div>}
        <input
          type="email"
          placeholder="E-mail"
          style={{ width: '100%' }}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          style={{ width: '100%' }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="button" style={{ width: '100%', marginTop: '1em' }}>Entrar</button>
      </form>
    </div>
  );
};

export default Login;
