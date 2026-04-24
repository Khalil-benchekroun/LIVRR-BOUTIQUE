import React, { useState } from "react";
import toast from "react-hot-toast";

/* ============================================================
   LIVRR — Rapports & Exports
   Page dédiée pour télécharger tous les rapports
   ============================================================ */

const PERIODES = [
  { key: "mois", label: "Ce mois" },
  { key: "3m", label: "3 mois" },
  { key: "6m", label: "6 mois" },
  { key: "1an", label: "1 an" },
];

// ── Utilitaire CSV ──
const downloadCSV = (filename, content) => {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

const dateStr = () => new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");

// ── Données mock ──
const MOCK = {
  ca_brut: 32480,
  ca_net: 25984,
  commission: 6496,
  commandes_total: 112,
  commandes_livrees: 98,
  commandes_refusees: 7,
  commandes_annulees: 4,
  commandes_retard: 3,
  panier_moyen: 292,
  note_moyenne: 4.8,
  delai_moyen: 42,
  nouveaux_clients: 87,
  taux_fidelisation: "38%",
};

// ── Fonctions export ──
const exportReportingMensuel = (periode) => {
  const sep = ";";
  const lines = [
    "REPORTING MENSUEL LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr()}`,
    "",
    "=== CHIFFRE D'AFFAIRES ===",
    `Indicateur${sep}Valeur`,
    `CA Brut${sep}${MOCK.ca_brut.toLocaleString("fr-FR")} €`,
    `CA Net boutique${sep}${MOCK.ca_net.toLocaleString("fr-FR")} €`,
    `Commission LIVRR (20%)${sep}${MOCK.commission.toLocaleString("fr-FR")} €`,
    `Panier moyen${sep}${MOCK.panier_moyen} €`,
    "",
    "=== COMMANDES ===",
    `Commandes totales${sep}${MOCK.commandes_total}`,
    `Commandes livrées${sep}${MOCK.commandes_livrees}`,
    `Commandes refusées${sep}${MOCK.commandes_refusees}`,
    `Commandes annulées${sep}${MOCK.commandes_annulees}`,
    `Commandes en retard${sep}${MOCK.commandes_retard}`,
    "",
    "=== CLIENTS ===",
    `Nouveaux clients${sep}${MOCK.nouveaux_clients}`,
    `Taux de fidélisation${sep}${MOCK.taux_fidelisation}`,
    `Note moyenne boutique${sep}${MOCK.note_moyenne}/5`,
    `Délai moyen livraison${sep}${MOCK.delai_moyen} min`,
    "",
    "=== TABLEAU MENSUEL ===",
    `Semaine${sep}CA Brut${sep}Commandes${sep}Nouveaux clients`,
    `S1${sep}7 840 €${sep}26${sep}18`,
    `S2${sep}8 120 €${sep}28${sep}22`,
    `S3${sep}8 960 €${sep}31${sep}25`,
    `S4${sep}7 560 €${sep}27${sep}22`,
  ];
  downloadCSV(`reporting_mensuel_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Reporting mensuel téléchargé !", { icon: "📊" });
};

const exportStatistiques = (periode) => {
  const sep = ";";
  const lines = [
    "STATISTIQUES LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr()}`,
    "",
    "=== HEURES DE POINTE ===",
    `Heure${sep}Commandes`,
    "9h;2","10h;5","11h;8","12h;12","13h;9","14h;14",
    "15h;11","16h;16","17h;20","18h;18","19h;10","20h;4",
    "",
    "=== CLIENTS ACTIFS ===",
    `Mois${sep}Nouveaux${sep}Récurrents`,
    "Nov;18;32","Déc;24;41","Jan;31;38","Fév;28;45","Mar;35;52","Avr;22;48",
    "",
    "=== QUALITÉ COMMANDES ===",
    `Mois${sep}Livrées${sep}Refusées${sep}Annulées${sep}En retard`,
    "Nov;287;12;8;15","Déc;341;18;11;22","Jan;298;9;6;18",
    "Fév;312;14;9;12","Mar;356;11;7;10","Avr;389;8;5;8",
    "",
    "=== TOP PRODUITS ===",
    `Produit${sep}CA${sep}Ventes${sep}Tendance`,
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
  const sep = ";";
  const lines = [
    "DONNÉES PRODUITS LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr()}`,
    "",
    "=== CATALOGUE PRODUITS ===",
    `Nom${sep}Marque${sep}Catégorie${sep}Prix${sep}Stock${sep}Statut${sep}Variantes`,
    "Robe Midi Fleurie;Sandro;Vêtements;490 €;22;Actif;XS-L (4 couleurs)",
    "Huile d'Olive Extra Vierge;Terroirs;Épicerie Fine;45 €;50;Actif;—",
    "Parfum Oud 50ml;Maison Crivelli;Beauté;280 €;15;Actif;50ml / 100ml",
    "Sérum Éclat Visage;Augustinus Bader;Beauté;185 €;8;Actif;30ml / 50ml",
    "",
    "=== MOUVEMENTS DE STOCK ===",
    `Produit${sep}Date${sep}Action${sep}Avant${sep}Après${sep}Différence${sep}Acteur`,
    "Robe Midi Fleurie;Aujourd'hui 10:00;Réception fournisseur;18;22;+4;Siham B.",
    "Robe Midi Fleurie;Aujourd'hui 09:00;Vente ORD-8821;19;18;-1;Système",
    "Parfum Oud 50ml;Aujourd'hui 09:15;Vente ORD-8770;17;15;-2;Système",
    "Huile d'Olive;Aujourd'hui 08:30;Réassort;40;50;+10;Youssef L.",
    "",
    "=== ALERTES STOCK ===",
    `Produit${sep}Stock actuel${sep}Seuil alerte${sep}Statut`,
    "Sérum Éclat Visage;8;10;⚠ Stock faible",
    "Parfum Oud 100ml;0;5;🔴 Rupture",
  ];
  downloadCSV(`donnees_produits_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Données produits téléchargées !", { icon: "📦" });
};

const exportPerformances = (periode) => {
  const sep = ";";
  const lines = [
    "PERFORMANCES ÉQUIPE LIVRR",
    `Boutique: Sandro Paris`,
    `Période: ${periode}`,
    `Date export: ${dateStr()}`,
    "",
    "=== PERFORMANCES VENDEURS ===",
    `Vendeur${sep}Rôle${sep}Commandes${sep}CA Généré${sep}Temps moyen${sep}Note client${sep}Taux acceptation`,
    "Siham B.;Manager;45;12 400 €;11 min;4.9/5;98%",
    "Youssef L.;Vendeur Senior;32;8 900 €;14 min;4.7/5;94%",
    "Amine R.;Vendeur Junior;12;2 800 €;18 min;4.5/5;88%",
    "",
    "=== INDICATEURS BOUTIQUE ===",
    `Indicateur${sep}Valeur${sep}Objectif${sep}Statut`,
    `Taux de livraison${sep}${MOCK.commandes_livrees}/${MOCK.commandes_total} (87.5%)${sep}90%${sep}⚠ En dessous`,
    `Délai moyen préparation${sep}13 min${sep}15 min${sep}✓ OK`,
    `Délai moyen livraison${sep}${MOCK.delai_moyen} min${sep}60 min${sep}✓ OK`,
    `Note moyenne boutique${sep}${MOCK.note_moyenne}/5${sep}4.5/5${sep}✓ Excellent`,
    `Taux de refus${sep}6.25%${sep}<5%${sep}⚠ À surveiller`,
    "",
    "=== MOTIFS DE REFUS ===",
    `Motif${sep}Occurrences${sep}CA perdu`,
    "Rupture de stock;28;8 400 €",
    "Hors zone de livraison;19;5 700 €",
    "Délai impossible;14;4 200 €",
    "Produit introuvable;22;6 600 €",
    "Erreur de commande;15;4 500 €",
  ];
  downloadCSV(`performances_${periode}_${dateStr()}.csv`, lines.join("\n"));
  toast.success("Performances téléchargées !", { icon: "🏆" });
};

const exportTout = (periode) => {
  setTimeout(() => exportReportingMensuel(periode), 0);
  setTimeout(() => exportStatistiques(periode), 500);
  setTimeout(() => exportDonneesProduits(periode), 1000);
  setTimeout(() => exportPerformances(periode), 1500);
  toast.success("4 rapports téléchargés !", { icon: "📁", duration: 4000 });
};

export default function Finance() {
  const [periode, setPeriode] = useState("mois");
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (key, fn) => {
    setDownloading(key);
    setTimeout(() => { fn(periode); setDownloading(null); }, 300);
  };

  const RAPPORTS = [
    {
      key: "reporting",
      icon: "📊",
      title: "Reporting mensuel",
      desc: "CA brut, CA net, commission LIVRR, tableau semaine par semaine",
      color: "#C9A96E",
      bg: "rgba(201,169,110,0.06)",
      items: ["Chiffre d'affaires", "Commission LIVRR", "Panier moyen", "Tableau hebdomadaire"],
      fn: exportReportingMensuel,
    },
    {
      key: "stats",
      icon: "📈",
      title: "Statistiques",
      desc: "Heures de pointe, clients actifs, top produits, qualité commandes",
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.06)",
      items: ["Heures de pointe", "Clients actifs / mois", "Top 5 produits", "Qualité commandes"],
      fn: exportStatistiques,
    },
    {
      key: "produits",
      icon: "📦",
      title: "Données produits",
      desc: "Catalogue complet, mouvements de stock, alertes et ruptures",
      color: "#10B981",
      bg: "rgba(16,185,129,0.06)",
      items: ["Catalogue produits", "Mouvements de stock", "Variantes", "Alertes stock"],
      fn: exportDonneesProduits,
    },
    {
      key: "performances",
      icon: "🏆",
      title: "Performances",
      desc: "Performances vendeurs, indicateurs boutique, motifs de refus",
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.06)",
      items: ["Performances vendeurs", "Indicateurs boutique", "Taux de livraison", "Motifs de refus"],
      fn: exportPerformances,
    },
  ];

  return (
    <div className="page" style={{ padding:"44px 52px" }}>

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"40px" }}>
        <div>
          <div style={{ fontSize:"11px", fontWeight:"700", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--gray)", marginBottom:"8px" }}>Données</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"44px", fontWeight:"300", lineHeight:1.1 }}>Rapports & Exports</h1>
          <p style={{ color:"var(--gray)", fontSize:"14px", marginTop:"6px" }}>Téléchargez vos données en format CSV — compatible Excel, Numbers, Google Sheets</p>
        </div>
        <button
          className="btn-gold"
          style={{ fontSize:"13px", padding:"14px 24px", display:"flex", alignItems:"center", gap:"8px" }}
          onClick={() => handleDownload("all", exportTout)}
        >
          {downloading === "all" ? "⏳ Téléchargement..." : "↓ Tout télécharger (4 fichiers)"}
        </button>
      </div>

      {/* SÉLECTEUR PÉRIODE */}
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"36px", padding:"16px 20px", background:"#fff", borderRadius:"14px", border:"1px solid rgba(0,0,0,0.06)" }}>
        <span style={{ fontSize:"12px", fontWeight:"700", color:"var(--gray)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Période :</span>
        <div style={{ display:"flex", gap:"6px" }}>
          {PERIODES.map(p => (
            <button key={p.key} onClick={() => setPeriode(p.key)}
              style={{ padding:"8px 16px", borderRadius:"8px", border:`1.5px solid ${periode===p.key?"var(--gold)":"rgba(0,0,0,0.1)"}`, background:periode===p.key?"rgba(201,169,110,0.08)":"transparent", color:periode===p.key?"var(--gold-dark)":"var(--gray)", fontSize:"12px", fontWeight:"600", cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.2s" }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", fontSize:"12px", color:"var(--gray)" }}>
          Données au <strong style={{ color:"var(--noir)" }}>{new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"})}</strong>
        </div>
      </div>

      {/* CARDS RAPPORTS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"20px", marginBottom:"36px" }}>
        {RAPPORTS.map(r => (
          <div key={r.key} className="card" style={{ padding:"28px", border:`1px solid rgba(0,0,0,0.07)`, position:"relative", overflow:"hidden" }}>
            {/* Accent couleur */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:r.color, opacity:0.6 }} />

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
              <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
                <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>
                  {r.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily:"var(--font-display)", fontSize:"20px", fontWeight:"400", marginBottom:"4px" }}>{r.title}</h3>
                  <p style={{ fontSize:"12px", color:"var(--gray)", lineHeight:1.5 }}>{r.desc}</p>
                </div>
              </div>
            </div>

            {/* Contenu inclus */}
            <div style={{ marginBottom:"20px" }}>
              <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--gray)", marginBottom:"10px" }}>Contenu du fichier</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {r.items.map((item,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"var(--noir)" }}>
                    <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:r.color, flexShrink:0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Format info */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"rgba(0,0,0,0.02)", borderRadius:"8px", marginBottom:"16px" }}>
              <span style={{ fontSize:"11px", color:"var(--gray)" }}>Format : <strong>CSV UTF-8</strong> · Compatible Excel</span>
              <span style={{ fontSize:"11px", color:"var(--gray)" }}>Période : <strong>{PERIODES.find(p=>p.key===periode)?.label}</strong></span>
            </div>

            <button
              className="btn-outline"
              style={{ width:"100%", fontSize:"13px", padding:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                borderColor: downloading===r.key ? r.color : undefined,
                color: downloading===r.key ? r.color : undefined,
              }}
              onClick={() => handleDownload(r.key, r.fn)}
            >
              {downloading === r.key ? "⏳ Préparation..." : `↓ Télécharger ${r.title}`}
            </button>
          </div>
        ))}
      </div>

      {/* HISTORIQUE EXPORTS */}
      <div className="card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:"400" }}>Historique des exports</h3>
          <span style={{ fontSize:"12px", color:"var(--gray)" }}>Les 5 derniers téléchargements</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>Rapport</th><th>Période</th><th>Date</th><th>Format</th><th style={{ textAlign:"right" }}>Action</th></tr>
          </thead>
          <tbody>
            {[
              { rapport:"Reporting mensuel", periode:"30 jours", date:"24/04/2026 · 11:30", format:"CSV" },
              { rapport:"Statistiques", periode:"3 mois", date:"20/04/2026 · 09:15", format:"CSV" },
              { rapport:"Données produits", periode:"Ce mois", date:"15/04/2026 · 14:22", format:"CSV" },
              { rapport:"Performances", periode:"6 mois", date:"10/04/2026 · 16:45", format:"CSV" },
              { rapport:"Tout télécharger (4 fichiers)", periode:"1 an", date:"01/04/2026 · 08:00", format:"CSV ×4" },
            ].map((h,i) => (
              <tr key={i}>
                <td style={{ fontWeight:"600" }}>{h.rapport}</td>
                <td style={{ color:"var(--gray)", fontSize:"13px" }}>{h.periode}</td>
                <td style={{ color:"var(--gray)", fontSize:"13px" }}>{h.date}</td>
                <td><span className="badge badge-gray">{h.format}</span></td>
                <td style={{ textAlign:"right" }}>
                  <span style={{ fontSize:"12px", color:"var(--gray-light)", fontStyle:"italic" }}>Disponible</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INFO BOX */}
      <div style={{ marginTop:"24px", padding:"16px 20px", background:"rgba(201,169,110,0.06)", borderRadius:"12px", border:"1px solid rgba(201,169,110,0.2)", display:"flex", gap:"14px", alignItems:"flex-start" }}>
        <span style={{ fontSize:"20px" }}>💡</span>
        <div>
          <div style={{ fontSize:"13px", fontWeight:"700", color:"var(--noir)", marginBottom:"4px" }}>Comment utiliser les exports</div>
          <div style={{ fontSize:"12px", color:"var(--gray)", lineHeight:1.6 }}>
            Les fichiers CSV sont encodés en UTF-8 avec séparateur point-virgule. Pour ouvrir dans Excel : Données → Obtenir des données externes → Fichier CSV → Séparateur : point-virgule.
            Les fichiers Google Sheets se comportent automatiquement.
          </div>
        </div>
      </div>
    </div>
  );
}
