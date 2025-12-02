import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const remoteLogoUrl = 'https://static.wixstatic.com/media/3a3a31_3199343965c94b6d918cb018743f2475~mv2.png/v1/fill/w_91,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MEL%2020252%20-%20Novos%20cards%20(2).png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const onImgError = (e: any) => { const img = e.target as HTMLImageElement; if (img && img.src !== remoteLogoUrl) img.src = remoteLogoUrl; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      // Forçar reload para garantir detecção do token
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="inner" style={{ justifyContent: 'center' }}>
          <img src="/logo.png" alt="MEL" onError={onImgError} style={{ height: '48px' }} />
        </div>
      </header>
      <div className="flex items-center justify-center" style={{ background: 'var(--mel-gray)', minHeight: 'calc(100vh - 90px)', padding: '1rem' }}>
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
    </>
  );
};

export default Login;
