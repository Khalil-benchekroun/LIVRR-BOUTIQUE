import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { boutique } = useAuth();
  const [hours, setHours] = useState({ lun:'10:00 - 19:00', sam:'10:00 - 20:00', dim:'Fermé' });
  const [notifs, setNotifs] = useState({ newOrder:true, lowStock:true, payment:true, reviews:false });

  return (
    <div className="page" style={{ maxWidth:'760px' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:'400', marginBottom:'32px' }}>Paramètres</h1>

      {/* Boutique info */}
      <div className="card" style={{ marginBottom:'20px' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:'400', marginBottom:'20px' }}>Informations de la boutique</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[['Nom de la boutique', boutique?.name], ['Email', boutique?.email]].map(([l,v]) => (
              <div key={l}>
                <label className="label">{l}</label>
                <input className="input-field" defaultValue={v} />
              </div>
            ))}
          </div>
          <div>
            <label className="label">Adresse</label>
            <input className="input-field" defaultValue={boutique?.address} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field" rows={3} style={{ resize:'none' }} defaultValue="Boutique de mode parisienne proposant les dernières tendances en livraison express." />
          </div>
          <button className="btn-primary" style={{ alignSelf:'flex-start' }} onClick={()=>toast.success('Informations sauvegardées')}>Enregistrer</button>
        </div>
      </div>

      {/* Opening hours */}
      <div className="card" style={{ marginBottom:'20px' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:'400', marginBottom:'20px' }}>Horaires d'ouverture</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {[['lun','Lundi – Vendredi'],['sam','Samedi'],['dim','Dimanche']].map(([k,l]) => (
            <div key={k} style={{ display:'flex', gap:'16px', alignItems:'center' }}>
              <span style={{ width:'140px', fontSize:'14px', color:'var(--gray)' }}>{l}</span>
              <input className="input-field" value={hours[k]} onChange={e=>setHours(p=>({...p,[k]:e.target.value}))} style={{ flex:1 }} />
            </div>
          ))}
          <button className="btn-primary" style={{ alignSelf:'flex-start', marginTop:'8px' }} onClick={()=>toast.success('Horaires sauvegardés')}>Enregistrer</button>
        </div>
      </div>

      {/* Payment */}
      <div className="card" style={{ marginBottom:'20px' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:'400', marginBottom:'8px' }}>Paiements & IBAN</h3>
        <p style={{ color:'var(--gray)', fontSize:'14px', marginBottom:'20px' }}>Les versements sont effectués sous 7 jours ouvrés</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div>
            <label className="label">IBAN</label>
            <input className="input-field" defaultValue="FR76 •••• •••• •••• •••• •••• •••" type="password" />
          </div>
          <div>
            <label className="label">Délai de paiement préféré</label>
            <select className="input-field">
              <option>7 jours ouvrés (par défaut)</option>
              <option>14 jours ouvrés</option>
              <option>30 jours</option>
            </select>
          </div>
          <button className="btn-primary" style={{ alignSelf:'flex-start' }} onClick={()=>toast.success('IBAN mis à jour')}>Enregistrer</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:'400', marginBottom:'20px' }}>Notifications</h3>
        {[
          ['newOrder','Nouvelle commande reçue'],
          ['lowStock','Stock faible (< 3 articles)'],
          ['payment','Virement reçu'],
          ['reviews','Nouvel avis client'],
        ].map(([k,l]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize:'14px' }}>{l}</span>
            <button onClick={()=>setNotifs(p=>({...p,[k]:!p[k]}))} style={{
              width:'44px', height:'24px', borderRadius:'12px', border:'none', cursor:'pointer',
              background: notifs[k] ? 'var(--success)' : 'rgba(0,0,0,0.15)', position:'relative', transition:'0.2s',
            }}>
              <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:'white', position:'absolute', top:'3px', transition:'0.2s', left: notifs[k] ? '23px' : '3px' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
