import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TRANSACTIONS = [
  {
    id: "TRX-001",
    date: "2026-04-09",
    client: "Sophie Martin",
    produit: "Robe Midi Fleurie",
    categorie: "Vêtements",
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
    produit: "Trench Camel",
    categorie: "Vêtements",
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
    produit: "Parfum Oud 50ml",
    categorie: "Beauté",
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
    produit: "Sac Cuir Noir",
    categorie: "Accessoires",
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
    produit: "Sérum Éclat Visage",
    categorie: "Beauté",
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
    produit: "Blazer Structuré",
    categorie: "Vêtements",
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
    produit: "Sneakers Cuir Blanc",
    categorie: "Chaussures",
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
    produit: "Robe Midi Fleurie",
    categorie: "Vêtements",
    montant: 450,
    commission: 90,
    net: 360,
    statut: "remboursé",
    mode: "Carte",
    commande: "#LV-00220",
  },
  {
    id: "TRX-009",
    date: "2026-03-15",
    client: "Julie Petit",
    produit: "Parfum Oud 50ml",
    categorie: "Beauté",
    montant: 280,
    commission: 56,
    net: 224,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00215",
  },
  {
    id: "TRX-010",
    date: "2026-03-10",
    client: "Emma Bernard",
    produit: "Trench Camel",
    categorie: "Vêtements",
    montant: 890,
    commission: 178,
    net: 712,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00210",
  },
  {
    id: "TRX-011",
    date: "2026-03-05",
    client: "Sophie Martin",
    produit: "Sac Cuir Noir",
    categorie: "Accessoires",
    montant: 1200,
    commission: 240,
    net: 960,
    statut: "versé",
    mode: "Espèces",
    commande: "#LV-00205",
  },
  {
    id: "TRX-012",
    date: "2026-02-28",
    client: "Camille Dupont",
    produit: "Blazer Structuré",
    categorie: "Vêtements",
    montant: 295,
    commission: 59,
    net: 236,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00198",
  },
  {
    id: "TRX-013",
    date: "2026-02-20",
    client: "Marie Laurent",
    produit: "Sérum Éclat Visage",
    categorie: "Beauté",
    montant: 185,
    commission: 37,
    net: 148,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00190",
  },
  {
    id: "TRX-014",
    date: "2026-02-14",
    client: "Julie Petit",
    produit: "Robe Midi Fleurie",
    categorie: "Vêtements",
    montant: 490,
    commission: 98,
    net: 392,
    statut: "versé",
    mode: "Carte",
    commande: "#LV-00185",
  },
  {
    id: "TRX-015",
    date: "2026-01-30",
    client: "Emma Bernard",
    produit: "Sneakers Cuir Blanc",
    categorie: "Chaussures",
    montant: 450,
    commission: 90,
    net: 360,
    statut: "versé",
    mode: "Espèces",
    commande: "#LV-00170",
  },
];

// Données graphique évolution CA (simulées par semaine)
const EVOLUTION_DATA = [
  { periode: "S1 Fév", ca: 2840, net: 2272 },
  { periode: "S2 Fév", ca: 3120, net: 2496 },
  { periode: "S3 Fév", ca: 1890, net: 1512 },
  { periode: "S4 Fév", ca: 4200, net: 3360 },
  { periode: "S1 Mar", ca: 3650, net: 2920 },
  { periode: "S2 Mar", ca: 5100, net: 4080 },
  { periode: "S3 Mar", ca: 2940, net: 2352 },
  { periode: "S4 Mar", ca: 4800, net: 3840 },
  { periode: "S1 Avr", ca: 2315, net: 1852 },
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

function filterPrevPeriode(transactions, periode) {
  const now = new Date("2026-04-09");
  const days = { "7j": 7, "30j": 30, "3m": 90, "6m": 180, "1an": 365 };
  const d = days[periode] || 30;
  const end = new Date(now);
  end.setDate(end.getDate() - d);
  const start = new Date(end);
  start.setDate(start.getDate() - d);
  return transactions.filter(
    (t) => new Date(t.date) >= start && new Date(t.date) < end
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "var(--gray)",
          marginBottom: "6px",
          fontWeight: "600",
        }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{ fontSize: "13px", fontWeight: "700", color: p.color }}
        >
          {p.name === "ca" ? "CA Brut" : "Net boutique"} :{" "}
          {p.value.toLocaleString("fr-FR")} €
        </div>
      ))}
    </div>
  );
};

