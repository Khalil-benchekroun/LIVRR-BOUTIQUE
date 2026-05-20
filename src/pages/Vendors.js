import React, { useState } from "react";
import toast from "react-hot-toast";

const PERMISSIONS = [
  { key:"commandes", label:"Commandes", icon:"📦", desc:"Voir et gérer les commandes" },
  { key:"pos", label:"Vente manuelle", icon:"🖊️", desc:"Enregistrer des ventes manuelles" },
  { key:"produits", label:"Produits", icon:"🛍️", desc:"Gérer le catalogue produits" },
  { key:"clients", label:"Clients", icon:"👤", desc:"Accéder à la liste clients" },
  { key:"stats", label:"Statistiques", icon:"📊", desc:"Voir les rapports et performances" },
  { key:"retours", label:"Retours", icon:"↩️", desc:"Gérer les retours commandes" },
];

const DEFAULT_PERMS = { commandes:true, pos:true, produits:false, clients:false, stats:false, retours:false };

const INITIAL_STAFF = [
  { id:1, name:"Siham B.", email:"siham@sandro.fr", role:"Manager", active:true, avatar:"S", avatarColor:"#C9A96E",
    stats:{ commandes:45, caGenere:12400, tempsMoyen:11, noteMoyenne:4.9, tauxAcceptation:98 },
    historique:[
      { date:"09/04/2026", action:"Commande ORD-8821 acceptée", montant:490 },
      { date:"08/04/2026", action:"Commande ORD-8812 préparée", montant:890 },
      { date:"07/04/2026", action:"Vente manuelle 2 articles", montant:680 },
    ],
    permissions:{ commandes:true, pos:true, produits:true, clients:true, stats:true, retours:true },
  },
  { id:2, name:"Youssef L.", email:"youssef@sandro.fr", role:"Vendeur Senior", active:true, avatar:"Y", avatarColor:"#3B82F6",
    stats:{ commandes:32, caGenere:8900, tempsMoyen:14, noteMoyenne:4.7, tauxAcceptation:94 },
    historique:[
      { date:"09/04/2026", action:"Commande ORD-8815 préparée", montant:1079 },
      { date:"08/04/2026", action:"Commande ORD-8790 livrée", montant:295 },
    ],
    permissions:{ commandes:true, pos:true, produits:false, clients:false, stats:false, retours:true },
  },
  { id:3, name:"Amine R.", email:"amine@sandro.fr", role:"Vendeur Junior", active:false, avatar:"A", avatarColor:"#8B5CF6",
    stats:{ commandes:12, caGenere:2800, tempsMoyen:18, noteMoyenne:4.5, tauxAcceptation:88 },
    historique:[{ date:"05/04/2026", action:"Commande ORD-8770 livrée", montant:680 }],
    permissions:{ ...DEFAULT_PERMS },
  },
];

const EMPTY_FORM = { name:"", email:"", role:"Vendeur Junior", password:"", permissions:{ ...DEFAULT_PERMS } };

