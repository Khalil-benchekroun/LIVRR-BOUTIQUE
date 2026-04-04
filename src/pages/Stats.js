import React, { useState } from "react";
import toast from "react-hot-toast";

// --- DONNÉES DE SIMULATION (Ce qui prend de la place en temps normal) ---
const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 45000, orders: 120, customers: 85 },
  { month: "Fév", revenue: 52000, orders: 145, customers: 92 },
  { month: "Mar", revenue: 48000, orders: 130, customers: 88 },
  { month: "Avr", revenue: 61000, orders: 190, customers: 110 },
];

const CAT_DISTRIBUTION = [
  { name: "Vêtements", value: 55, color: "var(--noir)" },
  { name: "Épicerie Fine", value: 25, color: "var(--gold)" },
  { name: "Accessoires", value: 20, color: "var(--gray-light)" },
];

export default function Stats() {
  const [period, setPeriod] = useState("30_days");

  // FONCTION DE FILTRAGE (Indispensable selon l'arborescence)
  const handleExport = (format) => {
    toast.success(`Génération du rapport ${format} en cours...`);
  };

  return (
    <div className="page" style={{ paddingBottom: "100px" }}>
      {/* HEADER AVEC FILTRES TEMPPORELS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "42px",
              fontWeight: "400",
            }}
          >
            Data Visualisation
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Rapports analytiques de la boutique Sandro
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <select
            className="input-field"
            style={{ width: "180px", marginBottom: 0 }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7_days">7 derniers jours</option>
            <option value="30_days">30 derniers jours</option>
            <option value="year">Année fiscale 2026</option>
          </select>
          <button
            className="btn-noir"
            style={{
              background: "var(--noir)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
            onClick={() => handleExport("PDF")}
          >
            📥 Export PDF
          </button>
        </div>
      </div>

      {/* RAPPEL DES KPIS PRINCIPAUX (L'essentiel du Dashboard) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          {
            label: "C.A Global",
            value: "245.800 DH",
            sub: "+14% vs 2025",
            color: "var(--gold)",
          },
          {
            label: "Clients Actifs",
            value: "1,240",
            sub: "85 nouveaux cette semaine",
            color: "var(--noir)",
          },
          {
            label: "Panier Moyen",
            value: "890 DH",
            sub: "Stable",
            color: "var(--noir)",
          },
          {
            label: "Taux de Retour",
            value: "2.4%",
            sub: "-0.5% vs mois dernier",
            color: "var(--success)",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="card"
            style={{ borderTop: `4px solid ${kpi.color}` }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--gray)",
                fontWeight: "700",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{ fontSize: "28px", fontFamily: "var(--font-display)" }}
            >
              {kpi.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: kpi.sub.includes("+") ? "var(--success)" : "var(--gray)",
                marginTop: "8px",
              }}
            >
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* GRAPHIQUES ET ANALYSES PROFONDES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* ANALYSE DES VENTES PAR PÉRIODE */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "20px", fontFamily: "var(--font-display)" }}>
              Évolution du Chiffre d'Affaires
            </h3>
            <span style={{ fontSize: "12px", color: "var(--gray)" }}>
              Unité : Milliers de DH
            </span>
          </div>

          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              gap: "15px",
              padding: "0 20px",
            }}
          >
            {[35, 55, 45, 80, 65, 90, 75, 85, 100, 70, 60, 95].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    background: i === 8 ? "var(--gold)" : "var(--noir)",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  {h > 80 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {h}k
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "10px", color: "var(--gray-light)" }}>
                  M{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RÉPARTITION PAR CATÉGORIE (Arborescence Page 20) */}
        <div className="card">
          <h3
            style={{
              fontSize: "20px",
              fontFamily: "var(--font-display)",
              marginBottom: "25px",
            }}
          >
            Top Catégories
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {CAT_DISTRIBUTION.map((cat, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>{cat.name}</span>
                  <span style={{ color: "var(--gray)" }}>
                    {cat.value}% du CA
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#F1F1F1",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${cat.value}%`,
                      height: "100%",
                      background: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "var(--white-2)",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "var(--gray)",
                fontStyle: "italic",
              }}
            >
              "La catégorie <strong>Épicerie Fine</strong> a augmenté de 12% ce
              mois-ci grâce aux nouveaux coffrets."
            </p>
          </div>
        </div>
      </div>

      {/* SECTION PERFORMANCE VENDEURS (Lien avec l'arborescence) */}
      <div className="card">
        <h3
          style={{
            fontSize: "20px",
            fontFamily: "var(--font-display)",
            marginBottom: "20px",
          }}
        >
          Performance du Staff
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>VENDEUR</th>
              <th>OBJECTIF</th>
              <th>RÉALISÉ</th>
              <th>PROGRESSION</th>
              <th style={{ textAlign: "right" }}>STATUT</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Siham B.",
                target: "50k",
                real: "52k",
                prog: 104,
                status: "Prime validée",
              },
              {
                name: "Youssef L.",
                target: "40k",
                real: "38k",
                prog: 95,
                status: "En cours",
              },
              {
                name: "Amine R.",
                target: "20k",
                real: "12k",
                prog: 60,
                status: "À coacher",
              },
            ].map((v, i) => (
              <tr key={i}>
                <td>
                  <strong>{v.name}</strong>
                </td>
                <td>{v.target} DH</td>
                <td style={{ fontWeight: "700" }}>{v.real} DH</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "4px",
                        background: "#eee",
                        width: "60px",
                        borderRadius: "2px",
                      }}
                    >
                      <div
                        style={{
                          width: `${v.prog}%`,
                          height: "100%",
                          background:
                            v.prog >= 100 ? "var(--success)" : "var(--gold)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "11px" }}>{v.prog}%</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: v.prog >= 100 ? "var(--success)" : "var(--gray)",
                    }}
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