export default function Finance() {
  const [periode, setPeriode] = useState("30j");
  const [activeTab, setActiveTab] = useState("apercu");

  const filtered = filterByPeriode(TRANSACTIONS, periode);
  const prevPeriod = filterPrevPeriode(TRANSACTIONS, periode);

  const ca = filtered
    .filter((t) => t.statut !== "remboursé")
    .reduce((s, t) => s + t.montant, 0);
  const prevCa = prevPeriod
    .filter((t) => t.statut !== "remboursé")
    .reduce((s, t) => s + t.montant, 0);
  const commissions = filtered
    .filter((t) => t.statut !== "remboursé")
    .reduce((s, t) => s + t.commission, 0);
  const netVerse = filtered
    .filter((t) => t.statut === "versé")
    .reduce((s, t) => s + t.net, 0);
  const enAttente = filtered
    .filter((t) => t.statut === "en_attente")
    .reduce((s, t) => s + t.net, 0);
  const remboursements = filtered
    .filter((t) => t.statut === "remboursé")
    .reduce((s, t) => s + t.montant, 0);

  const evolution =
    prevCa > 0 ? Math.round(((ca - prevCa) / prevCa) * 100) : null;

  // Top produits par CA
  const topProduits = Object.values(
    filtered
      .filter((t) => t.statut !== "remboursé")
      .reduce((acc, t) => {
        if (!acc[t.produit])
          acc[t.produit] = {
            produit: t.produit,
            categorie: t.categorie,
            ca: 0,
            ventes: 0,
          };
        acc[t.produit].ca += t.montant;
        acc[t.produit].ventes += 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b.ca - a.ca)
    .slice(0, 5);

  // Top catégories
  const topCats = Object.values(
    filtered
      .filter((t) => t.statut !== "remboursé")
      .reduce((acc, t) => {
        if (!acc[t.categorie])
          acc[t.categorie] = { categorie: t.categorie, ca: 0 };
        acc[t.categorie].ca += t.montant;
        return acc;
      }, {})
  ).sort((a, b) => b.ca - a.ca);

  const maxCat = topCats[0]?.ca || 1;

  const exportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Client",
      "Produit",
      "Catégorie",
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
      t.produit,
      t.categorie,
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
    <div className="page" style={{ padding: "44px 52px" }}>
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
        <div style={{ display: "flex", gap: "10px" }}>
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
            onClick={() => alert("Génération PDF en cours…")}
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

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "CA Brut",
            value: `${ca.toLocaleString("fr-FR")} €`,
            sub:
              evolution !== null
                ? `${evolution >= 0 ? "+" : ""}${evolution}% vs période préc.`
                : "Toutes transactions",
            color: "var(--noir)",
            bg: "#fff",
            trend: evolution,
          },
          {
            label: "Commission LIVRR",
            value: `${commissions.toLocaleString("fr-FR")} €`,
            sub: "20% sur les ventes",
            color: "var(--error)",
            bg: "var(--error-bg)",
            trend: null,
          },
          {
            label: "Net boutique",
            value: `${(ca - commissions).toLocaleString("fr-FR")} €`,
            sub: "Après commission",
            color: "var(--success)",
            bg: "var(--success-bg)",
            trend: null,
          },
          {
            label: "Versé",
            value: `${netVerse.toLocaleString("fr-FR")} €`,
            sub: "Reçu sur compte",
            color: "var(--gold-dark)",
            bg: "var(--gold-lighter)",
            trend: null,
          },
          {
            label: "En attente",
            value: `${enAttente.toLocaleString("fr-FR")} €`,
            sub: "Délai PSP 14j",
            color: "var(--warning)",
            bg: "var(--warning-bg)",
            trend: null,
          },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ background: s.bg }}>
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
            <div
              style={{
                fontSize: "11px",
                color:
                  s.trend !== null
                    ? s.trend >= 0
                      ? "var(--success)"
                      : "var(--error)"
                    : "var(--gray)",
                fontWeight: s.trend !== null ? "700" : "400",
              }}
            >
              {s.sub}
            </div>
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
        }}
      >
        {[
          { key: "apercu", label: "📊 Aperçu & Performances" },
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Graphique évolution CA */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}
              >
                Évolution du CA
              </h3>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "3px",
                      background: "var(--noir)",
                      display: "inline-block",
                      borderRadius: "2px",
                    }}
                  />
                  CA Brut
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "3px",
                      background: "var(--gold)",
                      display: "inline-block",
                      borderRadius: "2px",
                    }}
                  />
                  Net boutique
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={EVOLUTION_DATA}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.06)"
                />
                <XAxis
                  dataKey="periode"
                  tick={{ fontSize: 11, fill: "var(--gray)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--gray)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="ca"
                  stroke="var(--noir)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--noir)" }}
                  activeDot={{ r: 5 }}
                  name="ca"
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#c9a96e"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#c9a96e" }}
                  activeDot={{ r: 5 }}
                  name="net"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Top produits */}
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                Top produits
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {topProduits.map((p, i) => (
                  <div
                    key={p.produit}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background:
                          i === 0
                            ? "var(--gold)"
                            : i === 1
                            ? "var(--gold-light)"
                            : "var(--gray-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "800",
                        color: i < 2 ? "var(--noir)" : "var(--gray)",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.produit}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {p.categorie} · {p.ventes} vente
                        {p.ventes > 1 ? "s" : ""}
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "var(--noir)",
                        flexShrink: 0,
                      }}
                    >
                      {p.ca.toLocaleString("fr-FR")} €
                    </div>
                  </div>
                ))}
                {topProduits.length === 0 && (
                  <p
                    style={{
                      color: "var(--gray)",
                      fontSize: "13px",
                      textAlign: "center",
                      padding: "16px 0",
                    }}
                  >
                    Aucune vente sur cette période
                  </p>
                )}
              </div>
            </div>

            {/* Top catégories */}
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                Répartition par catégorie
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {topCats.map((c) => (
                  <div key={c.categorie}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>{c.categorie}</span>
                      <span style={{ color: "var(--gray)" }}>
                        {c.ca.toLocaleString("fr-FR")} €
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
                          width: `${Math.round((c.ca / maxCat) * 100)}%`,
                          background:
                            "linear-gradient(90deg, var(--gold-dark), var(--gold))",
                          borderRadius: "3px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
                {topCats.length === 0 && (
                  <p
                    style={{
                      color: "var(--gray)",
                      fontSize: "13px",
                      textAlign: "center",
                      padding: "16px 0",
                    }}
                  >
                    Aucune vente sur cette période
                  </p>
                )}
              </div>
            </div>

            {/* Répartition CA */}
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                Répartition du CA
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  {
                    label: "CA Brut",
                    value: ca,
                    pct: 100,
                    color: "var(--noir)",
                  },
                  {
                    label: "Commission LIVRR 20%",
                    value: commissions,
                    pct: 20,
                    color: "var(--error)",
                  },
                  {
                    label: "Net boutique 80%",
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
                        marginBottom: "5px",
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
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "16px",
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
                    marginBottom: "2px",
                  }}
                >
                  ⏳ DÉLAI PSP EUROPÉEN
                </div>
                <div style={{ fontSize: "12px", color: "var(--warning)" }}>
                  Fonds bloqués <strong>14 jours min.</strong> avant versement
                  (DSP2).
                </div>
              </div>
            </div>

            {/* Statut des fonds */}
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                Statut des fonds
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "16px",
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
                    label: "En attente (14j)",
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
                      padding: "12px 14px",
                      background: item.bg,
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: "13px",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: "12px",
                        color: item.color,
                        fontWeight: "600",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        color: item.color,
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
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--gray)" }}>
                  Prochain versement estimé
                </span>
                <span style={{ fontWeight: "700", fontSize: "13px" }}>
                  23 Avril 2026
                </span>
              </div>
            </div>
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
              {filtered.length} transaction(s)
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
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Commission</th>
                <th>Net</th>
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
                        fontSize: "11px",
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
                    <td style={{ fontSize: "13px" }}>{t.produit}</td>
                    <td>
                      <span
                        className="badge badge-gray"
                        style={{ fontSize: "10px" }}
                      >
                        {t.categorie}
                      </span>
                    </td>
                    <td style={{ fontWeight: "700" }}>{t.montant} €</td>
                    <td style={{ color: "var(--error)", fontSize: "13px" }}>
                      −{t.commission} €
                    </td>
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
            {[
              { label: "CA Brut", value: ca, color: "var(--noir)" },
              {
                label: "Commission",
                value: `−${commissions}`,
                color: "var(--error)",
              },
              {
                label: "Net boutique",
                value: ca - commissions,
                color: "var(--success)",
              },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: s.color,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    marginBottom: "2px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    color: s.color,
                  }}
                >
                  {typeof s.value === "number"
                    ? s.value.toLocaleString("fr-FR")
                    : s.value}{" "}
                  €
                </div>
              </div>
            ))}
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
              padding: "14px 18px",
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
              <strong>Conservation :</strong> Documents conservés 10 ans
              (réglementation française). Contact :{" "}
              <span style={{ color: "var(--gold)" }}>finance@livrr.fr</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
