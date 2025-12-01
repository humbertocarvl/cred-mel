
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Credenciamento from './pages/Credenciamento';
import Refeicoes from './pages/Refeicoes';
import Inscricao from './pages/Inscricao';
import Login from './pages/Login';
import ConsultaRapida from './pages/ConsultaRapida';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isAuthenticated ? <Credenciamento /> : <Navigate to="/login" />} />
        <Route path="/credenciamento" element={isAuthenticated ? <Credenciamento /> : <Navigate to="/login" />} />
        <Route path="/refeicoes" element={isAuthenticated ? <Refeicoes /> : <Navigate to="/login" />} />
        <Route path="/inscricao" element={isAuthenticated ? <Inscricao /> : <Navigate to="/login" />} />
        <Route path="/consulta" element={isAuthenticated ? <ConsultaRapida /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
