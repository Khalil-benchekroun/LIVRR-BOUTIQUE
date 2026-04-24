import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const PERIODES = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "3m", label: "3 mois" },
  { key: "6m", label: "6 mois" },
  { key: "1an", label: "1 an" },
];

const genCA = (weeks, base, variance) =>
  Array.from({ length: weeks }, (_, i) => ({
    label: `S${i + 1}`,
    ca: Math.round(base + (Math.random() - 0.4) * variance),
    caPrec: Math.round(base * 0.85 + (Math.random() - 0.4) * variance * 0.8),
  }));

const DATA_MAP = {
  "7j": genCA(7, 1200, 600),
  "30j": genCA(4, 8200, 3000),
  "3m": genCA(12, 8200, 3000),
  "6m": genCA(24, 8200, 4000),
  "1an": genCA(52, 8200, 4000),
};

const HEURES_POINTE = [
  { h: "9h", commandes: 2 }, { h: "10h", commandes: 5 },
  { h: "11h", commandes: 8 }, { h: "12h", commandes: 12 },
  { h: "13h", commandes: 9 }, { h: "14h", commandes: 14 },
  { h: "15h", commandes: 11 }, { h: "16h", commandes: 16 },
  { h: "17h", commandes: 20 }, { h: "18h", commandes: 18 },
  { h: "19h", commandes: 10 }, { h: "20h", commandes: 4 },
];

const QUALITE_COMMANDES = [
  { mois: "Nov", livrees: 287, refusees: 12, annulees: 8, retard: 15 },
  { mois: "Déc", livrees: 341, refusees: 18, annulees: 11, retard: 22 },
  { mois: "Jan", livrees: 298, refusees: 9, annulees: 6, retard: 18 },
  { mois: "Fév", livrees: 312, refusees: 14, annulees: 9, retard: 12 },
  { mois: "Mar", livrees: 356, refusees: 11, annulees: 7, retard: 10 },
  { mois: "Avr", livrees: 389, refusees: 8, annulees: 5, retard: 8 },
];

const TAUX_QUALITE = {
  refusees: { count: 72, pct: "3.2%", trend: "-0.8%", up: true },
  annulees: { count: 46, pct: "2.1%", trend: "-0.3%", up: true },
  retard:   { count: 85, pct: "3.8%", trend: "-1.2%", up: true },
};

const TOP_PRODUITS = [
  { name: "Robe Midi Fleurie", ca: 14800, ventes: 32, growth: "+18%", up: true },
  { name: "Trench Camel", ca: 11200, ventes: 14, growth: "+7%", up: true },
  { name: "Parfum Oud 50ml", ca: 8400, ventes: 28, growth: "+22%", up: true },
  { name: "Blazer Structuré", ca: 5900, ventes: 21, growth: "-3%", up: false },
  { name: "Sérum Éclat Visage", ca: 5200, ventes: 26, growth: "+11%", up: true },
];

