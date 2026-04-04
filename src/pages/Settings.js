import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { boutique } = useAuth();

  // --- ÉTATS ---
  const [isPaused, setIsPaused] = useState(false);
  const [hours, setHours] = useState({
    lun: "10:00 - 19:00",
    sam: "10:00 - 20:00",
    dim: "Fermé",
  });
  const [notifs, setNotifs] = useState({
    newOrder: true,
    lowStock: true,
    payment: true,
  });

  // --- ACTIONS ---
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      toast.error("Boutique en PAUSE. Invisible sur l'app client.", {
        icon: "⏸️",
      });
    } else {
      toast.success("Boutique EN LIGNE. Prête à livrer !", { icon: "🚀" });
    }
  };

  const handleUpgrade = () => {
    toast.loading("Analyse de votre éligibilité...", { duration: 2000 });
    setTimeout(() => {
      toast.success(
        "Demande d'upgrade envoyée ! Un gestionnaire LIVRR vous contactera sous 24h.",
        {
          icon: "💎",
          duration: 4000,
        }
      );
    }, 2000);
  };

  return (
    <div
      className="page"
      style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "100px" }}
    >
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: "400",
            }}
          >
            Paramètres
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Gérez votre boutique {boutique?.name} sur LIVRR
          </p>
        </div>

        <button
          onClick={togglePause}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            transition: "0.3s",
            background: isPaused ? "var(--error)" : "var(--noir)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          {isPaused ? "⏸️ REPRENDRE L'ACTIVITÉ" : "⚡ ACTIVER MODE RUSH"}
        </button>
      </div>

      {/* GRID LAYOUT PRINCIPAL */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* COLONNE GAUCHE : INFOS & HORAIRES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <h3
              style={{
                marginBottom: "20px",
                fontFamily: "var(--font-display)",
                fontSize: "22px",
              }}
            >
              Profil Enseigne
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label className="label">Nom de la boutique</label>
                <input className="input-field" defaultValue={boutique?.name} />
              </div>
              <div>
                <label className="label">Email de contact</label>
                <input className="input-field" defaultValue={boutique?.email} />
              </div>
              <div>
                <label className="label">Adresse de collecte</label>
                <input
                  className="input-field"
                  defaultValue={boutique?.address}
                />
              </div>
              <button
                className="btn-gold"
                style={{ alignSelf: "flex-start" }}
                onClick={() => toast.success("Profil mis à jour")}
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>

          <div className="card">
            <h3
              style={{
                marginBottom: "20px",
                fontFamily: "var(--font-display)",
                fontSize: "22px",
              }}
            >
              Horaires d'ouverture
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                { id: "lun", label: "Lundi - Vendredi" },
                { id: "sam", label: "Samedi" },
                { id: "dim", label: "Dimanche" },
              ].map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "var(--gray)" }}>
                    {d.label}
                  </span>
                  <input
                    className="input-field"
                    style={{ width: "160px", marginBottom: 0 }}
                    value={hours[d.id]}
                    onChange={(e) =>
                      setHours({ ...hours, [d.id]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : MARKETING, NOTIFS & ABONNEMENT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>QR Code Boutique</h3>
            <div
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #eee",
                display: "inline-block",
                marginBottom: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: "var(--noir)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    border: "12px solid #fff",
                    width: "60px",
                    height: "60px",
                  }}
                ></div>
              </div>
            </div>
            <button className="btn-outline" style={{ width: "100%" }}>
              📥 Télécharger le Kit PLV
            </button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "20px" }}>Alertes & Sons</h3>
            {Object.entries(notifs).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f9f9f9",
                }}
              >
                <span style={{ fontSize: "14px" }}>
                  {k === "newOrder"
                    ? "Nouvelles commandes"
                    : k === "lowStock"
                    ? "Stock faible"
                    : "Virements"}
                </span>
                <button
                  onClick={() => setNotifs({ ...notifs, [k]: !v })}
                  style={{
                    width: "42px",
                    height: "22px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    background: v ? "var(--success)" : "#E5E7EB",
                    position: "relative",
                    transition: "0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: "3px",
                      transition: "0.3s",
                      left: v ? "23px" : "3px",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* SECTION ABONNEMENT SUPÉRIEUR (CDC) */}
          <div
            className="card"
            style={{
              background: "var(--noir)",
              color: "#fff",
              border: "1px solid var(--gold)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gold)",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Plan Actuel
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    margin: "5px 0",
                  }}
                >
                  Premium
                </h2>
              </div>
              <div
                style={{
                  background: "rgba(201, 169, 110, 0.2)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  color: "var(--gold)",
                  fontSize: "12px",
                }}
              >
                20% Comm.
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
              }}
            >
              <p style={{ fontSize: "13px", lineHeight: "1.5", opacity: 0.8 }}>
                Passez à l'offre <strong>Élite</strong> pour réduire votre
                commission à <strong>15%</strong> et bénéficier d'un shooting
                photo offert.
              </p>
              <button
                className="btn-gold"
                onClick={handleUpgrade}
                style={{ width: "100%", marginTop: "15px", fontWeight: "bold" }}
              >
                Demander l'Upgrade Élite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
