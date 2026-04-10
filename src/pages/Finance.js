import React, { useState } from "react";

const TRANSACTIONS = [
  {
    id: "TRX-001",
    date: "2026-04-09",
    client: "Sophie Martin",
    montant: 490,
    commission: 98,
    net: 392,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00248",
  },
  {
    id: "TRX-002",
    date: "2026-04-08",
    client: "Camille Dupont",
    montant: 345,
    commission: 69,
    net: 276,
    statut: "en_attente",
    mode: "Carte",
    commande: "#LV-00247",
  },
  {
    id: "TRX-003",
    date: "2026-04-07",
    client: "Marie Laurent",
    montant: 890,
    commission: 178,
    net: 712,
    statut: "en_attente",
    mode: "Espèces",
    commande: "#LV-00246",
  },
  {
    id: "TRX-004",
    date: "2026-04-05",
    client: "Julie Petit",
    montant: 980,
    commission: 196,
    net: 784,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00245",
  },
  {
    id: "TRX-005",
    date: "2026-04-03",
    client: "Emma Bernard",
    montant: 650,
    commission: 130,
    net: 520,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00244",
  },
  {
    id: "TRX-006",
    date: "2026-03-28",
    client: "Sophie Martin",
    montant: 1200,
    commission: 240,
    net: 960,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00231",
  },
  {
    id: "TRX-007",
    date: "2026-03-25",
    client: "Camille Dupont",
    montant: 295,
    commission: 59,
    net: 236,
    statut: "versé",
    mode: "Espèces",
    commande: "#LV-00228",
  },
  {
    id: "TRX-008",
    date: "2026-03-20",
    client: "Marie Laurent",
    montant: 450,
    commission: 90,
    net: 360,
    statut: "remboursé",
    mode: "Carte",
    commande: "#LV-00220",
  },
];

const PERIODES = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "3m", label: "3 mois" },
  { key: "6m", label: "6 mois" },
  { key: "1an", label: "1 an" },
];

const STATUT_CONFIG = {
  versé: { label: "Versé", cls: "badge-success", icon: "✓" },
  en_attente: { label: "En attente (14j)", cls: "badge-warning", icon: "⏳" },
  remboursé: { label: "Remboursé", cls: "badge-error", icon: "↩" },
};

function filterByPeriode(transactions, periode) {
  const now = new Date("2026-04-09");
  const days = { "7j": 7, "30j": 30, "3m": 90, "6m": 180, "1an": 365 };
  const limit = new Date(now);
  limit.setDate(limit.getDate() - (days[periode] || 30));
  return transactions.filter((t) => new Date(t.date) >= limit);
}