const CLIENTS_ACTIFS = [
  { mois: "Nov", nouveaux: 18, recurrents: 32 },
  { mois: "Déc", nouveaux: 24, recurrents: 41 },
  { mois: "Jan", nouveaux: 31, recurrents: 38 },
  { mois: "Fév", nouveaux: 28, recurrents: 45 },
  { mois: "Mar", nouveaux: 35, recurrents: 52 },
  { mois: "Avr", nouveaux: 22, recurrents: 48 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid rgba(0,0,0,0.08)", borderRadius:"10px", padding:"12px 16px", boxShadow:"0 8px 24px rgba(0,0,0,0.1)", fontFamily:"var(--font-body)" }}>
      <div style={{ fontSize:"11px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--gray)", marginBottom:"8px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:p.color }} />
          <span style={{ fontSize:"13px", color:"var(--noir)" }}>{p.name} : <strong>{typeof p.value==="number"&&p.value>999?p.value.toLocaleString("fr-FR")+" €":p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

function StatCard({ label, value, sub, trend, prefix="" }) {
  const isUp = trend?.startsWith("+");
  return (
    <div className="card" style={{ padding:"24px 28px" }}>
      <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.12em", color:"#aaa", marginBottom:"14px" }}>{label}</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"40px", fontWeight:"300", color:"var(--noir)", lineHeight:1, marginBottom:"10px" }}>{prefix}{value}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"var(--gray)" }}>{sub}</span>
        {trend && <span style={{ fontSize:"11px", fontWeight:"700", color:isUp?"#10B981":"#EF4444" }}>{trend} vs période préc.</span>}
      </div>
    </div>
  );
}

// ── Export CSV Stats ──
const exportStats = (data, totalCA, caNet, commission, periode) => {
  const dateStr = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
  const sep = ";";
  const lines = [
    "RAPPORT STATISTIQUES LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr}`,
    "",
    "=== KPIs ===",
    `Indicateur${sep}Valeur`,
    `CA Brut total${sep}${totalCA.toLocaleString("fr-FR")} €`,
    `CA Net boutique${sep}${caNet.toLocaleString("fr-FR")} €`,
    `Commission LIVRR (20%)${sep}${commission.toLocaleString("fr-FR")} €`,
    `Panier moyen${sep}292 €`,
    `Commandes refusées${sep}72 (3.2%)`,
    `Commandes annulées${sep}46 (2.1%)`,
    `Commandes en retard${sep}85 (3.8%)`,
    `Note moyenne boutique${sep}4.8/5`,
    `Délai moyen livraison${sep}42 min`,
    "",
    "=== CA PAR SEMAINE ===",
    `Période${sep}CA Brut${sep}CA Période Préc.`,
    ...data.map(d => `${d.label}${sep}${d.ca} €${sep}${d.caPrec} €`),
    "",
    "=== TOP PRODUITS ===",
    `Produit${sep}CA${sep}Ventes${sep}Tendance`,
    ...TOP_PRODUITS.map(p => `${p.name}${sep}${p.ca} €${sep}${p.ventes}${sep}${p.growth}`),
    "",
    "=== QUALITÉ COMMANDES ===",
    `Mois${sep}Livrées${sep}Refusées${sep}Annulées${sep}En retard`,
    ...QUALITE_COMMANDES.map(q => `${q.mois}${sep}${q.livrees}${sep}${q.refusees}${sep}${q.annulees}${sep}${q.retard}`),
  ];
  const csv = lines.join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rapport_stats_${periode}_${dateStr}.csv`;
  a.click();
};

export default function Stats() {
  const [periode, setPeriode] = useState("30j");
  const [activeTab, setActiveTab] = useState("ca");
  const data = DATA_MAP[periode];

  const totalCA = data.reduce((s, d) => s + d.ca, 0);
  const totalPrec = data.reduce((s, d) => s + d.caPrec, 0);
  const diffPct = Math.round(((totalCA - totalPrec) / totalPrec) * 100);
  const commission = Math.round(totalCA * 0.2);
  const caNet = totalCA - commission;

  const TAB = { borderBottom:"2px solid transparent", padding:"10px 0", marginRight:"28px", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"13px", fontWeight:"600", letterSpacing:"0.04em", transition:"all 0.2s" };

  return (
    <div className="page" style={{ padding:"44px 52px" }}>
      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"40px" }}>
        <div>
          <div style={{ fontSize:"11px", fontWeight:"700", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gray)", marginBottom:"8px" }}>Statistiques</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"44px", fontWeight:"300", lineHeight:1.1 }}>Performances</h1>
        </div>
        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          {/* ── Bouton Export ── */}
          <button
            className="btn-outline"
            style={{ fontSize:"12px", padding:"10px 18px", display:"flex", alignItems:"center", gap:"6px" }}
            onClick={() => exportStats(data, totalCA, caNet, commission, periode)}
          >
            ↓ Exporter les stats
          </button>
          {/* Sélecteur de période */}
          <div style={{ display:"flex", gap:"4px", padding:"4px", background:"rgba(0,0,0,0.04)", borderRadius:"10px" }}>
            {PERIODES.map((p) => (
              <button key={p.key} onClick={() => setPeriode(p.key)}
                style={{ padding:"8px 16px", borderRadius:"7px", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:"600", fontFamily:"var(--font-body)", transition:"all 0.2s",
                  background:periode===p.key?"#fff":"transparent", color:periode===p.key?"var(--noir)":"var(--gray)",
                  boxShadow:periode===p.key?"0 2px 8px rgba(0,0,0,0.08)":"none" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", background:"rgba(0,0,0,0.07)", marginBottom:"36px", borderRadius:"2px", overflow:"hidden" }}>
        <StatCard label="CA Brut" value={totalCA.toLocaleString("fr-FR")} sub="Commission LIVRR 20% incluse" trend={`${diffPct>0?"+":""}${diffPct}%`} />
        <StatCard label="CA Net boutique" value={caNet.toLocaleString("fr-FR")} sub="Après déduction commission" trend={`${diffPct>0?"+":""}${diffPct}%`} />
        <StatCard label="Commission LIVRR" value={commission.toLocaleString("fr-FR")} sub="20% du CA brut" trend={null} />
        <StatCard label="Panier moyen" value="292" sub="par commande" trend="+4%" />
      </div>

      {/* TABS */}
      <div style={{ borderBottom:"1px solid rgba(0,0,0,0.07)", marginBottom:"28px" }}>
        {[
          { key:"ca", label:"Chiffre d'affaires" },
          { key:"clients", label:"Clients actifs" },
          { key:"pointe", label:"Heures de pointe" },
          { key:"qualite", label:"Qualité commandes" },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ ...TAB, borderBottom:`2px solid ${activeTab===t.key?"var(--gold)":"transparent"}`, color:activeTab===t.key?"var(--noir)":"var(--gray)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* GRAPHIQUE CA */}
      {activeTab === "ca" && (
        <div className="card" style={{ marginBottom:"28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
            <div>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Évolution du chiffre d'affaires</h3>
              <p style={{ fontSize:"12px", color:"var(--gray)", marginTop:"2px" }}>CA brut vs période précédente</p>
            </div>
            <div style={{ display:"flex", gap:"16px", fontSize:"11px", fontWeight:"600" }}>
              <span style={{ display:"flex", alignItems:"center", gap:"6px" }}><span style={{ width:"10px", height:"2px", background:"#C9A96E", display:"inline-block" }} />Cette période</span>
              <span style={{ display:"flex", alignItems:"center", gap:"6px" }}><span style={{ width:"10px", height:"2px", background:"#E5E7EB", display:"inline-block" }} />Période préc.</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top:4, right:4, bottom:0, left:0 }}>
              <defs>
                <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPrec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} tickFormatter={v => v.toLocaleString("fr-FR")+"€"} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="caPrec" name="Période préc." stroke="#E5E7EB" strokeWidth={2} fill="url(#gradPrec)" dot={false} />
              <Area type="monotone" dataKey="ca" name="Cette période" stroke="#C9A96E" strokeWidth={2.5} fill="url(#gradCA)" dot={false} activeDot={{ r:5, fill:"#C9A96E", strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* GRAPHIQUE CLIENTS */}
      {activeTab === "clients" && (
        <div className="card" style={{ marginBottom:"28px" }}>
          <div style={{ marginBottom:"24px" }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Clients actifs par mois</h3>
            <p style={{ fontSize:"12px", color:"var(--gray)", marginTop:"2px" }}>Nouveaux clients vs clients récurrents</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={CLIENTS_ACTIFS} margin={{ top:4, right:4, bottom:0, left:0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="nouveaux" name="Nouveaux clients" fill="#C9A96E" radius={[4,4,0,0]} />
              <Bar dataKey="recurrents" name="Clients récurrents" fill="#0A0A0F" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* GRAPHIQUE HEURES DE POINTE */}
      {activeTab === "pointe" && (
        <div className="card" style={{ marginBottom:"28px" }}>
          <div style={{ marginBottom:"24px" }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Heures de pointe</h3>
            <p style={{ fontSize:"12px", color:"var(--gray)", marginTop:"2px" }}>Commandes reçues par heure sur la période</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={HEURES_POINTE} margin={{ top:4, right:4, bottom:0, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="h" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="commandes" name="Commandes" fill="#C9A96E" radius={[4,4,0,0]} label={{ position:"top", fontSize:10, fill:"#aaa" }} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:"16px", padding:"12px 16px", background:"rgba(201,169,110,0.06)", borderRadius:"8px", fontSize:"13px", color:"var(--gray)" }}>
            💡 Pic d'activité entre <strong style={{ color:"var(--noir)" }}>17h et 18h</strong> — assurez-vous d'avoir votre équipe au complet à ces heures.
          </div>
        </div>
      )}

      {/* GRAPHIQUE QUALITE */}
      {activeTab === "qualite" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"24px", marginBottom:"28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
            {[
              { label:"Commandes refusées", key:"refusees", icon:"✕", color:"var(--error)", bg:"var(--error-bg)", desc:"Rupture stock, hors zone, délai impossible" },
              { label:"Commandes annulées", key:"annulees", icon:"◌", color:"var(--warning)", bg:"var(--warning-bg)", desc:"Annulées après acceptation" },
              { label:"Commandes en retard", key:"retard", icon:"⏱", color:"var(--info)", bg:"var(--info-bg)", desc:"Délai de livraison dépassé" },
            ].map(s => {
              const d = TAUX_QUALITE[s.key];
              return (
                <div key={s.key} className="card" style={{ padding:"20px 24px", borderLeft:`3px solid ${s.color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div>
                      <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--gray)", marginBottom:"4px" }}>{s.label}</div>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:"36px", fontWeight:"300", color:s.color, lineHeight:1 }}>{d.count}</div>
                    </div>
                    <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", color:s.color }}>{s.icon}</div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"12px", color:"var(--gray)" }}>{d.pct} des commandes</span>
                    <span style={{ fontSize:"11px", fontWeight:"700", color:"#10B981" }}>↓ {d.trend}</span>
                  </div>
                  <div style={{ marginTop:"8px", fontSize:"11px", color:"var(--gray)", fontStyle:"italic" }}>{s.desc}</div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div style={{ marginBottom:"20px" }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Évolution de la qualité</h3>
              <p style={{ fontSize:"12px", color:"var(--gray)", marginTop:"2px" }}>Commandes refusées, annulées et en retard par mois</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={QUALITE_COMMANDES} margin={{ top:4, right:4, bottom:0, left:0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="refusees" name="Refusées" fill="#EF4444" radius={[4,4,0,0]} />
                <Bar dataKey="annulees" name="Annulées" fill="#F59E0B" radius={[4,4,0,0]} />
                <Bar dataKey="retard" name="En retard" fill="#3B82F6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"20px", fontWeight:"400" }}>Motifs de refus & annulation</h3>
            </div>
            <table className="table">
              <thead><tr><th>Motif</th><th>Type</th><th>Occurrences</th><th>Impact CA perdu</th><th>Tendance</th></tr></thead>
              <tbody>
                {[
                  { motif:"Rupture de stock", type:"Refus", count:28, ca:"8 400 €", trend:"-12%", up:true },
                  { motif:"Hors zone de livraison", type:"Refus", count:19, ca:"5 700 €", trend:"-5%", up:true },
                  { motif:"Délai impossible", type:"Refus", count:14, ca:"4 200 €", trend:"+2%", up:false },
                  { motif:"Produit introuvable", type:"Annulation", count:22, ca:"6 600 €", trend:"-8%", up:true },
                  { motif:"Erreur de commande", type:"Annulation", count:15, ca:"4 500 €", trend:"-3%", up:true },
                  { motif:"Coursier indisponible", type:"Retard", count:42, ca:"—", trend:"-15%", up:true },
                ].map((row,i) => (
                  <tr key={i}>
                    <td style={{ fontWeight:"600" }}>{row.motif}</td>
                    <td><span style={{ padding:"2px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"700", background:row.type==="Refus"?"var(--error-bg)":row.type==="Annulation"?"var(--warning-bg)":"var(--info-bg)", color:row.type==="Refus"?"var(--error)":row.type==="Annulation"?"var(--warning)":"var(--info)" }}>{row.type}</span></td>
                    <td style={{ fontWeight:"700" }}>{row.count}</td>
                    <td style={{ color:"var(--error)", fontWeight:"600" }}>{row.ca}</td>
                    <td><span style={{ fontSize:"12px", fontWeight:"700", color:row.up?"#10B981":"#EF4444" }}>{row.up?"↓":"↑"} {row.trend}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOP PRODUITS + STATS RAPIDES */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"24px" }}>
        <div className="card" style={{ padding:0, overflow:"hidden" }}>
          <div style={{ padding:"20px 24px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Top produits</h3>
            <p style={{ fontSize:"12px", color:"var(--gray)", marginTop:"2px" }}>Par chiffre d'affaires sur la période</p>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(0,0,0,0.02)" }}>
                {["#","Produit","CA","Ventes","Tendance"].map(h => (
                  <th key={h} style={{ padding:"11px 20px", textAlign:"left", fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", color:"#bbb", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUITS.map((p,i) => (
                <tr key={p.name} style={{ borderBottom:"1px solid rgba(0,0,0,0.04)", transition:"background 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#FAFAF8"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"16px 20px", fontFamily:"var(--font-display)", fontSize:"18px", color:"#ddd", fontWeight:"300" }}>{String(i+1).padStart(2,"0")}</td>
                  <td style={{ padding:"16px 20px", fontWeight:"600", fontSize:"13px" }}>{p.name}</td>
                  <td style={{ padding:"16px 20px", fontFamily:"var(--font-display)", fontSize:"16px" }}>{p.ca.toLocaleString("fr-FR")} €</td>
                  <td style={{ padding:"16px 20px", fontSize:"13px", color:"var(--gray)" }}>{p.ventes} vendus</td>
                  <td style={{ padding:"16px 20px" }}>
                    <span style={{ fontSize:"12px", fontWeight:"700", color:p.up?"#10B981":"#EF4444", background:p.up?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)", padding:"3px 10px", borderRadius:"20px" }}>
                      {p.up?"↑":"↓"} {p.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {[
            { label:"Commandes totales", value:`${Math.round(data.length*28)}`, icon:"📦", sub:"sur la période" },
            { label:"Commandes refusées", value:"72", icon:"✕", sub:"3.2% — ↓ vs période préc.", color:"var(--error)" },
            { label:"Commandes annulées", value:"46", icon:"◌", sub:"2.1% — ↓ vs période préc.", color:"var(--warning)" },
            { label:"Commandes en retard", value:"85", icon:"⏱", sub:"3.8% — ↓ vs période préc.", color:"var(--info)" },
            { label:"Taux de conversion", value:"4.2%", icon:"📈", sub:"+0.3% vs période préc." },
            { label:"Nouveaux clients", value:"87", icon:"👤", sub:"sur la période" },
            { label:"Taux de fidélisation", value:"38%", icon:"❤️", sub:"clients récurrents" },
            { label:"Note moyenne boutique", value:"4.8★", icon:"⭐", sub:"sur 248 avis" },
            { label:"Délai moyen livraison", value:"42 min", icon:"🛵", sub:"objectif < 60 min ✓" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:"16px 20px", display:"flex", gap:"14px", alignItems:"center" }}>
              <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:"rgba(201,169,110,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--gray)", marginBottom:"3px" }}>{s.label}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"300", color:s.color||"var(--noir)" }}>{s.value}</div>
                <div style={{ fontSize:"11px", color:"var(--gray)", marginTop:"1px" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
