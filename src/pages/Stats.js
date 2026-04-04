import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function Stats() {
  // --- ÉTAT DES DATES (Format ISO pour les inputs HTML5) ---
  const today = "2026-04-04";
  const [startDate, setStartDate] = useState("2026-03-04");
  const [endDate, setEndDate] = useState(today);

  // --- CALCULATEUR DE DONNÉES (Simule un Backend) ---
  const stats = useMemo(() => {
    const diffInDays = Math.floor(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    const dayFactor = diffInDays <= 0 ? 1 : diffInDays;

    // Simulation de CA basé sur la durée sélectionnée
    const caBrut = 8200 * dayFactor;
    const commRate = 0.2; // 20%
    const commission = caBrut * commRate;
    const caNet = caBrut - commission;

    return {
      caBrut: caBrut.toLocaleString("fr-FR"),
      commission: commission.toLocaleString("fr-FR"),
      caNet: caNet.toLocaleString("fr-FR"),
      orders: Math.floor(28 * dayFactor),
      avgBasket: "292",
      conversion: "4.2",
      newClients: Math.floor(5 * dayFactor),
      retention: "38",
      topProducts: [
        {
          name: "Robe Midi Fleurie",
          sales: Math.floor(4 * dayFactor),
          revenue: (1960 * dayFactor).toLocaleString(),
          growth: "+12%",
        },
        {
          name: "Trench Camel",
          sales: Math.floor(2 * dayFactor),
          revenue: (1780 * dayFactor).toLocaleString(),
          growth: "+5%",
        },
        {
          name: "Sac Cuir Noir",
          sales: Math.floor(1.5 * dayFactor),
          revenue: (1800 * dayFactor).toLocaleString(),
          growth: "-2%",
        },
        {
          name: "Mules Beige T38",
          sales: Math.floor(3 * dayFactor),
          revenue: (750 * dayFactor).toLocaleString(),
          growth: "+25%",
        },
      ],
      hourlyTraffic: [
        2, 5, 8, 12, 18, 25, 32, 45, 38, 30, 28, 35, 42, 55, 68, 75, 62, 48, 35,
        22, 15, 8, 4, 2,
      ], // 24h
    };
  }, [startDate, endDate]);

  const handleExport = (type) => {
    toast.loading(`Préparation de l'export ${type}...`);
    setTimeout(() => toast.success(`Rapport ${type} envoyé par email !`), 2000);
  };

  const setRange = (days) => {
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    toast.success("Analyse mise à jour");
  };

  return (
    <div
      className="page"
      style={{ paddingBottom: "100px", maxWidth: "1600px", margin: "0 auto" }}
    >
      {/* 1. BARRE D'OUTILS BI (Business Intelligence) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          background: "#fff",
          padding: "24px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Business Analytics
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "5px" }}
          >
            Tableau de bord consolidé •{" "}
            <strong>Sandro Paris - Champs-Élysées</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* SÉLECTEUR DE DATES CALENDRIER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#F8F9FA",
              padding: "10px 20px",
              borderRadius: "12px",
              border: "1px solid #EEE",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "var(--gray)",
                }}
              >
                DU
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputDateStyle}
              />
            </div>
            <div
              style={{ width: "1px", height: "30px", background: "#DDD" }}
            ></div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "var(--gray)",
                }}
              >
                AU
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputDateStyle}
              />
            </div>
          </div>

          {/* RACCOURCIS */}
          <div style={{ display: "flex", gap: "5px" }}>
            <button onClick={() => setRange(0)} style={btnQuickStyle}>
              Auj.
            </button>
            <button onClick={() => setRange(7)} style={btnQuickStyle}>
              7J
            </button>
            <button onClick={() => setRange(30)} style={btnQuickStyle}>
              30J
            </button>
          </div>

          <button
            onClick={() => handleExport("EXCEL")}
            style={{
              background: "var(--noir)",
              color: "#fff",
              border: "none",
              padding: "15px 25px",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            📥 EXPORTER BI
          </button>
        </div>
      </div>

      {/* 2. GRILLE DE KPIS FINANCIERS ET OPÉRATIONNELS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          label="C.A BRUT"
          value={`${stats.caBrut} €`}
          sub="+12.4%"
          color="var(--noir)"
        />
        <StatCard
          label="COMM. LIVRR (20%)"
          value={`-${stats.commission} €`}
          sub="Frais plateforme"
          color="var(--error)"
        />
        <StatCard
          label="REVENU NET"
          value={`${stats.caNet} €`}
          sub="Versement estimé"
          color="var(--success)"
        />
        <StatCard
          label="COMMANDES"
          value={stats.orders}
          sub="Volume total"
          color="var(--noir)"
        />
        <StatCard
          label="PANIER MOYEN"
          value={`${stats.avgBasket} €`}
          sub="Stable"
          color="var(--noir)"
        />
        <StatCard
          label="CONVERSION"
          value={`${stats.conversion}%`}
          sub="Top 10% secteur"
          color="var(--gold)"
        />
      </div>

      {/* 3. SECTION ANALYSE GRAPHIQUE COMPLÈTE */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}
      >
        {/* COLONNE GAUCHE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* GRAPH CA : BRUT vs NET */}
          <div
            className="card"
            style={{ minHeight: "480px", position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <h3
                style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}
              >
                Flux Financier Mensuel
              </h3>
              <div style={{ display: "flex", gap: "15px", fontSize: "12px" }}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{ width: 10, height: 10, background: "var(--noir)" }}
                  ></div>{" "}
                  Net
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      background: "rgba(231, 76, 60, 0.2)",
                    }}
                  ></div>{" "}
                  Comm. LIVRR
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                height: "300px",
                gap: "15px",
              }}
            >
              {[30, 45, 60, 80, 55, 90, 110, 85, 75, 95, 120, 105].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        height: `${h * 0.2}%`,
                        background: "rgba(231, 76, 60, 0.2)",
                        borderRadius: "3px 3px 0 0",
                      }}
                    ></div>
                    <div
                      style={{
                        height: `${h * 0.8}%`,
                        background: i === 10 ? "var(--gold)" : "var(--noir)",
                        borderRadius: "0 0 3px 3px",
                        position: "relative",
                      }}
                    >
                      {h > 100 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            width: "100%",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: "bold",
                            marginBottom: "30px",
                          }}
                        >
                          {h}k
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                fontSize: "11px",
                color: "var(--gray)",
                padding: "0 10px",
                fontWeight: "600",
              }}
            >
              <span>JAN</span>
              <span>FÉV</span>
              <span>MAR</span>
              <span>AVR</span>
              <span>MAI</span>
              <span>JUIN</span>
              <span>JUIL</span>
              <span>AOÛT</span>
              <span>SEP</span>
              <span>OCT</span>
              <span>NOV</span>
              <span>DÉC</span>
            </div>
          </div>

          {/* HEATMAP HORAIRE (AFFLUENCE MAGASIN) */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              Densité de Commandes par Heure
            </h3>
            <div
              style={{
                display: "flex",
                gap: "4px",
                height: "60px",
                alignItems: "flex-end",
              }}
            >
              {stats.hourlyTraffic.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${v}%`,
                    background:
                      v > 50 ? "var(--gold)" : "rgba(10, 10, 15, 0.1)",
                    borderRadius: "4px",
                  }}
                  title={`${i}h : ${v} commandes`}
                ></div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                fontSize: "10px",
                color: "var(--gray)",
                fontWeight: "bold",
              }}
            >
              <span>00H</span>
              <span>06H</span>
              <span>12H (Midi)</span>
              <span>18H (Rush)</span>
              <span>23H</span>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* BEST-SELLERS PERFORMANCE */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                marginBottom: "25px",
              }}
            >
              Top Articles
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {stats.topProducts.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "15px",
                    borderBottom: i !== 3 ? "1px solid #F5F5F5" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                      {p.sales} vendus • {p.revenue} €
                    </div>
                  </div>
                  <div
                    style={{
                      color: p.growth.includes("+")
                        ? "var(--success)"
                        : "var(--error)",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  >
                    {p.growth}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn-outline"
              style={{ width: "100%", marginTop: "20px", fontSize: "12px" }}
            >
              Voir Inventaire Complet
            </button>
          </div>

          {/* RÉPARTITION DES CANAUX */}
          <div
            className="card"
            style={{ background: "var(--noir)", color: "#fff" }}
          >
            <h3
              style={{
                fontSize: "18px",
                color: "var(--gold)",
                marginBottom: "20px",
              }}
            >
              Canaux d'Acquisition
            </h3>
            <ChannelRow label="LIVRR App" value="72" color="var(--gold)" />
            <ChannelRow label="Sandro POS (Magasin)" value="18" color="#FFF" />
            <ChannelRow
              label="Click & Collect"
              value="10"
              color="rgba(255,255,255,0.4)"
            />
          </div>

          {/* INSIGHT IA DYNAMIQUE */}
          <div
            className="card"
            style={{
              background: "rgba(201, 169, 110, 0.1)",
              border: "1px dashed var(--gold)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                right: "10px",
                background: "var(--gold)",
                color: "var(--noir)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              IA INSIGHT
            </div>
            <p style={{ fontSize: "12px", lineHeight: "1.6", margin: 0 }}>
              💡 <strong>Analyse :</strong> Vos ventes de <em>Robe Midi</em>{" "}
              augmentent de <strong>15%</strong> chaque samedi entre 14h et 16h.
              Suggestion : Préparez 5 unités en avance pour réduire le temps
              d'attente livreur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS POUR LA SCANNABILITÉ ---

function StatCard({ label, value, sub, color }) {
  return (
    <div
      className="card"
      style={{
        borderTop: `4px solid ${color}`,
        minHeight: "130px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "var(--gray)",
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "22px",
          fontFamily: "var(--font-display)",
          fontWeight: "bold",
          margin: "10px 0",
          color: label.includes("COMM") ? "var(--error)" : "inherit",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: sub.includes("+") ? "var(--success)" : "var(--gray)",
          fontWeight: "600",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function ChannelRow({ label, value, color }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginBottom: "6px",
        }}
      >
        <span>{label}</span>
        <span style={{ fontWeight: "700" }}>{value}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "2px",
        }}
      >
        <div
          style={{ width: `${value}%`, height: "100%", background: color }}
        />
      </div>
    </div>
  );
}

// --- STYLES REUTILISABLES ---
const inputDateStyle = {
  border: "none",
  fontSize: "13px",
  fontWeight: "700",
  outline: "none",
  cursor: "pointer",
  background: "transparent",
  padding: "2px 0",
};
const btnQuickStyle = {
  padding: "8px 12px",
  fontSize: "11px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#FFF",
  fontWeight: "700",
  color: "var(--gray)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};
