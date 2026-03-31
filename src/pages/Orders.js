import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ALL_ORDERS = [
  { ref:'#LV-00248', client:'Sophie Martin', phone:'06 12 34 56 78', items:[{emoji:'👗',name:'Robe Midi Fleurie',size:'S',qty:1,price:490}], total:490, status:'pending', address:'42 Av. Montaigne, 75008 Paris', time:'14:32', date:"Aujourd'hui" },
  { ref:'#LV-00247', client:'Camille Dupont', phone:'06 23 45 67 89', items:[{emoji:'🥼',name:'Blazer Structuré',size:'M',qty:1,price:295},{emoji:'👜',name:'Ceinture Cuir',size:null,qty:1,price:89}], total:384, status:'preparing', address:'18 Rue du Faubourg, 75008 Paris', time:'14:10', date:"Aujourd'hui" },
  { ref:'#LV-00246', client:'Marie Laurent', phone:'06 34 56 78 90', items:[{emoji:'🧥',name:'Trench Camel',size:'M',qty:1,price:890}], total:890, status:'transit', address:'7 Place Vendôme, 75001 Paris', time:'13:45', date:"Aujourd'hui" },
  { ref:'#LV-00245', client:'Julie Petit', phone:'06 45 67 89 01', items:[{emoji:'👗',name:'Robe Midi Fleurie',size:'XS',qty:2,price:490}], total:980, status:'delivered', address:'23 Bd Haussmann, 75009 Paris', time:'12:20', date:"Aujourd'hui" },
  { ref:'#LV-00244', client:'Emma Bernard', phone:'06 56 78 90 12', items:[{emoji:'👠',name:'Mules Cuir Beige',size:'38',qty:1,price:650}], total:650, status:'delivered', address:'55 Rue de Rivoli, 75001 Paris', time:'11:05', date:"Aujourd'hui" },
];

const STATUS_CONFIG = {
  pending:   { label:'En attente',     cls:'badge-warning', next:'preparing', nextLabel:'Commencer préparation' },
  preparing: { label:'En préparation', cls:'badge-info',    next:'transit',   nextLabel:'Confier au livreur' },
  transit:   { label:'En livraison',   cls:'badge-info',    next:'delivered', nextLabel:'Marquer comme livré' },
  delivered: { label:'Livrée',         cls:'badge-success', next:null,        nextLabel:null },
};

