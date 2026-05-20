import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// ── CONFIG BOUTIQUES DÉMO ─────────────────────────────────
const DEMO_BOUTIQUES = {
  sandro: {
    password: 'Sandro2026',
    data: {
      _id: 'b1',
      name: 'Sandro Paris 8e',
      email: 'sandro.paris8@livrr.fr',
      role: 'boutique',
      logo: null,
      logoText: 'S',
      couleur: '#C9A96E',
      address: '42 Avenue Montaigne, 75008 Paris',
      category: ['Vêtements', 'Accessoires'],
      isVerified: true,
      stats: { totalOrders: 248, totalRevenue: 89420, avgRating: 4.8 },
    }
  },
  thekooples: {
    password: 'Roppenheim',
    data: {
      _id: 'b2',
      name: 'The Kooples',
      email: 'thekooples@livrr.fr',
      role: 'boutique',
      logo: null,
      logoText: 'TK',
      couleur: '#1A1A1A',
      address: '18 Rue du Four, 75006 Paris',
      category: ['Vêtements', 'Maroquinerie'],
      isVerified: true,
      stats: { totalOrders: 184, totalRevenue: 72350, avgRating: 4.7 },
    }
  },
  isabelmarant: {
    password: 'Marant2026',
    data: {
      _id: 'b3',
      name: 'Isabel Marant',
      email: 'isabelmarant@livrr.fr',
      role: 'boutique',
      logo: null,
      logoText: 'IM',
      couleur: '#8B7355',
      address: '1 Rue Jacob, 75006 Paris',
      category: ['Vêtements', 'Chaussures', 'Accessoires'],
      isVerified: true,
      stats: { totalOrders: 312, totalRevenue: 124800, avgRating: 4.9 },
    }
  }
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
    // Chercher par login (email ou nom simplifié)
    const loginKey = email.toLowerCase()
      .replace(/\s/g, '')
      .replace('@livrr.fr', '')
      .replace('.', '');

    const match = DEMO_BOUTIQUES[loginKey];

    if (!match || match.password !== password) {
      toast.error('Identifiants incorrects');
      throw new Error('Identifiants incorrects');
    }

    setBoutique(match.data);
    localStorage.setItem('livrr_boutique', JSON.stringify(match.data));
    toast.success(`Bienvenue sur votre espace ${match.data.name} !`);
    return match.data;
  };

  const register = async (data) => {
    const newBoutique = { 
      ...DEMO_BOUTIQUES.sandro.data, 
      ...data, 
      _id: 'b_new', 
      isVerified: false 
    };
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