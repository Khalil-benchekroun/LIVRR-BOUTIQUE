// Clients.js
import React, { useState } from 'react';

const CLIENTS = [
  { _id:'c1', name:'Sophie Martin', email:'sophie.m@email.com', orders:8, total:3920, lastOrder:"Aujourd'hui", loyal:true },
  { _id:'c2', name:'Camille Dupont', email:'camille.d@email.com', orders:5, total:2450, lastOrder:'Il y a 3 jours', loyal:true },
  { _id:'c3', name:'Marie Laurent', email:'marie.l@email.com', orders:12, total:6780, lastOrder:'Il y a 1 semaine', loyal:true },
  { _id:'c4', name:'Julie Petit', email:'julie.p@email.com', orders:2, total:890, lastOrder:'Il y a 2 semaines', loyal:false },
  { _id:'c5', name:'Emma Bernard', email:'emma.b@email.com', orders:1, total:650, lastOrder:'Il y a 1 mois', loyal:false },
];

export default function Clients() {
  const [search, setSearch] = useState('');
  const filtered = CLIENTS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:'400' }}>Clients</h1>
        <p style={{ color:'var(--gray)', fontSize:'14px', marginTop:'4px' }}>{CLIENTS.length} clients · {CLIENTS.filter(c=>c.loyal).length} fidèles</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
        {[
          { label:'Clients actifs', value:'48', sub:'Ce mois-ci' },
          { label:'Panier moyen', value:'€382', sub:'Par client' },
          { label:'Taux de fidélisation', value:'68%', sub:'+5% vs mois dernier' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize:'28px' }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
          <input className="input-field" placeholder="🔍 Rechercher un client…" value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth:'300px' }} />
        </div>
        <table className="table">
          <thead><tr><th>Client</th><th>Email</th><th>Commandes</th><th>Total dépensé</th><th>Dernière commande</th><th>Profil</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id}>
                <td>
                  <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'var(--gold-light)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'15px', color:'var(--gold-dark)', flexShrink:0 }}>
                      {c.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span style={{ fontWeight:'500' }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ color:'var(--gray)', fontSize:'13px' }}>{c.email}</td>
                <td style={{ fontWeight:'500' }}>{c.orders}</td>
                <td style={{ fontWeight:'600' }}>€{c.total.toLocaleString('fr-FR')}</td>
                <td style={{ color:'var(--gray)', fontSize:'13px' }}>{c.lastOrder}</td>
                <td><span className={`badge ${c.loyal ? 'badge-gold' : 'badge-gray'}`}>{c.loyal ? '⭐ Fidèle' : 'Nouveau'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
