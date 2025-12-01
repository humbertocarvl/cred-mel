import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav className="bg-blue-600 text-white px-4 py-2 flex gap-4">
    <Link to="/credenciamento" className="font-bold">Credenciamento</Link>
    <Link to="/refeicoes">Refeições</Link>
    <Link to="/inscricao">Inscrição</Link>
    <Link to="/consulta">Consulta Rápida</Link>
    <div className="ml-auto">Scanner QR Code</div>
  </nav>
);

export default Navbar;
