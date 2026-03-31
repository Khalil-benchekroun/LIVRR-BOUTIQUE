import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { path: '/', icon: '▦', label: 'Tableau de bord' },
  { path: '/commandes', icon: '📦', label: 'Commandes', badge: 3 },
  { path: '/produits', icon: '🏷', label: 'Produits & stocks' },
  { path: '/statistiques', icon: '📊', label: 'Statistiques' },
  { path: '/clients', icon: '👥', label: 'Clients' },
  { path: '/parametres', icon: '⚙', label: 'Paramètres' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { boutique, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('À bientôt !');
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--sidebar)',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--white)', letterSpacing: '0.15em' }}>LIVRR</div>
        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Espace Boutique</div>
      </div>

      {/* Boutique info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
          {boutique?.logo || '🏪'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{boutique?.name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {boutique?.isVerified ? '✓ Vérifié' : '⏳ En attente'}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              background: active ? 'rgba(201,169,110,0.12)' : 'transparent',
              color: active ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              fontWeight: active ? '500' : '400',
              transition: 'var(--transition)',
              position: 'relative',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ background: 'var(--gold)', color: 'var(--noir)', fontSize: '10px', fontWeight: '600', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '10px', textAlign: 'center' }}>
          ⚡ Livraison en moins d'1h
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '10px', borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
          fontSize: '13px', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)',
          transition: 'var(--transition)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--white)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
          🚪 Se déconnecter
        </button>
      </div>
    </aside>
  );
}
