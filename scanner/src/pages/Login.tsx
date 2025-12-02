import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import MobileCard from '../components/MobileCard';
import MobileButton from '../components/MobileButton';

const remoteLogoUrl = 'https://static.wixstatic.com/media/3a3a31_3199343965c94b6d918cb018743f2475~mv2.png/v1/fill/w_91,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MEL%2020252%20-%20Novos%20cards%20(2).png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const onImgError = (e: any) => { const img = e.target as HTMLImageElement; if (img && img.src !== remoteLogoUrl) img.src = remoteLogoUrl; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // Forçar reload para garantir que o App.tsx detecte o token
      window.location.href = '/';
    }
  };

  return (
    <>
      <header className="navbar-top">
        <img src="/logo.png" alt="MEL" onError={onImgError} />
      </header>
      <div className="container-mobile" style={{ paddingTop: 'calc(var(--navbar-height) + 1rem)' }}>
      <MobileCard>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
          <h2 className="text-xl font-bold mb-4">Login</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            type="email"
            placeholder="E-mail"
            className="w-full mb-2 p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <MobileButton type="submit" full disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</MobileButton>
        </form>
      </MobileCard>
    </div>
    </>
  );
};

export default Login;
