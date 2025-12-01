import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const remoteLogoUrl = 'https://static.wixstatic.com/media/3a3a31_3199343965c94b6d918cb018743f2475~mv2.png/v1/fill/w_91,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MEL%2020252%20-%20Novos%20cards%20(2).png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.src !== remoteLogoUrl) img.src = remoteLogoUrl;
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="inner">
        <Link to="/" className="nav-logo" title="Painel Administrativo">
          <img src="/logo.png" alt="MEL logo" onError={onImgError} />
        </Link>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link to="/users" className="nav-link" onClick={() => setMobileOpen(false)}>Usuárias</Link>
          <Link to="/participants" className="nav-link" onClick={() => setMobileOpen(false)}>Inscritas</Link>
          <Link to="/credenciadas" className="nav-link" onClick={() => setMobileOpen(false)}>Credenciadas</Link>
          <Link to="/meal-options" className="nav-link" onClick={() => setMobileOpen(false)}>Refeições</Link>
          <Link to="/importar" className="nav-link" onClick={() => setMobileOpen(false)}>Importar Participantes</Link>
          <button
            className="nav-link nav-logout"
            onClick={() => { setMobileOpen(false); handleLogout(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setMobileOpen(false); handleLogout(); } }}
          >
            Sair
          </button>
        </div>

        <div className="nav-right">
          <button className="hamburger" aria-label="Abrir menu" onClick={() => setMobileOpen(v => !v)}>
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