export default function Finance() {
  const [periode, setPeriode] = useState("30j");
  const [activeTab, setActiveTab] = useState("apercu"); // apercu | transactions | documents

  const filtered = filterByPeriode(TRANSACTIONS, periode);

  const ca = filtered.reduce(
    (s, t) => s + (t.statut !== "remboursé" ? t.montant : 0),
    0
  );
  const commissions = filtered.reduce(
    (s, t) => s + (t.statut !== "remboursé" ? t.commission : 0),
    0
  );
  const netVerse = filtered
    .filter((t) => t.statut === "versé")
    .reduce((s, t) => s + t.net, 0);
  const enAttente = filtered
    .filter((t) => t.statut === "en_attente")
    .reduce((s, t) => s + t.net, 0);
  const remboursements = filtered
    .filter((t) => t.statut === "remboursé")
    .reduce((s, t) => s + t.montant, 0);

  const exportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Client",
      "Commande",
      "Montant",
      "Commission (20%)",
      "Net boutique",
      "Mode",
      "Statut",
    ];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.client,
      t.commande,
      t.montant + "€",
      t.commission + "€",
      t.net + "€",
      t.mode,
      STATUT_CONFIG[t.statut].label,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `finance_livrr_${periode}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
  };

  const TAB = {
    fontSize: "13px",
    fontWeight: "600",
    padding: "8px 18px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: "400",
            }}
          >
            Finance
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            Reporting comptable · Transactions · Documents
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="btn-outline"
            style={{ fontSize: "13px" }}
            onClick={exportCSV}
          >
            ↓ Exporter CSV
          </button>
          <button
            className="btn-gold"
            style={{ fontSize: "13px" }}
            onClick={() => alert("Génération du rapport PDF en cours…")}
          >
            📄 Rapport PDF
          </button>
        </div>
      </div>

      {/* SÉLECTEUR PÉRIODE */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "28px",
          background: "#fff",
          padding: "6px",
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.07)",
          width: "fit-content",
        }}
      >
        {PERIODES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriode(p.key)}
            style={{
              ...TAB,
              background: periode === p.key ? "var(--noir)" : "transparent",
              color: periode === p.key ? "#fff" : "var(--gray)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "CA Brut",
            value: `${ca.toLocaleString("fr-FR")} €`,
            sub: "Toutes transactions",
            color: "var(--noir)",
            bg: "#fff",
          },
          {
            label: "Commission LIVRR",
            value: `${commissions.toLocaleString("fr-FR")} €`,
            sub: "20% sur les ventes",
            color: "var(--error)",
            bg: "var(--error-bg)",
          },
          {
            label: "Net boutique",
            value: `${(ca - commissions).toLocaleString("fr-FR")} €`,
            sub: "Après commission",
            color: "var(--success)",
            bg: "var(--success-bg)",
          },
          {
            label: "Versé",
            value: `${netVerse.toLocaleString("fr-FR")} €`,
            sub: "Reçu sur compte",
            color: "var(--gold-dark)",
            bg: "var(--gold-lighter)",
          },
          {
            label: "En attente",
            value: `${enAttente.toLocaleString("fr-FR")} €`,
            sub: "Délai PSP 14j",
            color: "var(--warning)",
            bg: "var(--warning-bg)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ background: s.bg, border: `1px solid transparent` }}
          >
            <div className="stat-label">{s.label}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "400",
                color: s.color,
                lineHeight: 1.2,
                marginBottom: "4px",
              }}
            >
              {s.value}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          paddingBottom: "0",
        }}
      >
        {[
          { key: "apercu", label: "📊 Aperçu" },
          { key: "transactions", label: "💳 Transactions" },
          { key: "documents", label: "📄 Documents" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              ...TAB,
              borderRadius: "0",
              paddingBottom: "12px",
              borderBottom: `2px solid ${
                activeTab === t.key ? "var(--gold)" : "transparent"
              }`,
              color: activeTab === t.key ? "var(--noir)" : "var(--gray)",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ONGLET APERÇU ── */}
      {activeTab === "apercu" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Répartition CA */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              Répartition du CA
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                { label: "CA Brut", value: ca, pct: 100, color: "var(--noir)" },
                {
                  label: "Commission LIVRR (20%)",
                  value: commissions,
                  pct: 20,
                  color: "var(--error)",
                },
                {
                  label: "Net boutique (80%)",
                  value: ca - commissions,
                  pct: 80,
                  color: "var(--success)",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ color: "var(--gray)" }}>{item.label}</span>
                    <span style={{ fontWeight: "700", color: item.color }}>
                      {item.value.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "rgba(0,0,0,0.06)",
                      borderRadius: "3px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${item.pct}%`,
                        background: item.color,
                        borderRadius: "3px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* PSP notice */}
            <div
              style={{
                marginTop: "20px",
                padding: "12px 14px",
                background: "var(--warning-bg)",
                borderRadius: "10px",
                border: "1px solid rgba(183,119,13,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "var(--warning)",
                  marginBottom: "3px",
                }}
              >
                ⏳ DÉLAI PSP EUROPÉEN
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--warning)",
                  opacity: 0.9,
                }}
              >
                Les fonds restent sur la plateforme{" "}
                <strong>14 jours minimum</strong> avant versement (conformité
                DSP2).
              </div>
            </div>
          </div>

          {/* Statuts des fonds */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              Statut des fonds
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {[
                {
                  label: "Versés sur compte",
                  value: netVerse,
                  icon: "✓",
                  color: "var(--success)",
                  bg: "var(--success-bg)",
                },
                {
                  label: "En attente (délai 14j)",
                  value: enAttente,
                  icon: "⏳",
                  color: "var(--warning)",
                  bg: "var(--warning-bg)",
                },
                {
                  label: "Remboursements",
                  value: remboursements,
                  icon: "↩",
                  color: "var(--error)",
                  bg: "var(--error-bg)",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px",
                    background: item.bg,
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: item.color,
                        fontWeight: "600",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      color: item.color,
                      fontWeight: "400",
                    }}
                  >
                    {item.value.toLocaleString("fr-FR")} €
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.07)",
                paddingTop: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", color: "var(--gray)" }}>
                Prochain versement estimé
              </span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                23 Avril 2026
              </span>
            </div>
          </div>

          {/* Transactions récentes */}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                marginBottom: "16px",
              }}
            >
              Dernières transactions
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Commission</th>
                  <th>Net boutique</th>
                  <th>Mode</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 5).map((t) => {
                  const cfg = STATUT_CONFIG[t.statut];
                  return (
                    <tr key={t.id}>
                      <td style={{ color: "var(--gray)", fontSize: "13px" }}>
                        {new Date(t.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        {t.commande}
                      </td>
                      <td style={{ fontWeight: "500" }}>{t.client}</td>
                      <td style={{ fontWeight: "700" }}>{t.montant} €</td>
                      <td style={{ color: "var(--error)", fontSize: "13px" }}>
                        −{t.commission} €
                      </td>
                      <td
                        style={{ fontWeight: "700", color: "var(--success)" }}
                      >
                        {t.net} €
                      </td>
                      <td style={{ fontSize: "13px", color: "var(--gray)" }}>
                        {t.mode}
                      </td>
                      <td>
                        <span className={`badge ${cfg.cls}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ONGLET TRANSACTIONS ── */}
      {activeTab === "transactions" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {filtered.length} transaction(s) sur la période
            </span>
            <button
              className="btn-outline"
              style={{ fontSize: "12px", padding: "7px 14px" }}
              onClick={exportCSV}
            >
              ↓ Exporter
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Commande</th>
                <th>Client</th>
                <th>Montant brut</th>
                <th>Commission 20%</th>
                <th>Net boutique</th>
                <th>Mode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const cfg = STATUT_CONFIG[t.statut];
                return (
                  <tr key={t.id}>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: "var(--gray)",
                      }}
                    >
                      {t.id}
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--gray)" }}>
                      {new Date(t.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "700",
                        fontSize: "13px",
                      }}
                    >
                      {t.commande}
                    </td>
                    <td style={{ fontWeight: "500" }}>{t.client}</td>
                    <td style={{ fontWeight: "700" }}>{t.montant} €</td>
                    <td style={{ color: "var(--error)" }}>−{t.commission} €</td>
                    <td style={{ fontWeight: "700", color: "var(--success)" }}>
                      {t.net} €
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--gray)" }}>
                      {t.mode}
                    </td>
                    <td>
                      <span className={`badge ${cfg.cls}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Total footer */}
          <div
            style={{
              padding: "14px 24px",
              borderTop: "2px solid var(--noir)",
              background: "#FAFAF8",
              display: "flex",
              justifyContent: "flex-end",
              gap: "40px",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--gray)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                CA Brut
              </div>
              <div
                style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}
              >
                {ca.toLocaleString("fr-FR")} €
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--error)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Commission
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  color: "var(--error)",
                }}
              >
                −{commissions.toLocaleString("fr-FR")} €
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--success)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Net boutique
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  color: "var(--success)",
                }}
              >
                {(ca - commissions).toLocaleString("fr-FR")} €
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ONGLET DOCUMENTS ── */}
      {activeTab === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              icon: "🧾",
              title: "Relevé de compte — Avril 2026",
              type: "Relevé mensuel",
              date: "09/04/2026",
              statut: "Disponible",
            },
            {
              icon: "🧾",
              title: "Relevé de compte — Mars 2026",
              type: "Relevé mensuel",
              date: "01/04/2026",
              statut: "Disponible",
            },
            {
              icon: "📋",
              title: "Facture commission LIVRR — Mars 2026",
              type: "Facture",
              date: "01/04/2026",
              statut: "Disponible",
            },
            {
              icon: "📋",
              title: "Facture commission LIVRR — Février 2026",
              type: "Facture",
              date: "01/03/2026",
              statut: "Disponible",
            },
            {
              icon: "↩️",
              title: "Avis de remboursement — #LV-00220",
              type: "Remboursement",
              date: "22/03/2026",
              statut: "Disponible",
            },
            {
              icon: "📊",
              title: "Rapport annuel 2025",
              type: "Rapport annuel",
              date: "15/01/2026",
              statut: "Disponible",
            },
          ].map((doc, i) => (
            <div
              key={i}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 20px",
              }}
            >
              <div style={{ fontSize: "28px", flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}
                >
                  {doc.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                  {doc.type} · Généré le {doc.date}
                </div>
              </div>
              <span className="badge badge-success">{doc.statut}</span>
              <button
                className="btn-outline"
                style={{ fontSize: "12px", padding: "7px 14px", flexShrink: 0 }}
                onClick={() => alert(`Téléchargement de "${doc.title}"…`)}
              >
                ↓ Télécharger
              </button>
            </div>
          ))}

          <div
            style={{
              marginTop: "8px",
              padding: "16px 20px",
              background: "var(--gray-bg)",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "var(--gray)",
                lineHeight: 1.6,
              }}
            >
              <strong>Conservation des documents :</strong> Tous les documents
              comptables sont conservés pendant 10 ans conformément à la
              réglementation française. En cas de litige, contactez{" "}
              <span style={{ color: "var(--gold)" }}>finance@livrr.fr</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
