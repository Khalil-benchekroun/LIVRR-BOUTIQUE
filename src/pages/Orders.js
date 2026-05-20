import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const now = () => new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const today = new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"});

const INITIAL_ORDERS = [
  { id:"ORD-8821", customer:"Sarah B.", total:490, status:"new", time:"Il y a 5 min", address:"Anfa Park, Résidence les Palmiers, Casablanca", deliverySlot:"18h - 19h", assignedVendor:null, items:[{name:"Robe Midi Fleurie",size:"M",qty:1,price:490}], historique:[{statut:"Nouvelle",acteur:"Système",heure:"14:12",date:today}] },
  { id:"ORD-8815", customer:"Karim T.", total:1079, status:"preparing", startedAt:Date.now()-25*60*1000, time:"Il y a 25 min", address:"Quartier Gauthier, Rue Mozart, Casablanca", deliverySlot:"Dès que possible", assignedVendor:"Siham B.", items:[{name:"Trench Camel",size:"L",qty:1,price:890},{name:"Chapeau Panama",size:"Unique",qty:1,price:189}], historique:[{statut:"Nouvelle",acteur:"Système",heure:"13:50",date:today},{statut:"Acceptée",acteur:"Siham B.",heure:"13:52",date:today},{statut:"En préparation",acteur:"Siham B.",heure:"13:53",date:today}] },
  { id:"ORD-8790", customer:"Yasmine M.", total:295, status:"ready", time:"Il y a 1h", address:"Bouskoura, Ville Verte, Casablanca", deliverySlot:"Prévu 19h30", assignedVendor:"Youssef L.", items:[{name:"Blazer Structuré",size:"S",qty:1,price:295}], historique:[{statut:"Nouvelle",acteur:"Système",heure:"13:10",date:today},{statut:"Acceptée",acteur:"Youssef L.",heure:"13:12",date:today},{statut:"En préparation",acteur:"Youssef L.",heure:"13:12",date:today},{statut:"Prête",acteur:"Youssef L.",heure:"13:45",date:today}] },
  { id:"ORD-8770", customer:"Mehdi S.", total:680, status:"delivered", time:"Il y a 2h", address:"Maarif, Bd Zerktouni, Casablanca", deliverySlot:"Livré à 13h02", assignedVendor:"Amine R.", items:[{name:"Parfum Oud 50ml",size:"Unique",qty:2,price:340}], historique:[{statut:"Nouvelle",acteur:"Système",heure:"12:00",date:today},{statut:"Acceptée",acteur:"Amine R.",heure:"12:02",date:today},{statut:"En préparation",acteur:"Amine R.",heure:"12:02",date:today},{statut:"Prête",acteur:"Amine R.",heure:"12:20",date:today},{statut:"Prise en charge",acteur:"Coursier",heure:"12:30",date:today},{statut:"Livrée",acteur:"Coursier",heure:"13:02",date:today}] },
  { id:"ORD-8755", customer:"Fatima Z.", total:195, status:"refused", time:"Il y a 3h", address:"Hay Hassani, Casablanca", deliverySlot:"—", assignedVendor:null, items:[{name:"Sérum Éclat",size:"30ml",qty:1,price:195}], motifRefus:"Produit en rupture de stock au moment de la commande", historique:[{statut:"Nouvelle",acteur:"Système",heure:"11:30",date:today},{statut:"Refusée",acteur:"Siham B.",heure:"11:33",date:today,motif:"Produit en rupture de stock au moment de la commande"}] },
];

const INITIAL_STAFF = [
  {id:1,name:"Siham B.",role:"Manager",sales:45},
  {id:2,name:"Youssef L.",role:"Vendeur Senior",sales:32},
  {id:3,name:"Amine R.",role:"Vendeur Junior",sales:12},
];

const STATUS_CONFIG = {
  new:       {label:"Nouvelle",        bg:"#FFFBEB",color:"#B45309",dot:"#F59E0B",step:1},
  accepted:  {label:"Acceptée",        bg:"#EFF6FF",color:"#1D4ED8",dot:"#3B82F6",step:2},
  preparing: {label:"En préparation",  bg:"#EEF2FF",color:"#4338CA",dot:"#6366F1",step:3},
  ready:     {label:"Prête",           bg:"#F0FDF4",color:"#15803D",dot:"#22C55E",step:4},
  taken:     {label:"Prise en charge", bg:"#FFF7ED",color:"#C2410C",dot:"#F97316",step:5},
  delivered: {label:"Livrée",          bg:"#F0FDF4",color:"#15803D",dot:"#22C55E",step:6},
  refused:   {label:"Refusée",         bg:"#FEF2F2",color:"#DC2626",dot:"#EF4444",step:0},
  cancelled: {label:"Annulée",         bg:"#F9FAFB",color:"#6B7280",dot:"#9CA3AF",step:0},
};

