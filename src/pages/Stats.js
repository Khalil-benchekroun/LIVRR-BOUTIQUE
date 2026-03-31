import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const REVENUE_DATA = [
  { day:'Lun', revenue:3200, orders:8 },
  { day:'Mar', revenue:4800, orders:12 },
  { day:'Mer', revenue:3900, orders:9 },
  { day:'Jeu', revenue:6200, orders:15 },
  { day:'Ven', revenue:8400, orders:21 },
  { day:'Sam', revenue:11200, orders:28 },
  { day:'Dim', revenue:5600, orders:14 },
];

const MONTHLY = [
  { month:'Juil', revenue:62000 },
  { month:'Août', revenue:48000 },
  { month:'Sep', revenue:71000 },
  { month:'Oct', revenue:85000 },
  { month:'Nov', revenue:92000 },
  { month:'Déc', revenue:89420 },
];

const CAT_DATA = [
  { name:'Vêtements', value:52, color:'#C9A96E' },
  { name:'Accessoires', value:24, color:'#0A0A0F' },
  { name:'Chaussures', value:14, color:'#6B6878' },
  { name:'Beauté', value:10, color:'#E8D5B0' },
];

const TOP_PRODUCTS = [
  { emoji:'👗', name:'Robe Midi Fleurie', sales:48, revenue:23520 },
  { emoji:'🧥', name:'Trench Camel', sales:31, revenue:27590 },
  { emoji:'🥼', name:'Blazer Structuré', sales:27, revenue:7965 },
  { emoji:'👒', name:'Chapeau Panama', sales:22, revenue:4158 },
  { emoji:'👛', name:'Pochette Satin', sales:18, revenue:4410 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--noir)', color:'var(--white)', padding:'10px 14px', borderRadius:'10px', fontSize:'13px' }}>
      <div style={{ fontWeight:'500', marginBottom:'4px' }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:'var(--gold)' }}>{p.name}: {p.name === 'revenue' ? '€' : ''}{p.value.toLocaleString('fr-FR')}</div>)}
    </div>
  );
};

export default function Stats() {
  const [period, setPeriod] = useState('week');

  const data = period === 'week' ? REVENUE_DATA : MONTHLY;
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = period === 'week' ? data.reduce((s, d) => s + (d.orders || 0), 0) : 248;

  return (
    <div className="page">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:'400' }}>Statistiques</h1>
          <p style={{ color:'var(--gray)', fontSize:'14px', marginTop:'4px' }}>Analyse de vos performances</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          {[['week','7 jours'],['month','6 mois']].map(([v,l]) => (
            <button key={v} onClick={()=>setPeriod(v)} style={{
              padding:'8px 18px', borderRadius:'var(--radius-md)', fontSize:'13px', cursor:'pointer', fontFamily:'var(--font-body)', border:'none',
              background: period===v ? 'var(--noir)' : 'var(--white)',
              color: period===v ? 'var(--white)' : 'var(--gray)',
              fontWeight: period===v ? '500' : '400',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        {[
          { label:'Chiffre d\'affaires', value:`€${totalRevenue.toLocaleString('fr-FR')}`, sub:'+18% vs période précédente', up:true },
          { label:'Commandes', value:totalOrders, sub:'+12% vs période précédente', up:true },
          { label:'Panier moyen', value:`€${Math.round(totalRevenue/totalOrders)}`, sub:'+5% vs période précédente', up:true },
          { label:'Taux de retour', value:'2.4%', sub:'-0.3% vs période précédente', up:false },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <div className="stat-label">{k.label}</div>
            <div className="stat-value" style={{ fontSize:'26px' }}>{k.value}</div>
            <div className={k.up ? 'stat-trend-up' : 'stat-trend-down'} style={{ fontSize:'12px', marginTop:'6px' }}>
              {k.up ? '↑' : '↓'} {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
        {/* Revenue chart */}
        <div className="card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:'400', marginBottom:'20px' }}>
            Chiffre d'affaires — {period === 'week' ? '7 derniers jours' : '6 derniers mois'}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey={period === 'week' ? 'day' : 'month'} tick={{ fontSize:12, fill:'#6B6878' }} />
              <YAxis tick={{ fontSize:12, fill:'#6B6878' }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="revenue" stroke="#C9A96E" strokeWidth={2.5} dot={{ fill:'#C9A96E', r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders chart */}
        <div className="card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:'400', marginBottom:'20px' }}>Commandes par jour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize:12, fill:'#6B6878' }} />
              <YAxis tick={{ fontSize:12, fill:'#6B6878' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="orders" fill="#0A0A0F" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px' }}>
        {/* Top products */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:'400' }}>Top produits</h3>
          </div>
          <table className="table">
            <thead><tr><th>Produit</th><th>Ventes</th><th>Revenus</th><th>Tendance</th></tr></thead>
            <tbody>
              {TOP_PRODUCTS.map((p,i) => (
                <tr key={p.name}>
                  <td>
                    <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                      <span style={{ fontSize:'11px', fontWeight:'700', color:'var(--gold)', width:'16px' }}>#{i+1}</span>
                      <span style={{ fontSize:'20px' }}>{p.emoji}</span>
                      <span style={{ fontWeight:'500' }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.sales} vendus</td>
                  <td style={{ fontWeight:'600' }}>€{p.revenue.toLocaleString('fr-FR')}</td>
                  <td>
                    <div style={{ width:'80px', background:'rgba(0,0,0,0.06)', borderRadius:'4px', height:'6px' }}>
                      <div style={{ background:'var(--gold)', height:'6px', borderRadius:'4px', width:`${(p.sales/48)*100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category pie */}
        <div className="card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:'400', marginBottom:'20px' }}>Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {CAT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginTop:'12px' }}>
            {CAT_DATA.map(c => (
              <div key={c.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'13px' }}>
                <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:c.color, flexShrink:0 }} />
                  <span>{c.name}</span>
                </div>
                <span style={{ fontWeight:'600' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
