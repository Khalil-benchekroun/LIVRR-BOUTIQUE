import React, { useState, useEffect } from 'react';
import { db } from '../firebaseClient';
import { ref, onValue, off, remove } from 'firebase/database';

const TRACKING_TOKEN = 'LIVRR2026';

const PAGE_ICONS = {
  "/": "🏠", "/statistiques": "📊", "/commandes": "📦",
  "/commandes-pos": "🖥️", "/retours": "↩️", "/produits": "👗",
  "/categories": "🗂️", "/qrcode": "📱", "/marketing": "🎯",
  "/vendeurs": "🤝", "/clients": "👥", "/services": "⚙️",
  "/messages": "💬", "/parametres": "⚙️", "/finance": "💰",
  "/support": "🎧", "/livraisons": "🚚", "/avis": "⭐", "/calendrier": "📅",
};

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return null;
  const s = Math.round(ms / 1000);
  if (s < 1) return null;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m${s % 60 > 0 ? ` ${s % 60}s` : ''}`;
};

export default function LiveTracking() {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [boutique, setBoutique] = useState('thekooples');
  const [isLive, setIsLive] = useState(false);
  const [sessionStart] = useState(new Date());

  const handleAuth = () => {
    if (token === TRACKING_TOKEN) setAuthenticated(true);
    else alert('Token invalide');
  };

  const handleClear = () => {
    const eventsRef = ref(db, `tracking/${boutique}/events`);
    remove(eventsRef);
    setEvents([]);
  };

  useEffect(() => {
    if (!authenticated) return;
    const eventsRef = ref(db, `tracking/${boutique}/events`);
    setIsLive(true);
    setEvents([]);
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { setEvents([]); return; }
      const parsed = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 100);
      setEvents(parsed);
    });
    return () => { off(eventsRef); setIsLive(false); };
  }, [authenticated, boutique]);

  // events trié du plus récent au plus ancien
  // durée sur une page = timestamp de l'event suivant (index-1, plus récent) - timestamp actuel
  const eventsWithDuration = events.map((event, index) => {
    const prevEvent = events[index - 1]; // plus récent = quand elle est partie
    const duration = prevEvent?.timestamp && event.timestamp
      ? prevEvent.timestamp - event.timestamp
      : null;
    return { ...event, duration };
  });

  // Temps total par page
  const timePerPage = {};
  eventsWithDuration.forEach(e => {
    if (e.path && e.duration && e.duration > 0) {
      timePerPage[e.path] = (timePerPage[e.path] || 0) + e.duration;
    }
  });

  const topPages = Object.entries(timePerPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const uniquePages = [...new Set(events.map(e => e.path))].length;
  const boutiqueLabel = {
    thekooples: 'The Kooples',
    sandro: 'Sandro',
    isabelmarant: 'Isabel Marant'
  }[boutique];

  const totalDuration = events.length > 1
    ? (events[0]?.timestamp || 0) - (events[events.length - 1]?.timestamp || 0)
    : 0;

  if (!authenticated) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <div style={styles.authLogo}>L</div>
          <h2 style={styles.authTitle}>Live Tracking</h2>
          <p style={styles.authSubtitle}>Accès réservé — LIVRR Internal</p>
          <input
            type="password"
            placeholder="Token d'accès"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            style={styles.input}
          />
          <button onClick={handleAuth} style={styles.button}>Accéder</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.liveDot} />
          <h1 style={styles.title}>Live Tracking</h1>
          <span style={isLive ? styles.liveBadge : styles.offlineBadge}>
            {isLive ? 'EN DIRECT' : 'Hors ligne'}
          </span>
        </div>
        <div style={styles.headerRight}>
          <select value={boutique} onChange={(e) => setBoutique(e.target.value)} style={styles.select}>
            <option value="thekooples">The Kooples</option>
            <option value="sandro">Sandro</option>
            <option value="isabelmarant">Isabel Marant</option>
          </select>
          <button onClick={handleClear} style={styles.clearBtn}>Effacer</button>
        </div>
      </div>

      {/* Session bar */}
      <div style={styles.sessionBar}>
        <span style={styles.sessionInfo}>🏬 <strong style={{color:'#C9A96E'}}>{boutiqueLabel}</strong></span>
        <span style={styles.sessionInfo}>🕐 Session à {sessionStart.toLocaleTimeString('fr-FR')}</span>
        <span style={styles.sessionInfo}>📍 {uniquePages} page{uniquePages > 1 ? 's' : ''} visitée{uniquePages > 1 ? 's' : ''}</span>
        <span style={styles.sessionInfo}>⏱️ Durée totale : {formatDuration(totalDuration) || '—'}</span>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{events.length}</span>
          <span style={styles.statLabel}>Actions totales</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{uniquePages}</span>
          <span style={styles.statLabel}>Pages visitées</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{formatDuration(timePerPage['/produits']) || '—'}</span>
          <span style={styles.statLabel}>Temps sur Produits</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{formatDuration(timePerPage['/finance']) || '—'}</span>
          <span style={styles.statLabel}>Temps sur Finance</span>
        </div>
      </div>

      {/* Top pages par temps */}
      {topPages.length > 0 && (
        <div style={styles.topPagesBox}>
          <p style={styles.sectionTitle}>⏱️ Pages où elle passe le plus de temps</p>
          {topPages.map(([path, ms]) => (
            <div key={path} style={styles.topPageRow}>
              <span style={styles.topPageIcon}>{PAGE_ICONS[path] || '📌'}</span>
              <span style={styles.topPageLabel}>{path}</span>
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${Math.min(100, (ms / topPages[0][1]) * 100)}%`,
                }} />
              </div>
              <span style={styles.topPageTime}>{formatDuration(ms)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Parcours */}
      {eventsWithDuration.length > 1 && (
        <div style={styles.parcoursBox}>
          <p style={styles.sectionTitle}>📍 Parcours de navigation</p>
          <div style={styles.parcoursFlow}>
            {[...eventsWithDuration].reverse().map((e, i, arr) => (
              <React.Fragment key={e.id}>
                <div style={styles.parcoursItem}>
                  <span style={styles.parcoursStep}>
                    {PAGE_ICONS[e.path] || '📌'} {e.label || e.path}
                  </span>
                  {e.duration && formatDuration(e.duration) && (
                    <span style={styles.parcoursDuration}>{formatDuration(e.duration)}</span>
                  )}
                </div>
                {i < arr.length - 1 && <span style={styles.parcoursArrow}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Feed */}
      <div style={styles.feed}>
        <p style={styles.sectionTitle}>Activité en temps réel</p>
        {eventsWithDuration.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>En attente d'activité sur {boutiqueLabel}...</p>
            <p style={styles.emptyHint}>Les actions apparaîtront ici dès que la directrice navigue.</p>
          </div>
        ) : (
          eventsWithDuration.map((event, index) => (
            <div key={event.id} style={{
              ...styles.eventRow,
              background: index === 0 ? '#C9A96E11' : 'transparent',
              borderLeft: index === 0 ? '3px solid #C9A96E' : '3px solid transparent',
            }}>
              <span style={styles.eventIcon}>{PAGE_ICONS[event.path] || '📌'}</span>
              <div style={styles.eventInfo}>
                <span style={styles.eventLabel}>{event.label || event.path}</span>
                <span style={styles.eventPath}>{event.path}</span>
              </div>
              {event.duration && formatDuration(event.duration) && (
                <span style={styles.durationBadge}>⏱️ {formatDuration(event.duration)}</span>
              )}
              {index === 0 && <span style={styles.newBadge}>NOUVEAU</span>}
              <span style={styles.eventTime}>
                {event.timestamp ? new Date(event.timestamp).toLocaleTimeString('fr-FR') : '—'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  authContainer: { minHeight:'100vh', background:'#0A0A0F', display:'flex', alignItems:'center', justifyContent:'center' },
  authBox: { background:'#13131A', border:'1px solid #C9A96E33', borderRadius:16, padding:'48px 40px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, width:360 },
  authLogo: { width:56, height:56, borderRadius:'50%', background:'#C9A96E', display:'flex', alignItems:'center', justifyContent:'center', color:'#0A0A0F', fontSize:24, fontWeight:700 },
  authTitle: { color:'#C9A96E', fontFamily:'Cormorant Garamond, serif', fontSize:28, margin:0 },
  authSubtitle: { color:'#666', fontSize:13, margin:0 },
  input: { width:'100%', padding:'12px 16px', background:'#0A0A0F', border:'1px solid #C9A96E44', borderRadius:8, color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' },
  button: { width:'100%', padding:'12px', background:'#C9A96E', color:'#0A0A0F', border:'none', borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer' },
  container: { minHeight:'100vh', background:'#0A0A0F', padding:'32px', fontFamily:'DM Sans, sans-serif' },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 },
  headerLeft: { display:'flex', alignItems:'center', gap:12 },
  headerRight: { display:'flex', alignItems:'center', gap:12 },
  liveDot: { width:12, height:12, borderRadius:'50%', background:'#ff4444', boxShadow:'0 0 8px #ff4444' },
  title: { color:'#C9A96E', fontFamily:'Cormorant Garamond, serif', fontSize:32, margin:0 },
  liveBadge: { background:'#ff003322', color:'#ff4444', border:'1px solid #ff444444', borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:700, letterSpacing:1 },
  offlineBadge: { background:'#33333322', color:'#666', border:'1px solid #33333344', borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:700 },
  select: { background:'#13131A', border:'1px solid #C9A96E44', borderRadius:8, color:'#C9A96E', padding:'8px 16px', fontSize:14, cursor:'pointer' },
  clearBtn: { background:'transparent', border:'1px solid #333', borderRadius:8, color:'#666', padding:'8px 16px', fontSize:13, cursor:'pointer' },
  sessionBar: { display:'flex', gap:24, flexWrap:'wrap', marginBottom:24, padding:'12px 16px', background:'#13131A', borderRadius:10, border:'1px solid #C9A96E11' },
  sessionInfo: { color:'#888', fontSize:13 },
  statsRow: { display:'flex', gap:16, marginBottom:24 },
  statBox: { flex:1, background:'#13131A', border:'1px solid #C9A96E22', borderRadius:12, padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', gap:4 },
  statNumber: { color:'#C9A96E', fontSize:32, fontFamily:'Cormorant Garamond, serif', fontWeight:700 },
  statLabel: { color:'#666', fontSize:12, textAlign:'center' },
  topPagesBox: { background:'#13131A', border:'1px solid #C9A96E22', borderRadius:12, padding:'20px 24px', marginBottom:24 },
  sectionTitle: { color:'#888', fontSize:12, margin:'0 0 16px 0', textTransform:'uppercase', letterSpacing:1 },
  topPageRow: { display:'flex', alignItems:'center', gap:12, marginBottom:10 },
  topPageIcon: { fontSize:16, minWidth:20 },
  topPageLabel: { color:'#fff', fontSize:13, minWidth:140 },
  barContainer: { flex:1, height:6, background:'#1e1e2a', borderRadius:3, overflow:'hidden' },
  bar: { height:'100%', background:'#C9A96E', borderRadius:3, transition:'width 0.5s ease' },
  topPageTime: { color:'#C9A96E', fontSize:13, minWidth:48, textAlign:'right' },
  parcoursBox: { background:'#13131A', border:'1px solid #C9A96E22', borderRadius:12, padding:'16px 20px', marginBottom:24 },
  parcoursFlow: { display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' },
  parcoursItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  parcoursStep: { background:'#0A0A0F', border:'1px solid #C9A96E33', borderRadius:6, padding:'4px 10px', color:'#C9A96E', fontSize:12 },
  parcoursDuration: { color:'#666', fontSize:10 },
  parcoursArrow: { color:'#333', fontSize:14 },
  feed: { background:'#13131A', border:'1px solid #C9A96E22', borderRadius:12, padding:24 },
  empty: { display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 0', gap:8 },
  emptyText: { color:'#C9A96E', fontSize:16, margin:0 },
  emptyHint: { color:'#444', fontSize:13, margin:0 },
  eventRow: { display:'flex', alignItems:'center', gap:12, padding:'12px 8px', borderBottom:'1px solid #C9A96E11', borderRadius:6, marginBottom:2 },
  eventIcon: { fontSize:20, minWidth:28 },
  eventInfo: { display:'flex', flexDirection:'column', flex:1 },
  eventLabel: { color:'#fff', fontSize:14, fontWeight:500 },
  eventPath: { color:'#444', fontSize:11, marginTop:2 },
  durationBadge: { background:'#ffffff0a', color:'#888', borderRadius:4, padding:'2px 8px', fontSize:11 },
  newBadge: { background:'#C9A96E22', color:'#C9A96E', borderRadius:4, padding:'2px 8px', fontSize:10, fontWeight:700, letterSpacing:1 },
  eventTime: { color:'#444', fontSize:12, whiteSpace:'nowrap' },
};