function Chronometre({startTime,delaiMinutes=15}) {
  const [elapsed,setElapsed] = useState(0);
  const intervalRef = useRef(null);
  useEffect(() => {
    const start = startTime||Date.now();
    const update = () => setElapsed(Math.floor((Date.now()-start)/1000));
    update();
    intervalRef.current = setInterval(update,1000);
    return () => clearInterval(intervalRef.current);
  },[startTime]);
  const totalSec=delaiMinutes*60, remaining=totalSec-elapsed, isOver=remaining<0, isWarning=remaining>=0&&remaining<120;
  const absSec=Math.abs(remaining), mins=String(Math.floor(absSec/60)).padStart(2,"0"), secs=String(absSec%60).padStart(2,"0");
  const pct=Math.min(100,(elapsed/totalSec)*100);
  const color=isOver?"#EF4444":isWarning?"#F59E0B":"#10B981";
  const bg=isOver?"rgba(239,68,68,0.08)":isWarning?"rgba(245,158,11,0.08)":"rgba(16,185,129,0.08)";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"4px",minWidth:"120px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"6px",padding:"6px 12px",borderRadius:"8px",background:bg,border:`1px solid ${color}33`,animation:isOver?"goldPulse 1s ease infinite":"none"}}>
        <span style={{fontSize:"13px"}}>{isOver?"🔴":isWarning?"🟡":"🟢"}</span>
        <span style={{fontFamily:"monospace",fontSize:"15px",fontWeight:"800",color,letterSpacing:"1px"}}>{isOver?"-":""}{mins}:{secs}</span>
        <span style={{fontSize:"9px",color,fontWeight:"700",opacity:0.7}}>{isOver?"RETARD":"restant"}</span>
      </div>
      <div style={{height:"3px",borderRadius:"2px",background:"rgba(0,0,0,0.06)",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:"2px",background:color,width:`${pct}%`,transition:"width 1s linear"}} />
      </div>
      <div style={{fontSize:"9px",color:"var(--gray)",textAlign:"right"}}>Objectif : {delaiMinutes} min</div>
    </div>
  );
}

const FILTERS = [{id:"all",label:"Toutes"},{id:"new",label:"Nouvelles"},{id:"preparing",label:"En préparation"},{id:"ready",label:"Prêtes"},{id:"delivered",label:"Livrées"},{id:"refused",label:"Refusées"}];
const MOTIFS_REFUS = ["Produit en rupture de stock","Produit endommagé / non conforme","Commande hors zone de livraison","Délai de livraison impossible","Erreur de prix ou de produit","Autre (préciser)"];
const STEPS_LIST = [{key:"new",label:"Nouvelle",step:1},{key:"accepted",label:"Acceptée",step:2},{key:"preparing",label:"Prépa",step:3},{key:"ready",label:"Prête",step:4},{key:"taken",label:"En route",step:5},{key:"delivered",label:"Livrée",step:6}];

