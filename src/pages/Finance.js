import React, { useState } from "react";
import toast from "react-hot-toast";

/* ============================================================
   LIVRR — Finance
   Rapports & Exports + Reporting & Documents officiels
   ============================================================ */

const PERIODES = [
  { key: "mois",  label: "Ce mois" },
  { key: "3m",   label: "3 mois" },
  { key: "6m",   label: "6 mois" },
  { key: "1an",  label: "1 an" },
];

const MOIS_DISPONIBLES = [
  { key: "2026-04", label: "Avril 2026",   ca: 32480, commission: 6496,  versement: 25984, statut: "versé" },
  { key: "2026-03", label: "Mars 2026",    ca: 28940, commission: 5788,  versement: 23152, statut: "versé" },
  { key: "2026-02", label: "Février 2026", ca: 24120, commission: 4824,  versement: 19296, statut: "versé" },
  { key: "2026-01", label: "Janvier 2026", ca: 21870, commission: 4374,  versement: 17496, statut: "versé" },
  { key: "2025-12", label: "Décembre 2025",ca: 38650, commission: 7730,  versement: 30920, statut: "versé" },
  { key: "2025-11", label: "Novembre 2025",ca: 19340, commission: 3868,  versement: 15472, statut: "versé" },
];

const downloadCSV = (filename, content) => {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

const downloadTxt = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

const dateStr = () => new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");

// ── Exports CSV ──
const exportReportingMensuel = (periode) => {
  const lines = [
    "REPORTING MENSUEL LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr()}`,
    "",
    "=== CHIFFRE D'AFFAIRES ===",
    "Indicateur;Valeur",
    "CA Brut;32 480 €",
    "CA Net boutique;25 984 €",
    "Commission LIVRR (20%);6 496 €",
    "Panier moyen;292 €",
    "",
    "=== COMMANDES ===",
    "Commandes totales;112",
    "Commandes livrées;98",
    "Commandes refusées;7",
    "Commandes annulées;4",
    "Commandes en retard;3",
    "",
    "=== TABLEAU HEBDOMADAIRE ===",
    "Semaine;CA Brut;Commandes;Nouveaux clients",
    "S1;7 840 €;26;18",
    "S2;8 120 €;28;22",
    "S3;8 960 €;31;25",
    "S4;7 560 €;27;22",
  ];
  downloadCSV(`reporting_mensuel_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Reporting mensuel téléchargé !", { icon: "📊" });
};

const exportStatistiques = (periode) => {
  const lines = [
    "STATISTIQUES LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr()}`,
    "",
    "=== HEURES DE POINTE ===",
    "Heure;Commandes",
    "9h;2","10h;5","11h;8","12h;12","13h;9","14h;14",
    "15h;11","16h;16","17h;20","18h;18","19h;10","20h;4",
    "",
    "=== TOP PRODUITS ===",
    "Produit;CA;Ventes;Tendance",
    "Robe Midi Fleurie;14 800 €;32;+18%",
    "Trench Camel;11 200 €;14;+7%",
    "Parfum Oud 50ml;8 400 €;28;+22%",
    "Blazer Structuré;5 900 €;21;-3%",
    "Sérum Éclat Visage;5 200 €;26;+11%",
  ];
  downloadCSV(`statistiques_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Statistiques téléchargées !", { icon: "📈" });
};

const exportDonneesProduits = (periode) => {
  const lines = [
    "DONNÉES PRODUITS LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    "",
    "=== CATALOGUE ===",
    "Nom;Marque;Catégorie;Prix;Stock;Statut",
    "Robe Midi Fleurie;Sandro;Vêtements;490 €;22;Actif",
    "Huile d'Olive Extra Vierge;Terroirs;Épicerie Fine;45 €;50;Actif",
    "Parfum Oud 50ml;Maison Crivelli;Beauté;280 €;15;Actif",
    "Sérum Éclat Visage;Augustinus Bader;Beauté;185 €;8;Actif",
    "",
    "=== ALERTES STOCK ===",
    "Produit;Stock;Seuil;Statut",
    "Sérum Éclat Visage;8;10;⚠ Stock faible",
    "Parfum Oud 100ml;0;5;🔴 Rupture",
  ];
  downloadCSV(`donnees_produits_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Données produits téléchargées !", { icon: "📦" });
};

const exportPerformances = (periode) => {
  const lines = [
    "PERFORMANCES ÉQUIPE LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    "",
    "=== VENDEURS ===",
    "Vendeur;Rôle;Commandes;CA Généré;Temps moyen;Note;Taux acceptation",
    "Siham B.;Manager;45;12 400 €;11 min;4.9/5;98%",
    "Youssef L.;Vendeur Senior;32;8 900 €;14 min;4.7/5;94%",
    "Amine R.;Vendeur Junior;12;2 800 €;18 min;4.5/5;88%",
    "",
    "=== INDICATEURS ===",
    "Indicateur;Valeur;Objectif;Statut",
    "Taux de livraison;87.5%;90%;⚠ En dessous",
    "Délai moyen préparation;13 min;15 min;✓ OK",
    "Délai moyen livraison;42 min;60 min;✓ OK",
    "Note moyenne boutique;4.8/5;4.5/5;✓ Excellent",
  ];
  downloadCSV(`performances_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Performances téléchargées !", { icon: "🏆" });
};

// ── Relevés officiels LIVRR ──
const exportReleveCommission = (mois) => {
  const m = MOIS_DISPONIBLES.find(x => x.key === mois);
  if (!m) return;
  const lines = [
    "════════════════════════════════════════",
    "       RELEVÉ DE COMMISSION LIVRR",
    "════════════════════════════════════════",
    "",
    `Boutique          : Sandro Paris`,
    `Période           : ${m.label}`,
    `Date d'émission   : ${new Date().toLocaleDateString("fr-FR")}`,
    `Numéro de relevé  : LIVRR-${mois}-${Math.floor(Math.random()*9000+1000)}`,
    "",
    "────────────────────────────────────────",
    "DÉTAIL DES TRANSACTIONS",
    "────────────────────────────────────────",
    "",
    `CA Brut généré         : ${m.ca.toLocaleString("fr-FR")} €`,
    `Taux de commission     : 20%`,
    `Commission LIVRR HT    : ${(m.commission * 0.8).toLocaleString("fr-FR",{maximumFractionDigits:2})} €`,
    `TVA (20%)              : ${(m.commission * 0.2).toLocaleString("fr-FR",{maximumFractionDigits:2})} €`,
    `Commission LIVRR TTC   : ${m.commission.toLocaleString("fr-FR")} €`,
    "",
    "────────────────────────────────────────",
    "VERSEMENT BOUTIQUE",
    "────────────────────────────────────────",
    "",
    `Montant versé          : ${m.versement.toLocaleString("fr-FR")} €`,
    `Statut                 : ${m.statut === "versé" ? "✓ VERSÉ" : "⏳ EN ATTENTE"}`,
    `Délai PSP              : 14 jours ouvrés`,
    "",
    "────────────────────────────────────────",
    "LIVRR SAS — 12 rue de la Paix, 75001 Paris",
    "SIRET : 123 456 789 00012 — TVA : FR12345678900",
    "contact@livrr.fr — livrr.fr",
    "════════════════════════════════════════",
  ];
  downloadTxt(`releve_commission_LIVRR_${mois}.txt`, lines.join("\n"));
  toast.success(`Relevé ${m.label} téléchargé !`, { icon: "📄" });
};

const exportFacture = (mois) => {
  const m = MOIS_DISPONIBLES.find(x => x.key === mois);
  if (!m) return;
  const lines = [
    "════════════════════════════════════════",
    "              FACTURE LIVRR",
    "════════════════════════════════════════",
    "",
    `Émetteur          : LIVRR SAS`,
    `SIRET             : 123 456 789 00012`,
    `Destinataire      : Sandro Paris`,
    `Période           : ${m.label}`,
    `N° Facture        : FAC-${mois}-${Math.floor(Math.random()*9000+1000)}`,
    `Date              : ${new Date().toLocaleDateString("fr-FR")}`,
    "",
    "────────────────────────────────────────",
    "DÉSIGNATION                    MONTANT",
    "────────────────────────────────────────",
    `Commission livraisons (20%)    ${(m.commission * 0.8).toLocaleString("fr-FR",{maximumFractionDigits:2})} €`,
    `Abonnement Espace Boutique     0,00 €`,
    "────────────────────────────────────────",
    `Sous-total HT                  ${(m.commission * 0.8).toLocaleString("fr-FR",{maximumFractionDigits:2})} €`,
    `TVA 20%                        ${(m.commission * 0.2).toLocaleString("fr-FR",{maximumFractionDigits:2})} €`,
    `TOTAL TTC                      ${m.commission.toLocaleString("fr-FR")} €`,
    "",
    "Mode de règlement : Prélèvement automatique",
    "Merci de votre confiance.",
    "════════════════════════════════════════",
  ];
  downloadTxt(`facture_LIVRR_${mois}.txt`, lines.join("\n"));
  toast.success(`Facture ${m.label} téléchargée !`, { icon: "🧾" });
};

const exportTout = (periode) => {
  setTimeout(() => exportReportingMensuel(periode), 0);
  setTimeout(() => exportStatistiques(periode), 400);
  setTimeout(() => exportDonneesProduits(periode), 800);
  setTimeout(() => exportPerformances(periode), 1200);
  toast.success("4 rapports téléchargés !", { icon: "📁", duration: 4000 });
};

export default function Finance() {
  const [periode, setPeriode] = useState("mois");
  const [activeTab, setActiveTab] = useState("exports");
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (key, fn) => {
    setDownloading(key);
    setTimeout(() => { fn(periode); setDownloading(null); }, 300);
  };

  const RAPPORTS = [
    { key:"reporting", icon:"📊", title:"Reporting mensuel",  desc:"CA brut, CA net, commission, tableau hebdomadaire", color:"#C9A96E", bg:"rgba(201,169,110,0.06)", items:["Chiffre d'affaires","Commission LIVRR","Panier moyen","Tableau hebdomadaire"], fn:exportReportingMensuel },
    { key:"stats",     icon:"📈", title:"Statistiques",       desc:"Heures de pointe, clients actifs, top produits", color:"#3B82F6", bg:"rgba(59,130,246,0.06)",   items:["Heures de pointe","Clients actifs / mois","Top 5 produits","Qualité commandes"], fn:exportStatistiques },
    { key:"produits",  icon:"📦", title:"Données produits",   desc:"Catalogue complet, mouvements de stock, alertes", color:"#10B981", bg:"rgba(16,185,129,0.06)",  items:["Catalogue produits","Mouvements de stock","Variantes","Alertes stock"], fn:exportDonneesProduits },
    { key:"perfs",     icon:"🏆", title:"Performances",       desc:"Vendeurs, indicateurs boutique, motifs de refus", color:"#8B5CF6", bg:"rgba(139,92,246,0.06)",  items:["Performances vendeurs","Indicateurs boutique","Taux de livraison","Motifs de refus"], fn:exportPerformances },
  ];

  const TAB_STYLE = (active) => ({
    padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
    fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "600",
    transition: "all 0.2s",
    background: active ? "#fff" : "transparent",
    color: active ? "var(--noir)" : "var(--gray)",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
  });

  return (
    <div className="page" style={{ padding: "44px 52px" }}>

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"32px" }}>
        <div>
          <div style={{ fontSize:"11px", fontWeight:"700", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gray)", marginBottom:"8px" }}>Données</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"44px", fontWeight:"300", lineHeight:1.1 }}>Finance</h1>
          <p style={{ color:"var(--gray)", fontSize:"14px", marginTop:"6px" }}>Rapports, exports et documents officiels LIVRR</p>
        </div>
        {activeTab === "exports" && (
          <button className="btn-gold" style={{ fontSize:"13px", padding:"14px 24px", display:"flex", alignItems:"center", gap:"8px" }}
            onClick={() => handleDownload("all", exportTout)}>
            {downloading === "all" ? "⏳ Téléchargement..." : "↓ Tout télécharger (4 fichiers)"}
          </button>
        )}
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:"4px", padding:"4px", background:"rgba(0,0,0,0.04)", borderRadius:"12px", marginBottom:"32px", width:"fit-content" }}>
        <button style={TAB_STYLE(activeTab==="exports")} onClick={()=>setActiveTab("exports")}>📤 Exports & Rapports</button>
        <button style={TAB_STYLE(activeTab==="documents")} onClick={()=>setActiveTab("documents")}>📄 Relevés & Documents</button>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* TAB 1 — EXPORTS & RAPPORTS                */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === "exports" && (
        <>
          {/* Sélecteur période */}
          <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"28px", padding:"16px 20px", background:"#fff", borderRadius:"14px", border:"1px solid rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize:"12px", fontWeight:"700", color:"var(--gray)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Période :</span>
            <div style={{ display:"flex", gap:"6px" }}>
              {PERIODES.map(p => (
                <button key={p.key} onClick={()=>setPeriode(p.key)}
                  style={{ padding:"8px 16px", borderRadius:"8px", border:`1.5px solid ${periode===p.key?"var(--gold)":"rgba(0,0,0,0.1)"}`, background:periode===p.key?"rgba(201,169,110,0.08)":"transparent", color:periode===p.key?"var(--gold-dark)":"var(--gray)", fontSize:"12px", fontWeight:"600", cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.2s" }}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ marginLeft:"auto", fontSize:"12px", color:"var(--gray)" }}>
              Données au <strong style={{ color:"var(--noir)" }}>{new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"})}</strong>
            </div>
          </div>

          {/* Cards rapports */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"20px", marginBottom:"32px" }}>
            {RAPPORTS.map(r => (
              <div key={r.key} className="card" style={{ padding:"28px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:r.color, opacity:0.6 }} />
                <div style={{ display:"flex", gap:"14px", alignItems:"center", marginBottom:"16px" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>{r.icon}</div>
                  <div>
                    <h3 style={{ fontFamily:"var(--font-display)", fontSize:"20px", fontWeight:"400", marginBottom:"4px" }}>{r.title}</h3>
                    <p style={{ fontSize:"12px", color:"var(--gray)", lineHeight:1.5 }}>{r.desc}</p>
                  </div>
                </div>
                <div style={{ marginBottom:"16px" }}>
                  <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--gray)", marginBottom:"10px" }}>Contenu</div>
                  {r.items.map((item,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"var(--noir)", marginBottom:"5px" }}>
                      <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:r.color, flexShrink:0 }} />{item}
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"rgba(0,0,0,0.02)", borderRadius:"8px", marginBottom:"14px" }}>
                  <span style={{ fontSize:"11px", color:"var(--gray)" }}>Format : <strong>CSV UTF-8</strong></span>
                  <span style={{ fontSize:"11px", color:"var(--gray)" }}>Période : <strong>{PERIODES.find(p=>p.key===periode)?.label}</strong></span>
                </div>
                <button className="btn-outline" style={{ width:"100%", fontSize:"13px", padding:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}
                  onClick={() => handleDownload(r.key, r.fn)}>
                  {downloading===r.key ? "⏳ Préparation..." : `↓ Télécharger ${r.title}`}
                </button>
              </div>
            ))}
          </div>

          {/* Info CSV */}
          <div style={{ padding:"16px 20px", background:"rgba(201,169,110,0.06)", borderRadius:"12px", border:"1px solid rgba(201,169,110,0.2)", display:"flex", gap:"14px", alignItems:"flex-start" }}>
            <span style={{ fontSize:"20px" }}>💡</span>
            <div>
              <div style={{ fontSize:"13px", fontWeight:"700", color:"var(--noir)", marginBottom:"4px" }}>Ouvrir dans Excel</div>
              <div style={{ fontSize:"12px", color:"var(--gray)", lineHeight:1.6 }}>Données → Obtenir des données externes → Fichier CSV → Séparateur : point-virgule. Google Sheets gère automatiquement.</div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* TAB 2 — RELEVÉS & DOCUMENTS OFFICIELS     */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === "documents" && (
        <>
          {/* Info box */}
          <div style={{ display:"flex", gap:"14px", alignItems:"flex-start", padding:"16px 20px", background:"rgba(59,130,246,0.06)", borderRadius:"12px", border:"1px solid rgba(59,130,246,0.15)", marginBottom:"28px" }}>
            <span style={{ fontSize:"20px" }}>ℹ️</span>
            <div>
              <div style={{ fontSize:"13px", fontWeight:"700", color:"var(--noir)", marginBottom:"4px" }}>Documents officiels LIVRR</div>
              <div style={{ fontSize:"12px", color:"var(--gray)", lineHeight:1.6 }}>
                Téléchargez vos relevés de commission, factures et synthèses mensuelles. Ces documents font foi pour votre comptabilité. Disponibles après le <strong>1er de chaque mois</strong> pour la période précédente.
              </div>
            </div>
          </div>

          {/* KPIs rapides */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:"rgba(0,0,0,0.07)", marginBottom:"28px", borderRadius:"2px", overflow:"hidden" }}>
            {[
              { label:"CA Brut cumulé 2026", value:"107 410 €", sub:"Janvier → Avril 2026" },
              { label:"Commissions LIVRR 2026", value:"21 482 €", sub:"20% du CA brut" },
              { label:"Versements reçus 2026", value:"85 928 €", sub:"CA net après commission" },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", padding:"24px 28px" }}>
                <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.12em", color:"#aaa", marginBottom:"14px" }}>{s.label}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"32px", fontWeight:"300", color:"var(--noir)", lineHeight:1, marginBottom:"8px" }}>{s.value}</div>
                <div style={{ fontSize:"12px", color:"var(--gray)" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tableau relevés par mois */}
          <div className="card" style={{ padding:0, overflow:"hidden", marginBottom:"24px" }}>
            <div style={{ padding:"20px 28px", borderBottom:"1px solid rgba(0,0,0,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Relevés de commission LIVRR</h3>
                <p style={{ fontSize:"12px", color:"var(--gray)", marginTop:"2px" }}>Un relevé officiel par mois — téléchargeable à tout moment</p>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Période</th>
                  <th>CA Brut</th>
                  <th>Commission (20%)</th>
                  <th>Versement boutique</th>
                  <th>Statut</th>
                  <th style={{ textAlign:"right" }}>Documents</th>
                </tr>
              </thead>
              <tbody>
                {MOIS_DISPONIBLES.map(m => (
                  <tr key={m.key}>
                    <td style={{ fontWeight:"600" }}>{m.label}</td>
                    <td style={{ fontFamily:"var(--font-display)", fontSize:"15px" }}>{m.ca.toLocaleString("fr-FR")} €</td>
                    <td style={{ color:"var(--gray)" }}>{m.commission.toLocaleString("fr-FR")} €</td>
                    <td style={{ fontFamily:"var(--font-display)", fontSize:"15px", color:"#10B981", fontWeight:"600" }}>{m.versement.toLocaleString("fr-FR")} €</td>
                    <td>
                      <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"700", background:m.statut==="versé"?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)", color:m.statut==="versé"?"#10B981":"#F59E0B" }}>
                        {m.statut==="versé" ? "✓ Versé" : "⏳ En attente"}
                      </span>
                    </td>
                    <td style={{ textAlign:"right" }}>
                      <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
                        <button className="btn-outline" style={{ fontSize:"11px", padding:"6px 12px", display:"flex", alignItems:"center", gap:"5px" }}
                          onClick={() => exportReleveCommission(m.key)}>
                          📄 Relevé
                        </button>
                        <button className="btn-outline" style={{ fontSize:"11px", padding:"6px 12px", display:"flex", alignItems:"center", gap:"5px" }}
                          onClick={() => exportFacture(m.key)}>
                          🧾 Facture
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Autres documents */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
            {[
              { icon:"📋", title:"Contrat partenariat", desc:"Accord commercial LIVRR — Sandro Paris", date:"Signé le 01/01/2026", btn:"Télécharger" },
              { icon:"🏦", title:"RIB Boutique", desc:"Coordonnées bancaires enregistrées pour les versements", date:"Mis à jour le 15/01/2026", btn:"Voir" },
              { icon:"📑", title:"CGV LIVRR 2026", desc:"Conditions générales de vente partenaire en vigueur", date:"Version 3.2 — Janvier 2026", btn:"Télécharger" },
            ].map(d => (
              <div key={d.title} className="card" style={{ padding:"22px" }}>
                <div style={{ fontSize:"28px", marginBottom:"12px" }}>{d.icon}</div>
                <div style={{ fontWeight:"700", fontSize:"15px", marginBottom:"6px" }}>{d.title}</div>
                <div style={{ fontSize:"12px", color:"var(--gray)", marginBottom:"8px", lineHeight:1.5 }}>{d.desc}</div>
                <div style={{ fontSize:"11px", color:"var(--gray-light)", marginBottom:"16px" }}>{d.date}</div>
                <button className="btn-outline" style={{ width:"100%", fontSize:"12px", padding:"9px" }}
                  onClick={() => toast("Document bientôt disponible", { icon:"🔒" })}>
                  {d.btn}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
