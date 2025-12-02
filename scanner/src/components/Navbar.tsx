import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const remoteLogoUrl = 'https://static.wixstatic.com/media/3a3a31_3199343965c94b6d918cb018743f2475~mv2.png/v1/fill/w_91,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MEL%2020252%20-%20Novos%20cards%20(2).png';

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const onImgError = (e: any) => { const img = e.target as HTMLImageElement; if (img && img.src !== remoteLogoUrl) img.src = remoteLogoUrl; };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Forçar reload para limpar estado e evitar exposição do sistema
    window.location.href = '/login';
  };

  return (
    <>
      <header className="navbar-top">
        <img src="/logo.png" alt="MEL" onError={onImgError} />
        <button onClick={handleLogout} className="logout-btn" aria-label="Sair" title="Sair">
          <LogoutIcon />
        </button>
      </header>

      <BottomNav />
    </>
  );
};

export default Navbar;