function OrderStepper({status}) {
  const isTerminal = ["refused","cancelled"].includes(status);
  const cfg = STATUS_CONFIG[status];
  const currentStep = cfg?.step||0;
  if (isTerminal) return (
    <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 12px",background:cfg.bg,borderRadius:"8px",border:`1px solid ${cfg.dot}33`}}>
      <div style={{width:"7px",height:"7px",borderRadius:"50%",background:cfg.dot}} />
      <span style={{fontSize:"11px",fontWeight:"700",color:cfg.color}}>{cfg.label}</span>
    </div>
  );
  return (
    <div style={{display:"flex",alignItems:"center"}}>
      {STEPS_LIST.map((s,i) => {
        const done=s.step<currentStep, current=s.step===currentStep;
        return (
          <React.Fragment key={s.key}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
              <div style={{width:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:done?"#22C55E":current?"var(--gold)":"rgba(0,0,0,0.06)",border:`2px solid ${done?"#22C55E":current?"var(--gold)":"rgba(0,0,0,0.1)"}`,fontSize:"8px",fontWeight:"800",color:done||current?"#fff":"rgba(0,0,0,0.3)"}}>
                {done?"✓":s.step}
              </div>
              <span style={{fontSize:"7px",fontWeight:"600",color:done||current?"var(--noir)":"var(--gray)",whiteSpace:"nowrap"}}>{s.label}</span>
            </div>
            {i<STEPS_LIST.length-1&&<div style={{width:"16px",height:"2px",background:s.step<currentStep?"#22C55E":"rgba(0,0,0,0.08)",marginBottom:"12px",transition:"background 0.3s"}} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Historique({items}) {
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      {items.map((h,i) => (
        <div key={i} style={{display:"flex",gap:"10px",paddingBottom:i<items.length-1?"10px":"0"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:"7px",height:"7px",borderRadius:"50%",background:i===0?"var(--gold)":"rgba(0,0,0,0.15)",marginTop:"4px",flexShrink:0}} />
            {i<items.length-1&&<div style={{width:"1px",flex:1,background:"rgba(0,0,0,0.07)",minHeight:"16px"}} />}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"12px",fontWeight:"700"}}>{h.statut}</span><span style={{fontSize:"10px",color:"var(--gray)"}}>{h.heure}</span></div>
            <div style={{fontSize:"11px",color:"var(--gray)"}}>par {h.acteur}</div>
            {h.motif&&<div style={{fontSize:"11px",color:"var(--error)",fontStyle:"italic",marginTop:"2px"}}>Motif : {h.motif}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function printLabel(order) {
  const qrData = encodeURIComponent(`LIVRR-${order.id}-${order.customer}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}&bgcolor=ffffff&color=0a0a0f&margin=6`;
  const w = window.open("","_blank","width=420,height=600");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Étiquette — ${order.id}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',sans-serif;background:#fff;display:flex;justify-content:center;padding:20px}.label{width:100mm;min-height:150mm;border:2px solid #0a0a0f;border-radius:8px;overflow:hidden;display:flex;flex-direction:column}.label-header{background:#0a0a0f;padding:12px 16px;display:flex;justify-content:space-between;align-items:center}.label-logo{font-size:20px;font-weight:900;letter-spacing:6px;color:#C9A96E}.label-id{font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:1px}.gold-line{height:2px;background:linear-gradient(90deg,#8C6A35,#C9A96E,#E8D5B0,#C9A96E,#8C6A35)}.label-body{padding:14px 16px;display:flex;gap:14px;align-items:flex-start;flex:1}.label-qr img{width:90px;height:90px;border:1px solid #eee;border-radius:4px}.label-client{font-size:16px;font-weight:800;color:#0a0a0f;margin-bottom:8px}.label-row{display:flex;gap:6px;margin-bottom:5px}.label-text{font-size:11px;color:#333;line-height:1.5}.label-sep{border:none;border-top:1px dashed #ddd;margin:12px 16px}.label-order-num{text-align:center;font-size:22px;font-weight:900;letter-spacing:3px;color:#0a0a0f;padding:10px 16px 6px;font-family:'Courier New',monospace}.label-footer{background:#f8f7f4;padding:8px 16px;text-align:center;font-size:8px;color:#aaa;border-top:1px solid #eee}@media print{body{padding:0}.label{border-radius:0;width:100mm}.no-print{display:none}}</style></head><body><div class="label"><div class="label-header"><div class="label-logo">LIVRR</div><div class="label-id">ÉTIQUETTE LIVRAISON</div></div><div class="gold-line"></div><div class="label-order-num">${order.id}</div><hr class="label-sep"/><div class="label-body"><div class="label-qr"><img src="${qrUrl}" alt="QR"/></div><div style="flex:1"><div class="label-client">${order.customer}</div><div class="label-row"><span>📍</span><span class="label-text">${order.address}</span></div><div class="label-row"><span>🕒</span><span class="label-text">Créneau : ${order.deliverySlot}</span></div><div class="label-row"><span>📦</span><span class="label-text">${order.items.map(i=>i.name+" ("+i.size+") ×"+i.qty).join(", ")}</span></div></div></div><hr class="label-sep"/><div class="label-footer">LIVRR · Luxe livré en moins d'1 heure · livrr.fr</div></div><div class="no-print" style="text-align:center;margin-top:16px;"><button onclick="window.print()" style="padding:10px 24px;background:#0a0a0f;color:#C9A96E;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">🖨️ IMPRIMER</button></div></body></html>`);
  w.document.close();
}

// ── Export CSV Commandes ──
const exportCommandes = (orders) => {
  const dateStr = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
  const sep = ";";
  const STATUS_LABELS = { new:"Nouvelle", accepted:"Acceptée", preparing:"En préparation", ready:"Prête", taken:"Prise en charge", delivered:"Livrée", refused:"Refusée", cancelled:"Annulée" };
  const headers = ["ID Commande","Client","Adresse","Créneau","Total (€)","Statut","Vendeur assigné","Articles"];
  const rows = orders.map(o => [
    o.id, o.customer, o.address, o.deliverySlot, o.total,
    STATUS_LABELS[o.status] || o.status,
    o.assignedVendor || "—",
    o.items.map(i => i.name+" ("+i.size+") x"+i.qty).join(" | "),
  ]);
  const csv = [headers,...rows].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(sep)).join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "commandes_livrr_"+dateStr+".csv";
  a.click();
};

export default function Orders() {
  const [orders,setOrders] = useState(INITIAL_ORDERS);
  const [filter,setFilter] = useState("all");
  const [selectedOrder,setSelectedOrder] = useState(null);
  const [showLabelModal,setShowLabelModal] = useState(false);
  const [labelOrder,setLabelOrder] = useState(null);
  const [showAcceptModal,setShowAcceptModal] = useState(false);
  const [pendingAcceptId,setPendingAcceptId] = useState(null);
  const [selectedVendorId,setSelectedVendorId] = useState(null);
  const [showRefusModal,setShowRefusModal] = useState(false);
  const [pendingRefusId,setPendingRefusId] = useState(null);
  const [motifRefus,setMotifRefus] = useState("");
  const [motifCustom,setMotifCustom] = useState("");
  const [showCancelModal,setShowCancelModal] = useState(false);
  const [pendingCancelId,setPendingCancelId] = useState(null);
  const [motifCancel,setMotifCancel] = useState("");

  const addHisto = (id,statut,acteur,motif=null) => {
    const entry={statut,acteur,heure:now(),date:today};
    if(motif) entry.motif=motif;
    setOrders(prev=>prev.map(o=>o.id===id?{...o,historique:[...(o.historique||[]),entry]}:o));
  };
  const transition = (id,newStatus,extra={}) => {
    setOrders(prev=>prev.map(o=>o.id===id?{...o,status:newStatus,...extra}:o));
    if(selectedOrder?.id===id) setSelectedOrder(prev=>({...prev,status:newStatus,...extra}));
  };
  const openAcceptModal = (id) => { setPendingAcceptId(id); setSelectedVendorId(null); setShowAcceptModal(true); };
  const confirmAccept = () => {
    if(!selectedVendorId) return toast.error("Sélectionnez un vendeur");
    const vendor = INITIAL_STAFF.find(s=>s.id===selectedVendorId);
    transition(pendingAcceptId,"preparing",{assignedVendor:vendor.name,startedAt:Date.now()});
    addHisto(pendingAcceptId,"Acceptée",vendor.name);
    addHisto(pendingAcceptId,"En préparation",vendor.name);
    toast.success(`Commande acceptée — Assignée à ${vendor.name}`,{icon:"✅"});
    setShowAcceptModal(false);
  };
  const openRefusModal = (id) => { setPendingRefusId(id); setMotifRefus(""); setMotifCustom(""); setShowRefusModal(true); };
  const confirmRefus = () => {
    const motif = motifRefus==="Autre (préciser)"?motifCustom:motifRefus;
    if(!motif.trim()) return toast.error("Le motif de refus est obligatoire");
    transition(pendingRefusId,"refused",{motifRefus:motif});
    addHisto(pendingRefusId,"Refusée","Boutique",motif);
    toast.error("Commande refusée — Client notifié et remboursé",{duration:4000});
    setShowRefusModal(false);
  };
  const openCancelModal = (id) => { setPendingCancelId(id); setMotifCancel(""); setShowCancelModal(true); };
  const confirmCancel = () => {
    if(!motifCancel.trim()) return toast.error("Le motif d'annulation est obligatoire");
    transition(pendingCancelId,"cancelled",{motifRefus:motifCancel});
    addHisto(pendingCancelId,"Annulée","Boutique",motifCancel);
    toast("Commande annulée — Remboursement déclenché",{icon:"ℹ️"});
    setShowCancelModal(false);
  };
  const markReady = (id) => { transition(id,"ready"); addHisto(id,"Prête",orders.find(o=>o.id===id)?.assignedVendor||"Vendeur"); toast.success("Colis prêt — Signal envoyé au coursier LIVRR !",{icon:"📦"}); };
  const markTaken = (id) => { transition(id,"taken"); addHisto(id,"Prise en charge","Coursier LIVRR"); toast.success("Prise en charge par le coursier",{icon:"🛵"}); };
  const markDelivered = (id) => { transition(id,"delivered"); addHisto(id,"Livrée","Coursier LIVRR"); toast.success("Livraison confirmée ! ✓",{icon:"🎉"}); };
  const openLabelPreview = (order) => { setLabelOrder(order); setShowLabelModal(true); };
  const filtered = orders.filter(o=>filter==="all"||o.status===filter);

  return (
    <div className="page" style={{padding:"44px 52px"}}>
      {/* HEADER */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"36px"}}>
        <div>
          <div style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--gray)",marginBottom:"8px"}}>Opérations</div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"44px",fontWeight:"300",lineHeight:1.1}}>Commandes</h1>
          <p style={{color:"var(--gray)",fontSize:"14px",marginTop:"6px"}}>
            {orders.filter(o=>o.status==="new").length>0?`⚡ ${orders.filter(o=>o.status==="new").length} commande(s) en attente — délai 3–5 min`:"Aucune nouvelle commande en attente"}
          </p>
        </div>
        <button className="btn-outline" style={{fontSize:"12px",padding:"10px 18px",display:"flex",alignItems:"center",gap:"6px"}} onClick={()=>exportCommandes(orders)}>
          ↓ Exporter les commandes
        </button>
      </div>

      {/* FILTRES */}
      <div style={{display:"flex",gap:"8px",marginBottom:"24px",flexWrap:"wrap"}}>
        {FILTERS.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            style={{padding:"8px 16px",borderRadius:"30px",border:`1.5px solid ${filter===f.id?"var(--gold)":"rgba(0,0,0,0.1)"}`,background:filter===f.id?"rgba(201,169,110,0.08)":"transparent",color:filter===f.id?"var(--gold-dark)":"var(--gray)",fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"var(--font-body)",transition:"all 0.2s"}}>
            {f.label}<span style={{marginLeft:"6px",opacity:0.6}}>{f.id==="all"?orders.length:orders.filter(o=>o.status===f.id).length}</span>
          </button>
        ))}
      </div>

      {/* LISTE + DÉTAIL */}
      <div style={{display:"grid",gridTemplateColumns:selectedOrder?"1fr 400px":"1fr",gap:"20px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"60px",color:"var(--gray)",background:"#fff",borderRadius:"14px",border:"1px dashed rgba(0,0,0,0.1)"}}>Aucune commande dans cette catégorie</div>}
          {filtered.map(order=>{
            const cfg=STATUS_CONFIG[order.status], isNew=order.status==="new";
            return (
              <div key={order.id} onClick={()=>setSelectedOrder(selectedOrder?.id===order.id?null:order)}
                style={{background:"#fff",borderRadius:"14px",padding:"20px 24px",border:`1.5px solid ${selectedOrder?.id===order.id?"var(--gold)":isNew?"rgba(245,158,11,0.4)":"rgba(0,0,0,0.07)"}`,cursor:"pointer",transition:"all 0.2s",boxShadow:isNew?"0 0 0 3px rgba(245,158,11,0.08)":selectedOrder?.id===order.id?"0 4px 20px rgba(201,169,110,0.15)":"0 1px 4px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
                  <div>
                    <div style={{fontFamily:"var(--font-display)",fontSize:"18px",fontWeight:"600",marginBottom:"2px"}}>{order.id}</div>
                    <div style={{fontSize:"13px",color:"var(--gray)"}}>{order.customer} · {order.time}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"var(--font-display)",fontSize:"20px",fontWeight:"300",marginBottom:"4px"}}>{order.total} €</div>
                    <span style={{padding:"3px 10px",borderRadius:"20px",fontSize:"10px",fontWeight:"700",background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.dot}33`}}>{cfg.label}</span>
                  </div>
                </div>
                <div style={{marginBottom:"14px",overflowX:"auto"}}><OrderStepper status={order.status} /></div>
                {order.status==="preparing"&&<div style={{marginBottom:"12px"}}><Chronometre startTime={order.startedAt} delaiMinutes={parseInt(localStorage.getItem("livrr_delai_preparation")||"15")} /></div>}
                <div style={{fontSize:"13px",color:"var(--gray)",marginBottom:"14px"}}>{order.items.map(i=>`${i.name} (${i.size}) × ${i.qty}`).join(" · ")}</div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>openLabelPreview(order)} style={{padding:"7px 12px",borderRadius:"8px",border:"1px solid rgba(201,169,110,0.35)",background:"rgba(201,169,110,0.06)",color:"var(--gold-dark)",fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"var(--font-body)",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"5px"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(201,169,110,0.14)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(201,169,110,0.06)"}>🖨️ Étiquette</button>
                  {order.status==="new"&&<><button className="btn-gold" style={{fontSize:"12px",padding:"8px 16px"}} onClick={()=>openAcceptModal(order.id)}>✓ Accepter</button><button className="btn-danger" style={{fontSize:"12px",padding:"8px 16px"}} onClick={()=>openRefusModal(order.id)}>✕ Refuser</button></>}
                  {order.status==="preparing"&&<><button className="btn-gold" style={{fontSize:"12px",padding:"8px 16px"}} onClick={()=>markReady(order.id)}>📦 Colis prêt</button><button className="btn-outline" style={{fontSize:"12px",padding:"8px 16px",color:"var(--error)",borderColor:"var(--error)"}} onClick={()=>openCancelModal(order.id)}>Annuler</button></>}
                  {order.status==="ready"&&<button className="btn-gold" style={{fontSize:"12px",padding:"8px 16px"}} onClick={()=>markTaken(order.id)}>🛵 Remis au coursier</button>}
                  {order.status==="taken"&&<button className="btn-gold" style={{fontSize:"12px",padding:"8px 16px"}} onClick={()=>markDelivered(order.id)}>✓ Confirmer livraison</button>}
                  {order.status==="delivered"&&<span style={{fontSize:"12px",color:"#15803D",fontWeight:"700"}}>✓ Commande livrée</span>}
                  {order.status==="refused"&&<span style={{fontSize:"12px",color:"var(--error)"}}>Refusée — {order.motifRefus}</span>}
                  {order.status==="cancelled"&&<span style={{fontSize:"12px",color:"var(--gray)"}}>Annulée — {order.motifRefus}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {selectedOrder&&(()=>{
          const order=orders.find(o=>o.id===selectedOrder.id)||selectedOrder;
          return (
            <div className="card" style={{position:"sticky",top:"20px",height:"fit-content",maxHeight:"calc(100vh - 120px)",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
                <div><div style={{fontSize:"10px",color:"var(--gold)",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"4px"}}>Détail commande</div><h3 style={{fontFamily:"var(--font-display)",fontSize:"22px",fontWeight:"400"}}>{order.id}</h3></div>
                <button onClick={()=>setSelectedOrder(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"18px",color:"var(--gray)"}}>✕</button>
              </div>
              <div style={{padding:"12px 14px",background:"#F8F7F4",borderRadius:"10px",marginBottom:"12px"}}>
                <div style={{fontSize:"10px",color:"var(--gray)",fontWeight:"700",textTransform:"uppercase",marginBottom:"4px"}}>Client</div>
                <div style={{fontWeight:"600",fontSize:"14px"}}>{order.customer}</div>
                <div style={{fontSize:"12px",color:"var(--gray)",marginTop:"2px"}}>{order.address}</div>
                <div style={{fontSize:"12px",color:"var(--gray)",marginTop:"2px"}}>Créneau : {order.deliverySlot}</div>
              </div>
              <div style={{marginBottom:"12px"}}>
                <div style={{fontSize:"10px",color:"var(--gray)",fontWeight:"700",textTransform:"uppercase",marginBottom:"8px"}}>Articles</div>
                {order.items.map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<order.items.length-1?"1px solid rgba(0,0,0,0.05)":"none"}}>
                    <div><div style={{fontSize:"13px",fontWeight:"600"}}>{item.name}</div><div style={{fontSize:"11px",color:"var(--gray)"}}>Taille {item.size} · Qté {item.qty}</div></div>
                    <span style={{fontFamily:"var(--font-display)",fontSize:"15px"}}>{item.price} €</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:"10px",fontWeight:"700"}}>
                  <span>Total</span><span style={{fontFamily:"var(--font-display)",fontSize:"18px"}}>{order.total} €</span>
                </div>
              </div>
              {order.assignedVendor&&<div style={{padding:"10px 14px",background:"rgba(201,169,110,0.06)",borderRadius:"8px",marginBottom:"12px",display:"flex",gap:"10px",alignItems:"center"}}><span style={{fontSize:"16px"}}>👤</span><div><div style={{fontSize:"10px",color:"var(--gray)",fontWeight:"700",textTransform:"uppercase"}}>Vendeur assigné</div><div style={{fontWeight:"600",fontSize:"13px"}}>{order.assignedVendor}</div></div></div>}
              <div style={{marginBottom:"16px"}}><div style={{fontSize:"10px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--gray)",marginBottom:"12px"}}>Historique</div><Historique items={order.historique||[]} /></div>
              <button className="btn-gold" style={{width:"100%",fontSize:"12px"}} onClick={()=>openLabelPreview(order)}>🖨️ Imprimer l'étiquette</button>
            </div>
          );
        })()}
      </div>

      {/* MODAL APERÇU ÉTIQUETTE */}
      {showLabelModal&&labelOrder&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setShowLabelModal(false)}>
          <div style={{background:"#fff",borderRadius:"20px",padding:"32px",width:"100%",maxWidth:"480px",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
              <div><div style={{fontSize:"10px",color:"var(--gold)",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"4px"}}>Aperçu étiquette</div><h3 style={{fontFamily:"var(--font-display)",fontSize:"22px",fontWeight:"400"}}>{labelOrder.id}</h3></div>
              <button onClick={()=>setShowLabelModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"18px",color:"var(--gray)"}}>✕</button>
            </div>
            <div style={{border:"2px solid #0a0a0f",borderRadius:"8px",overflow:"hidden",marginBottom:"20px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
              <div style={{background:"#0a0a0f",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:"var(--font-display)",fontSize:"20px",letterSpacing:"6px",color:"#C9A96E",fontWeight:"700"}}>LIVRR</span>
                <span style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",letterSpacing:"1px"}}>ÉTIQUETTE LIVRAISON</span>
              </div>
              <div style={{height:"2px",background:"linear-gradient(90deg,#8C6A35,#C9A96E,#E8D5B0,#C9A96E,#8C6A35)"}} />
              <div style={{textAlign:"center",padding:"12px 16px 6px",fontFamily:"monospace",fontSize:"22px",fontWeight:"900",letterSpacing:"3px",color:"#0a0a0f"}}>{labelOrder.id}</div>
              <div style={{borderTop:"1px dashed #ddd",margin:"8px 16px"}} />
              <div style={{padding:"10px 16px 14px",display:"flex",gap:"14px",alignItems:"flex-start"}}>
                <div style={{flexShrink:0,textAlign:"center"}}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent("LIVRR-"+labelOrder.id+"-"+labelOrder.customer)}&bgcolor=ffffff&color=0a0a0f&margin=4`} alt="QR Code" style={{width:"80px",height:"80px",border:"1px solid #eee",borderRadius:"4px"}} />
                  <div style={{fontSize:"8px",color:"#999",marginTop:"4px",lineHeight:1.3}}>📱 Scanner pour<br/>suivre la commande</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"15px",fontWeight:"800",color:"#0a0a0f",marginBottom:"8px"}}>{labelOrder.customer}</div>
                  <div style={{fontSize:"11px",color:"#444",lineHeight:1.7}}>
                    <div>📍 {labelOrder.address}</div>
                    <div>🕒 <strong>Créneau :</strong> {labelOrder.deliverySlot}</div>
                    <div style={{marginTop:"4px"}}>📦 {labelOrder.items.map(i=>i.name+" ("+i.size+") ×"+i.qty).join(", ")}</div>
                  </div>
                </div>
              </div>
              <div style={{background:"#f8f7f4",padding:"8px 16px",textAlign:"center",fontSize:"9px",color:"#aaa",borderTop:"1px solid #eee"}}>LIVRR · Luxe livré en moins d'1 heure · livrr.fr</div>
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <button className="btn-gold" style={{flex:2,fontSize:"12px"}} onClick={()=>{setShowLabelModal(false);printLabel(labelOrder);}}>🖨️ Imprimer maintenant</button>
              <button className="btn-outline" style={{flex:1,fontSize:"12px"}} onClick={()=>setShowLabelModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACCEPTATION */}
      {showAcceptModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAcceptModal(false)}>
          <div className="card" style={{background:"#fff",borderRadius:"20px",padding:"32px",width:"100%",maxWidth:"420px"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"11px",color:"var(--gold)",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"6px"}}>Accepter la commande</div>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:"24px",fontWeight:"400",marginBottom:"6px"}}>{pendingAcceptId}</h3>
            <p style={{fontSize:"13px",color:"var(--gray)",marginBottom:"20px",lineHeight:1.6}}>Assignez un vendeur responsable de la préparation.</p>
            <label className="label">Vendeur responsable *</label>
            <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px"}}>
              {INITIAL_STAFF.map(s=>(
                <div key={s.id} onClick={()=>setSelectedVendorId(s.id)} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 14px",borderRadius:"10px",cursor:"pointer",transition:"all 0.2s",border:`1.5px solid ${selectedVendorId===s.id?"var(--gold)":"rgba(0,0,0,0.08)"}`,background:selectedVendorId===s.id?"rgba(201,169,110,0.06)":"#FAFAF8"}}>
                  <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"var(--gold-light)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",color:"var(--gold-dark)",flexShrink:0}}>{s.name.charAt(0)}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"600",fontSize:"14px"}}>{s.name}</div><div style={{fontSize:"11px",color:"var(--gray)"}}>{s.role} · {s.sales} ventes</div></div>
                  {selectedVendorId===s.id&&<span style={{color:"var(--gold)",fontWeight:"800"}}>✓</span>}
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <button className="btn-gold" style={{flex:2}} onClick={confirmAccept}>Confirmer l'acceptation</button>
              <button className="btn-outline" style={{flex:1}} onClick={()=>setShowAcceptModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REFUS */}
      {showRefusModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowRefusModal(false)}>
          <div className="card" style={{background:"#fff",borderRadius:"20px",padding:"32px",width:"100%",maxWidth:"440px"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"11px",color:"var(--error)",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"6px"}}>Refuser la commande</div>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:"24px",fontWeight:"400",marginBottom:"6px"}}>{pendingRefusId}</h3>
            <p style={{fontSize:"13px",color:"var(--gray)",marginBottom:"20px",lineHeight:1.6}}>Motif <strong>obligatoire</strong> — le client sera remboursé.</p>
            <label className="label">Motif du refus *</label>
            <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"14px"}}>
              {MOTIFS_REFUS.map(m=>(
                <div key={m} onClick={()=>setMotifRefus(m)} style={{padding:"10px 14px",borderRadius:"8px",cursor:"pointer",fontSize:"13px",transition:"all 0.2s",border:`1.5px solid ${motifRefus===m?"var(--error)":"rgba(0,0,0,0.08)"}`,background:motifRefus===m?"rgba(192,57,43,0.05)":"#FAFAF8",color:motifRefus===m?"var(--error)":"var(--noir)",fontWeight:motifRefus===m?"600":"400"}}>{m}</div>
              ))}
            </div>
            {motifRefus==="Autre (préciser)"&&<textarea className="input-field" placeholder="Précisez le motif..." value={motifCustom} onChange={e=>setMotifCustom(e.target.value)} rows={2} style={{marginBottom:"14px",resize:"none"}} />}
            <div style={{display:"flex",gap:"10px"}}>
              <button className="btn-danger" style={{flex:2}} onClick={confirmRefus}>Confirmer le refus</button>
              <button className="btn-outline" style={{flex:1}} onClick={()=>setShowRefusModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ANNULATION */}
      {showCancelModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowCancelModal(false)}>
          <div className="card" style={{background:"#fff",borderRadius:"20px",padding:"32px",width:"100%",maxWidth:"420px"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"11px",color:"var(--error)",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"6px"}}>Annuler la commande</div>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:"24px",fontWeight:"400",marginBottom:"6px"}}>{pendingCancelId}</h3>
            <p style={{fontSize:"13px",color:"var(--gray)",marginBottom:"20px",lineHeight:1.6}}>Motif <strong>obligatoire</strong>.</p>
            <label className="label">Motif de l'annulation *</label>
            <textarea className="input-field" placeholder="Ex: Produit introuvable après acceptation..." value={motifCancel} onChange={e=>setMotifCancel(e.target.value)} rows={3} style={{resize:"none"}} />
            <div style={{display:"flex",gap:"10px"}}>
              <button className="btn-danger" style={{flex:2}} onClick={confirmCancel}>Confirmer l'annulation</button>
              <button className="btn-outline" style={{flex:1}} onClick={()=>setShowCancelModal(false)}>Retour</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
