import React, { useState, useEffect } from 'react';
import { db } from '../firebaseClient';
import { ref, onValue, off } from 'firebase/database';

const TRACKING_TOKEN = 'LIVRR2026';

const eventLabels = {
  page_view: '📄 Page visitée',
  product_view: '👁️ Produit consulté',
  add_to_cart: '🛒 Ajout au panier',
  checkout: '💳 Passage commande',
  login: '🔐 Connexion',
  search: '🔍 Recherche',
  filter: '🎛️ Filtre appliqué',
  message: '💬 Message envoyé',
};

export default function LiveTracking() {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [boutique, setBoutique] = useState('thekooples');
  const [isLive, setIsLive] = useState(false);

  const handleAuth = () => {
    if (token === TRACKING_TOKEN) {
      setAuthenticated(true);
    } else {
      alert('Token invalide');
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    const eventsRef = ref(db, `tracking/${boutique}/events`);
    setIsLive(true);
    setEvents([]);

    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const parsed = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 50);
      setEvents(parsed);
    });

    return () => {
      off(eventsRef);
      setIsLive(false);
    };
  }, [authenticated, boutique]);

  if (!authenticated) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <img src="/logo-livrr.png" alt="LIVRR" style={styles.logo} />
          <h2 style={styles.authTitle}>Live Tracking</h2>
          <p style={styles.authSubtitle}>Accès réservé — LIVRR</p>
          <input
            type="password"
            placeholder="Token d'accès"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            style={styles.input}
          />
          <button onClick={handleAuth} style={styles.button}>
            Accéder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>🔴 Live Tracking</h1>
          <span style={isLive ? styles.liveBadge : styles.offlineBadge}>
            {isLive ? '● EN DIRECT' : '○ Hors ligne'}
          </span>
        </div>
        <select
          value={boutique}
          onChange={(e) => setBoutique(e.target.value)}
          style={styles.select}
        >
          <option value="thekooples">The Kooples</option>
          <option value="sandro">Sandro</option>
          <option value="isabelmarant">Isabel Marant</option>
        </select>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{events.length}</span>
          <span style={styles.statLabel}>Actions captées</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>
            {events.filter(e => e.type === 'product_view').length}
          </span>
          <span style={styles.statLabel}>Produits vus</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>
            {events.filter(e => e.type === 'add_to_cart').length}
          </span>
          <span style={styles.statLabel}>Ajouts panier</span>
        </div>
      </div>

      <div style={styles.feed}>
        {events.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>En attente d'activité sur la boutique {boutique}...</p>
            <p style={styles.emptyHint}>Les actions apparaîtront ici en temps réel dès que la directrice se connecte.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} style={styles.eventRow}>
              <span style={styles.eventType}>
                {eventLabels[event.type] || `📌 ${event.type}`}
              </span>
              {event.data?.page && (
                <span style={styles.eventData}>{event.data.page}</span>
              )}
              {event.data?.productName && (
                <span style={styles.eventData}>{event.data.productName}</span>
              )}
              {event.data?.query && (
                <span style={styles.eventData}>"{event.data.query}"</span>
              )}
              <span style={styles.eventTime}>
                {event.timestamp
                  ? new Date(event.timestamp).toLocaleTimeString('fr-FR')
                  : '—'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  authContainer: {
    minHeight: '100vh',
    background: '#0A0A0F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBox: {
    background: '#13131A',
    border: '1px solid #C9A96E33',
    borderRadius: 16,
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: 360,
  },
  logo: { height: 40, marginBottom: 8 },
  authTitle: { color: '#C9A96E', fontFamily: 'Cormorant Garamond, serif', fontSize: 28, margin: 0 },
  authSubtitle: { color: '#666', fontSize: 13, margin: 0 },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#0A0A0F',
    border: '1px solid #C9A96E44',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#C9A96E',
    color: '#0A0A0F',
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    letterSpacing: 1,
  },
  container: {
    minHeight: '100vh',
    background: '#0A0A0F',
    padding: '32px',
    fontFamily: 'DM Sans, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  title: { color: '#C9A96E', fontFamily: 'Cormorant Garamond, serif', fontSize: 32, margin: 0 },
  liveBadge: {
    background: '#ff003322',
    color: '#ff4444',
    border: '1px solid #ff444444',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
  },
  offlineBadge: {
    background: '#33333322',
    color: '#666',
    border: '1px solid #33333344',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
  },
  select: {
    background: '#13131A',
    border: '1px solid #C9A96E44',
    borderRadius: 8,
    color: '#C9A96E',
    padding: '8px 16px',
    fontSize: 14,
    cursor: 'pointer',
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    background: '#13131A',
    border: '1px solid #C9A96E22',
    borderRadius: 12,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: { color: '#C9A96E', fontSize: 36, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 },
  statLabel: { color: '#666', fontSize: 12 },
  feed: {
    background: '#13131A',
    border: '1px solid #C9A96E22',
    borderRadius: 12,
    padding: 24,
    minHeight: 300,
  },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 8 },
  emptyText: { color: '#C9A96E', fontSize: 16, margin: 0 },
  emptyHint: { color: '#444', fontSize: 13, margin: 0, textAlign: 'center' },
  eventRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #C9A96E11',
  },
  eventType: { color: '#fff', fontSize: 14, minWidth: 200 },
  eventData: { color: '#C9A96E', fontSize: 13, flex: 1 },
  eventTime: { color: '#444', fontSize: 12, whiteSpace: 'nowrap' },
};