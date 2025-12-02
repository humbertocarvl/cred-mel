import React from 'react';
import { Link } from 'react-router-dom';

const IconScan = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconMeal = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M8 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconRegister = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 21c1.5-4 5.5-6 7-6s5.5 2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BottomNav: React.FC = () => (
  <nav className="bottom-nav" aria-label="Navegação">
    <Link to="/credenciamento" aria-label="Credenciar">
      <IconScan />
      <span className="label">Credenciar</span>
    </Link>
    <Link to="/refeicoes" aria-label="Refeições">
      <IconMeal />
      <span className="label">Refeições</span>
    </Link>
    <Link to="/inscricao" aria-label="Inscrição">
      <IconRegister />
      <span className="label">Inscrição</span>
    </Link>
    <Link to="/consulta" aria-label="Consulta">
      <IconSearch />
      <span className="label">Consulta</span>
    </Link>
  </nav>
);

export default BottomNav;