export default function Orders() {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.ref.includes(search) || o.client.toLowerCase().includes(search.toLowerCase()));

  const advanceStatus = (ref) => {
    setOrders(prev => prev.map(o => {
      if (o.ref !== ref) return o;
      const next = STATUS_CONFIG[o.status]?.next;
      if (!next) return o;
      toast.success(`Commande ${ref} → ${STATUS_CONFIG[next].label}`);
      return { ...o, status: next };
    }));
    if (selected?.ref === ref) setSelected(prev => ({ ...prev, status: STATUS_CONFIG[prev.status]?.next }));
  };

  const TABS = [['all','Toutes',orders.length],['pending','En attente',orders.filter(o=>o.status==='pending').length],['preparing','En préparation',orders.filter(o=>o.status==='preparing').length],['transit','En livraison',orders.filter(o=>o.status==='transit').length],['delivered','Livrées',orders.filter(o=>o.status==='delivered').length]];

  return (
    <div className="page" style={{ display:'flex', gap:'24px', height:'calc(100vh - 64px)' }}>
      {/* List */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ marginBottom:'24px' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:'400', marginBottom:'4px' }}>Commandes</h1>
          <p style={{ color:'var(--gray)', fontSize:'14px' }}>Gérez et suivez vos commandes en temps réel</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0', borderBottom:'1px solid rgba(0,0,0,0.08)', marginBottom:'20px' }}>
          {TABS.map(([val,label,count]) => (
            <button key={val} onClick={()=>setFilter(val)} style={{
              padding:'10px 18px', background:'none', border:'none',
              borderBottom: filter===val ? '2px solid var(--gold)' : '2px solid transparent',
              color: filter===val ? 'var(--noir)' : 'var(--gray)',
              fontWeight: filter===val ? '500' : '400',
              fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-body)',
              display:'flex', gap:'6px', alignItems:'center',
            }}>
              {label}
              {count > 0 && <span style={{ background: filter===val ? 'var(--gold)' : 'rgba(0,0,0,0.08)', color: filter===val ? 'var(--noir)' : 'var(--gray)', fontSize:'11px', fontWeight:'600', padding:'1px 7px', borderRadius:'10px' }}>{count}</span>}
            </button>
          ))}
        </div>

        {/* Search */}
        <input className="input-field" placeholder="🔍 Rechercher par ref ou client…" value={search} onChange={e=>setSearch(e.target.value)} style={{ marginBottom:'16px', maxWidth:'360px' }} />

        {/* Table */}
        <div className="card" style={{ padding:0, overflow:'hidden', flex:1, overflowY:'auto' }}>
          <table className="table">
            <thead style={{ position:'sticky', top:0, background:'var(--white)', zIndex:1 }}>
              <tr><th>Référence</th><th>Client</th><th>Articles</th><th>Total</th><th>Statut</th><th>Heure</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const st = STATUS_CONFIG[o.status];
                return (
                  <tr key={o.ref} onClick={()=>setSelected(o)} style={{ cursor:'pointer', background: selected?.ref===o.ref ? 'rgba(201,169,110,0.05)' : 'transparent' }}>
                    <td style={{ fontWeight:'600', fontFamily:'monospace', fontSize:'13px', color:'var(--gold)' }}>{o.ref}</td>
                    <td style={{ fontWeight:'500' }}>{o.client}</td>
                    <td style={{ color:'var(--gray)', fontSize:'13px' }}>{o.items.map(i=>`${i.emoji} ${i.name}`).join(', ')}</td>
                    <td style={{ fontWeight:'600' }}>€{o.total}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td style={{ color:'var(--gray)', fontSize:'12px' }}>{o.time}</td>
                    <td>
                      {st.next && <button className="btn-primary" style={{ padding:'6px 12px', fontSize:'12px' }} onClick={e=>{e.stopPropagation();advanceStatus(o.ref);}}>
                        {st.nextLabel}
                      </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px', color:'var(--gray)' }}>
              <div style={{ fontSize:'36px', marginBottom:'12px' }}>📭</div>
              <p>Aucune commande dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width:'340px', flexShrink:0, display:'flex', flexDirection:'column', gap:'14px' }}>
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:'400' }}>{selected.ref}</h3>
              <button onClick={()=>setSelected(null)} style={{ fontSize:'18px', color:'var(--gray)', cursor:'pointer' }}>×</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ background:'var(--white-2)', borderRadius:'var(--radius-md)', padding:'12px' }}>
                <div style={{ fontSize:'12px', color:'var(--gray)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Client</div>
                <div style={{ fontWeight:'500' }}>{selected.client}</div>
                <div style={{ fontSize:'13px', color:'var(--gray)' }}>{selected.phone}</div>
              </div>
              <div style={{ background:'var(--white-2)', borderRadius:'var(--radius-md)', padding:'12px' }}>
                <div style={{ fontSize:'12px', color:'var(--gray)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Adresse de livraison</div>
                <div style={{ fontSize:'14px' }}>📍 {selected.address}</div>
              </div>
              <div>
                <div style={{ fontSize:'12px', color:'var(--gray)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Articles</div>
                {selected.items.map((item,i) => (
                  <div key={i} style={{ display:'flex', gap:'10px', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize:'24px' }}>{item.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'14px', fontWeight:'500' }}>{item.name}</div>
                      {item.size && <div style={{ fontSize:'12px', color:'var(--gray)' }}>Taille {item.size} · ×{item.qty}</div>}
                    </div>
                    <div style={{ fontWeight:'500' }}>€{item.price * item.qty}</div>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'600', fontSize:'16px', marginTop:'12px', paddingTop:'8px', borderTop:'1px solid rgba(0,0,0,0.08)' }}>
                  <span>Total</span><span>€{selected.total}</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginTop:'4px' }}>
                {STATUS_CONFIG[selected.status]?.next && (
                  <button className="btn-primary" style={{ width:'100%', padding:'12px' }} onClick={()=>advanceStatus(selected.ref)}>
                    ✓ {STATUS_CONFIG[selected.status]?.nextLabel}
                  </button>
                )}
                <button className="btn-outline" style={{ width:'100%', padding:'12px', fontSize:'13px' }}>
                  📞 Appeler le client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
