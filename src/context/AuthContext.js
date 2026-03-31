import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const DEMO_BOUTIQUE = {
  _id: 'b1',
  name: 'Sandro Paris 8e',
  email: 'sandro.paris8@livrr.fr',
  role: 'boutique',
  logo: '🏪',
  address: '42 Avenue Montaigne, 75008 Paris',
  category: ['Vêtements', 'Accessoires'],
  isVerified: true,
  stats: { totalOrders: 248, totalRevenue: 89420, avgRating: 4.8 },
};

export function AuthProvider({ children }) {
  const [boutique, setBoutique] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('livrr_boutique');
    if (saved) setBoutique(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Demo — accepte tout
    setBoutique(DEMO_BOUTIQUE);
    localStorage.setItem('livrr_boutique', JSON.stringify(DEMO_BOUTIQUE));
    toast.success('Bienvenue sur votre espace boutique !');
    return DEMO_BOUTIQUE;
  };

  const register = async (data) => {
    const newBoutique = { ...DEMO_BOUTIQUE, ...data, _id: 'b_new', isVerified: false };
    setBoutique(newBoutique);
    localStorage.setItem('livrr_boutique', JSON.stringify(newBoutique));
    toast.success('Inscription réussie ! En attente de validation LIVRR.');
    return newBoutique;
  };

  const logout = () => {
    setBoutique(null);
    localStorage.removeItem('livrr_boutique');
  };

  return (
    <AuthContext.Provider value={{ boutique, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
