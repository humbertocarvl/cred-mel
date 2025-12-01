
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import Participants from './pages/Participants';
import Accredited from './pages/Accredited';
import MealOptions from './pages/MealOptions';
import Credenciadas from './pages/Credenciadas';
import ImportarParticipantes from './pages/ImportarParticipantes';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
        <Route path="/participants" element={isAuthenticated ? <Participants /> : <Navigate to="/login" />} />
        <Route path="/credenciadas" element={isAuthenticated ? <Credenciadas /> : <Navigate to="/login" />} />
        <Route path="/accredited" element={isAuthenticated ? <Accredited /> : <Navigate to="/login" />} />
        <Route path="/meal-options" element={isAuthenticated ? <MealOptions /> : <Navigate to="/login" />} />
        <Route path="/importar" element={isAuthenticated ? <ImportarParticipantes /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
