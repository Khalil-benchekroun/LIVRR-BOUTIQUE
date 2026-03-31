import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import Sidebar from './components/Sidebar';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Stats from './pages/Stats';
import Clients from './pages/Clients';
import Settings from './pages/Settings';

function PrivateRoute({ children }) {
  const { boutique, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}><div className="spinner" /></div>;
  return boutique ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' } }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Onboarding />} />
          <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/commandes" element={<PrivateRoute><AppLayout><Orders /></AppLayout></PrivateRoute>} />
          <Route path="/produits" element={<PrivateRoute><AppLayout><Products /></AppLayout></PrivateRoute>} />
          <Route path="/statistiques" element={<PrivateRoute><AppLayout><Stats /></AppLayout></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><AppLayout><Clients /></AppLayout></PrivateRoute>} />
          <Route path="/parametres" element={<PrivateRoute><AppLayout><Settings /></AppLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