function PercentBar({ value, max=100, color="#C9A96E" }) {
  return (
    <div style={{ height:"4px", background:"rgba(0,0,0,0.06)", borderRadius:"2px", overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${(value/max)*100}%`, background:color, borderRadius:"2px", transition:"width 0.6s ease" }} />
    </div>
  );
}

// ── Export CSV Vendeurs ──
const exportVendeurs = (staff) => {
  const dateStr = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
  const sep = ";";
  const headers = ["Vendeur","Rôle","Statut","Commandes","CA Généré (€)","Temps moyen (min)","Note client","Taux acceptation (%)"];
  const rows = staff.map(v => [
    v.name, v.role, v.active?"Actif":"Inactif",
    v.stats.commandes, v.stats.caGenere,
    v.stats.tempsMoyen, v.stats.noteMoyenne, v.stats.tauxAcceptation,
  ]);
  const csv = [headers,...rows].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(sep)).join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "performances_vendeurs_"+dateStr+".csv";
  a.click();
};

export default function Vendors() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPerms, setShowPerms] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPwd, setShowPwd] = useState(false);

  const totalCA = staff.reduce((s,v) => s + v.stats.caGenere, 0);

  const toggleActive = (id) => {
    setStaff(prev => prev.map(v => v.id===id ? {...v, active:!v.active} : v));
    const v = staff.find(v => v.id===id);
    toast(v.active ? `Accès de ${v.name} désactivé` : `Accès de ${v.name} réactivé`, { icon:v.active?"🔒":"🔓" });
  };

  const savePerm = (id, key, val) => {
    setStaff(prev => prev.map(v => v.id===id ? {...v, permissions:{...v.permissions,[key]:val}} : v));
  };

  const handleCreate = () => {
    if (!form.name||!form.email||!form.password) return toast.error("Nom, email et mot de passe requis");
    const newV = {
      id:Date.now(), ...form,
      avatar:form.name.charAt(0).toUpperCase(),
      avatarColor:["#C9A96E","#3B82F6","#10B981","#8B5CF6"][Math.floor(Math.random()*4)],
      active:true,
      stats:{commandes:0,caGenere:0,tempsMoyen:0,noteMoyenne:0,tauxAcceptation:100},
      historique:[],
    };
    setStaff(prev => [...prev, newV]);
    toast.success(`Compte créé pour ${form.name} — Email envoyé`, { icon:"✅" });
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="page" style={{ padding:"44px 52px" }}>

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"40px" }}>
        <div>
          <div style={{ fontSize:"11px", fontWeight:"700", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gray)", marginBottom:"8px" }}>Équipe</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"44px", fontWeight:"300", lineHeight:1.1 }}>Vendeurs</h1>
          <p style={{ color:"var(--gray)", fontSize:"14px", marginTop:"6px" }}>
            {staff.filter(v=>v.active).length} actif{staff.filter(v=>v.active).length>1?"s":""} · {staff.length} au total
          </p>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <button
            className="btn-outline"
            style={{ fontSize:"12px", padding:"12px 18px", display:"flex", alignItems:"center", gap:"6px" }}
            onClick={() => exportVendeurs(staff)}
          >
            ↓ Exporter performances
          </button>
          <button
            className="btn-gold"
            style={{ fontSize:"12px", padding:"12px 22px" }}
            onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }}
          >
            + Nouveau vendeur
          </button>
        </div>
      </div>

      {/* STATS GLOBALES */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", background:"rgba(0,0,0,0.07)", marginBottom:"36px", borderRadius:"2px", overflow:"hidden" }}>
        {[
          { label:"CA total équipe", value:`${totalCA.toLocaleString("fr-FR")} €`, sub:"sur la période" },
          { label:"Commandes traitées", value:staff.reduce((s,v)=>s+v.stats.commandes,0), sub:"au total" },
          { label:"Temps moyen prépa", value:`${Math.round(staff.filter(v=>v.active).reduce((s,v)=>s+v.stats.tempsMoyen,0)/Math.max(1,staff.filter(v=>v.active).length))} min`, sub:"par commande" },
          { label:"Note moyenne équipe", value:`${(staff.reduce((s,v)=>s+v.stats.noteMoyenne,0)/staff.length).toFixed(1)} ★`, sub:"satisfaction client" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", padding:"24px 28px" }}>
            <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.12em", color:"#aaa", marginBottom:"14px" }}>{s.label}</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"36px", fontWeight:"300", color:"var(--noir)", lineHeight:1, marginBottom:"8px" }}>{s.value}</div>
            <div style={{ fontSize:"12px", color:"var(--gray)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:selected?"1fr 380px":"1fr", gap:"24px" }}>

        {/* LISTE */}
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {staff.map(v => {
            const isSelected = selected?.id===v.id;
            return (
              <div key={v.id} onClick={() => setSelected(isSelected?null:v)}
                style={{ background:"#fff", borderRadius:"14px", padding:"20px 24px", border:`1.5px solid ${isSelected?"var(--gold)":"rgba(0,0,0,0.07)"}`, cursor:"pointer", transition:"all 0.2s", boxShadow:isSelected?"0 4px 20px rgba(201,169,110,0.15)":"0 1px 4px rgba(0,0,0,0.04)", opacity:v.active?1:0.6 }}>

                <div style={{ display:"flex", gap:"16px", alignItems:"flex-start", marginBottom:"18px" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:`${v.avatarColor}20`, border:`2px solid ${v.avatarColor}40`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:"20px", fontWeight:"500", color:v.avatarColor, flexShrink:0 }}>{v.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontWeight:"700", fontSize:"16px", marginBottom:"2px" }}>{v.name}</div>
                        <div style={{ fontSize:"12px", color:"var(--gray)" }}>{v.role} · {v.email}</div>
                      </div>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>toggleActive(v.id)} style={{ width:"38px", height:"21px", borderRadius:"11px", border:"none", cursor:"pointer", background:v.active?"var(--gold)":"#E5E7EB", position:"relative", transition:"background 0.3s", flexShrink:0 }}>
                          <div style={{ width:"15px", height:"15px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:v.active?"20px":"3px", transition:"left 0.3s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                        </button>
                        <span style={{ fontSize:"11px", fontWeight:"600", color:v.active?"var(--success)":"var(--gray)" }}>{v.active?"Actif":"Inactif"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
                  {[
                    { label:"Commandes", value:v.stats.commandes },
                    { label:"CA généré", value:`${v.stats.caGenere.toLocaleString("fr-FR")}€` },
                    { label:"Temps moyen", value:`${v.stats.tempsMoyen} min` },
                    { label:"Note client", value:`${v.stats.noteMoyenne} ★` },
                    { label:"Acceptation", value:`${v.stats.tauxAcceptation}%` },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize:"9px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"#bbb", marginBottom:"4px" }}>{s.label}</div>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:"400", color:"var(--noir)" }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", color:"var(--gray)", marginBottom:"4px" }}>
                    <span>Part du CA équipe</span>
                    <span>{Math.round((v.stats.caGenere/totalCA)*100)}%</span>
                  </div>
                  <PercentBar value={v.stats.caGenere} max={totalCA} color={v.avatarColor} />
                </div>

                <div style={{ display:"flex", gap:"6px", marginTop:"14px", flexWrap:"wrap" }} onClick={e=>e.stopPropagation()}>
                  {PERMISSIONS.map(p => (
                    <span key={p.key} style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight:"600", background:v.permissions[p.key]?"rgba(201,169,110,0.1)":"rgba(0,0,0,0.04)", color:v.permissions[p.key]?"var(--gold-dark)":"var(--gray)", border:v.permissions[p.key]?"1px solid rgba(201,169,110,0.25)":"1px solid transparent" }}>{p.label}</span>
                  ))}
                  <button onClick={()=>setShowPerms(v.id)} style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight:"600", background:"transparent", border:"1px dashed rgba(0,0,0,0.15)", color:"var(--gray)", cursor:"pointer", fontFamily:"var(--font-body)" }}>Modifier</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DÉTAIL */}
        {selected && (() => {
          const v = staff.find(s=>s.id===selected.id)||selected;
          return (
            <div className="card" style={{ position:"sticky", top:"20px", height:"fit-content", maxHeight:"calc(100vh-120px)", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
                <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                  <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:`${v.avatarColor}20`, border:`2px solid ${v.avatarColor}40`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:"22px", color:v.avatarColor }}>{v.avatar}</div>
                  <div><div style={{ fontWeight:"700", fontSize:"16px" }}>{v.name}</div><div style={{ fontSize:"12px", color:"var(--gray)" }}>{v.role}</div></div>
                </div>
                <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:"var(--gray)" }}>✕</button>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
                {[
                  { label:"Commandes traitées", value:v.stats.commandes, color:v.avatarColor },
                  { label:"CA généré", value:`${v.stats.caGenere.toLocaleString("fr-FR")} €`, color:v.avatarColor },
                  { label:"Temps moyen prépa", value:`${v.stats.tempsMoyen} min`, color:v.stats.tempsMoyen>15?"#EF4444":"#10B981" },
                  { label:"Taux d'acceptation", value:`${v.stats.tauxAcceptation}%`, color:v.stats.tauxAcceptation>=95?"#10B981":"#F59E0B" },
                ].map(m => (
                  <div key={m.label} style={{ padding:"14px", background:"#F8F7F4", borderRadius:"10px" }}>
                    <div style={{ fontSize:"10px", color:"var(--gray)", fontWeight:"700", textTransform:"uppercase", marginBottom:"6px" }}>{m.label}</div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:"24px", fontWeight:"300", color:m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding:"14px", background:"rgba(201,169,110,0.06)", borderRadius:"10px", marginBottom:"20px", display:"flex", gap:"12px", alignItems:"center" }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"36px", fontWeight:"300", color:"#F59E0B", lineHeight:1 }}>{v.stats.noteMoyenne}</div>
                <div>
                  <div style={{ display:"flex", gap:"2px", marginBottom:"4px" }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color:i<=Math.round(v.stats.noteMoyenne)?"#F59E0B":"#E5E7EB", fontSize:"16px" }}>★</span>)}
                  </div>
                  <div style={{ fontSize:"12px", color:"var(--gray)" }}>Note satisfaction client</div>
                </div>
              </div>

              <div style={{ marginBottom:"16px" }}>
                <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--gray)", marginBottom:"12px" }}>Activité récente</div>
                {v.historique.map((h,i) => (
                  <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"10px 0", borderBottom:i<v.historique.length-1?"1px solid rgba(0,0,0,0.05)":"none" }}>
                    <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--gold)", flexShrink:0, marginTop:"5px" }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"13px", fontWeight:"500" }}>{h.action}</div>
                      <div style={{ fontSize:"11px", color:"var(--gray)", marginTop:"2px" }}>{h.date} · {h.montant.toLocaleString("fr-FR")} €</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-outline" style={{ width:"100%", fontSize:"12px" }} onClick={()=>setShowPerms(v.id)}>Modifier les permissions</button>
            </div>
          );
        })()}
      </div>

      {/* MODAL CRÉER */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setShowModal(false)}>
          <div className="card" style={{ background:"#fff", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"480px" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:"11px", color:"var(--gold)", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" }}>Nouveau vendeur</div>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"26px", fontWeight:"400", marginBottom:"20px" }}>Créer un accès</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"20px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                <div><label className="label">Nom complet *</label><input className="input-field" placeholder="Prénom Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{ marginBottom:0 }} /></div>
                <div><label className="label">Rôle</label><select className="input-field" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{ marginBottom:0 }}><option>Manager</option><option>Vendeur Senior</option><option>Vendeur Junior</option></select></div>
              </div>
              <div><label className="label">Email *</label><input className="input-field" type="email" placeholder="prenom@boutique.fr" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{ marginBottom:0 }} /></div>
              <div>
                <label className="label">Mot de passe temporaire *</label>
                <div style={{ position:"relative" }}>
                  <input className="input-field" type={showPwd?"text":"password"} placeholder="Min. 8 caractères" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={{ marginBottom:0, paddingRight:"60px" }} />
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:"11px", color:"var(--gray)", cursor:"pointer", fontFamily:"var(--font-body)" }}>{showPwd?"Masquer":"Voir"}</button>
                </div>
              </div>
              <div>
                <label className="label" style={{ marginBottom:"8px" }}>Permissions</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
                  {PERMISSIONS.map(p => (
                    <div key={p.key} onClick={()=>setForm(f=>({...f,permissions:{...f.permissions,[p.key]:!f.permissions[p.key]}}))}
                      style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"8px", cursor:"pointer", transition:"all 0.15s", border:`1px solid ${form.permissions[p.key]?"var(--gold)":"rgba(0,0,0,0.08)"}`, background:form.permissions[p.key]?"rgba(201,169,110,0.06)":"transparent" }}>
                      <div style={{ width:"16px", height:"16px", borderRadius:"4px", border:`2px solid ${form.permissions[p.key]?"var(--gold)":"rgba(0,0,0,0.2)"}`, background:form.permissions[p.key]?"var(--gold)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                        {form.permissions[p.key]&&<span style={{ color:"#fff", fontSize:"9px", fontWeight:"900" }}>✓</span>}
                      </div>
                      <span style={{ fontSize:"12px", fontWeight:"500", color:form.permissions[p.key]?"var(--gold-dark)":"var(--gray)" }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"10px" }}>
              <button className="btn-gold" style={{ flex:2 }} onClick={handleCreate}>Créer le compte</button>
              <button className="btn-outline" style={{ flex:1 }} onClick={()=>setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERMISSIONS */}
      {showPerms!==null && (() => {
        const v = staff.find(s=>s.id===showPerms);
        if (!v) return null;
        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setShowPerms(null)}>
            <div className="card" style={{ background:"#fff", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"440px" }} onClick={e=>e.stopPropagation()}>
              <div style={{ fontSize:"11px", color:"var(--gold)", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" }}>Permissions</div>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"24px", fontWeight:"400", marginBottom:"20px" }}>{v.name}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"20px" }}>
                {PERMISSIONS.map(p => (
                  <div key={p.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderRadius:"10px", border:"1px solid rgba(0,0,0,0.07)", background:"#FAFAF8" }}>
                    <div><div style={{ fontSize:"13px", fontWeight:"600" }}>{p.icon} {p.label}</div><div style={{ fontSize:"11px", color:"var(--gray)", marginTop:"2px" }}>{p.desc}</div></div>
                    <button onClick={()=>savePerm(v.id,p.key,!v.permissions[p.key])} style={{ width:"40px", height:"22px", borderRadius:"11px", border:"none", cursor:"pointer", background:v.permissions[p.key]?"var(--gold)":"#E5E7EB", position:"relative", transition:"background 0.3s", flexShrink:0 }}>
                      <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:v.permissions[p.key]?"21px":"3px", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn-gold" style={{ width:"100%" }} onClick={()=>{ toast.success("Permissions mises à jour"); setShowPerms(null); }}>Enregistrer</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
