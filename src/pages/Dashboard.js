import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RECENT_ORDERS = [
  { ref: '#LV-00248', client: 'Sophie M.', items: 'Robe Midi × 1', total: 490, status: 'transit', time: 'Il y a 8 min' },
  { ref: '#LV-00247', client: 'Camille D.', items: 'Blazer × 1, Ceinture × 1', total: 345, status: 'preparing', time: 'Il y a 22 min' },
  { ref: '#LV-00246', client: 'Marie L.', items: 'Trench Camel × 1', total: 890, status: 'delivered', time: 'Il y a 1h' },
  { ref: '#LV-00245', client: 'Julie P.', items: 'Robe Fleurie × 2', total: 980, status: 'delivered', time: 'Il y a 2h' },
];

const STATUS_MAP = {
  transit: { label: 'En livraison', cls: 'badge-info' },
  preparing: { label: 'En préparation', cls: 'badge-warning' },
  delivered: { label: 'Livrée', cls: 'badge-success' },
  pending: { label: 'En attente', cls: 'badge-gray' },
};

const ALERTS = [
  { icon: '⚠️', text: 'Stock faible : Robe Midi (2 restants)', color: 'var(--warning-bg)', border: 'var(--warning)' },
  { icon: '📦', text: '3 commandes en attente de préparation', color: 'var(--info-bg)', border: 'var(--info)' },
];

export default function Dashboard() {
  const { boutique } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '4px' }}>{greeting} 👋</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '400' }}>{boutique?.name}</h1>
        <p style={{ color: 'var(--gray)', fontSize: '14px', marginTop: '4px' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Alerts */}
      {ALERTS.map((a, i) => (
        <div key={i} style={{ background: a.color, border: `1px solid ${a.border}22`, borderLeft: `3px solid ${a.border}`, borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
          <span>{a.icon}</span><span>{a.text}</span>
        </div>
      ))}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '28px 0' }}>
        {[
          { label: "Commandes aujourd'hui", value: '12', sub: '+3 depuis hier', trend: 'up' },
          { label: 'Chiffre du jour', value: '4 820 €', sub: '+12% vs hier', trend: 'up' },
          { label: 'En cours de livraison', value: '3', sub: 'Livraison < 1h', trend: null },
          { label: 'Note moyenne', value: '4.8 ★', sub: 'Sur 248 avis', trend: null },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: '28px' }}>{s.value}</div>
            <div className={s.trend === 'up' ? 'stat-trend-up' : 'stat-sub'} style={{ marginTop: '6px', fontSize: '12px' }}>
              {s.trend === 'up' ? '↑ ' : ''}{s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Recent orders */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '400' }}>Commandes récentes</h3>
            <Link to="/commandes" style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '500' }}>Voir tout →</Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Heure</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map(o => {
                const st = STATUS_MAP[o.status];
                return (
                  <tr key={o.ref}>
                    <td style={{ fontWeight: '500', fontFamily: 'monospace', fontSize: '13px' }}>{o.ref}</td>
                    <td>{o.client}</td>
                    <td style={{ color: 'var(--gray)', fontSize: '13px' }}>{o.items}</td>
                    <td style={{ fontWeight: '500' }}>€{o.total}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td style={{ color: 'var(--gray)', fontSize: '12px' }}>{o.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick actions + stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>Actions rapides</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '➕', label: 'Ajouter un produit', path: '/produits' },
                { icon: '📋', label: 'Commandes en attente', path: '/commandes' },
                { icon: '💬', label: 'Messages clients', path: '/clients' },
                { icon: '🎁', label: 'Créer une promotion', path: '/produits' },
              ].map(a => (
                <Link key={a.label} to={a.path} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--white-2)', fontSize: '14px', transition: 'var(--transition)', color: 'var(--noir)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--white-2)'}>
                  <span>{a.icon}</span><span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>Stocks critiques</h4>
            {[
              { name: 'Robe Midi Fleurie', stock: 2, emoji: '👗' },
              { name: 'Mules Beige T38', stock: 1, emoji: '👠' },
              { name: 'Trench Camel S', stock: 3, emoji: '🧥' },
            ].map(p => (
              <div key={p.name} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '20px' }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: p.stock <= 2 ? 'var(--error)' : 'var(--warning)' }}>⚠ {p.stock} restant{p.stock > 1 ? 's' : ''}</div>
                </div>
                <Link to="/produits" style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '500' }}>Gérer</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
