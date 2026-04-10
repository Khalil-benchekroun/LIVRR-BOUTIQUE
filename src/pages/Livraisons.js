import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const COURSIERS = [
  {
    id: 1,
    name: "Karim M.",
    phone: "+33 6 11 22 33 44",
    rating: 4.9,
    livraisons: 312,
    status: "en_course",
    avatar: "K",
  },
  {
    id: 2,
    name: "Yacine B.",
    phone: "+33 6 55 66 77 88",
    rating: 4.7,
    livraisons: 198,
    status: "disponible",
    avatar: "Y",
  },
  {
    id: 3,
    name: "Thomas R.",
    phone: "+33 6 99 88 77 66",
    rating: 4.8,
    livraisons: 245,
    status: "en_course",
    avatar: "T",
  },
  {
    id: 4,
    name: "Mehdi S.",
    phone: "+33 6 33 44 55 66",
    rating: 4.6,
    livraisons: 156,
    status: "pause",
    avatar: "M",
  },
];

const LIVRAISONS = [
  {
    id: "LV-00248",
    commande: "#LV-00248",
    client: "Sophie M.",
    adresse: "42 Av. Montaigne, 75008",
    coursier: 1,
    status: "en_route",
    tempsEstime: "8 min",
    heurePrise: "14:12",
    total: 490,
    articles: "Robe Midi × 1",
  },
  {
    id: "LV-00246",
    commande: "#LV-00246",
    client: "Marie L.",
    adresse: "12 Place Vendôme, 75001",
    coursier: 3,
    status: "en_route",
    tempsEstime: "14 min",
    heurePrise: "14:05",
    total: 890,
    articles: "Trench Camel × 1",
  },
  {
    id: "LV-00244",
    commande: "#LV-00244",
    client: "Emma B.",
    adresse: "8 Rue du Bac, 75007",
    coursier: null,
    status: "prete",
    tempsEstime: "—",
    heurePrise: "14:18",
    total: 650,
    articles: "Sérum Éclat × 1",
  },
  {
    id: "LV-00242",
    commande: "#LV-00242",
    client: "Julie P.",
    adresse: "3 Rue Royale, 75008",
    coursier: 1,
    status: "livree",
    tempsEstime: "Livrée",
    heurePrise: "13:50",
    total: 980,
    articles: "Robe Fleurie × 2",
  },
  {
    id: "LV-00240",
    commande: "#LV-00240",
    client: "Camille D.",
    adresse: "18 Av. Victor Hugo, 75016",
    coursier: 3,
    status: "livree",
    tempsEstime: "Livrée",
    heurePrise: "13:30",
    total: 345,
    articles: "Blazer × 1",
  },
];

const STATUS_LIVRAISON = {
  prete: { label: "Prête", color: "#F59E0B", bg: "#FEF3C7", dot: "#F59E0B" },
  en_route: {
    label: "En route",
    color: "#3B82F6",
    bg: "#EFF6FF",
    dot: "#3B82F6",
  },
  livree: {
    label: "Livrée ✓",
    color: "#10B981",
    bg: "#ECFDF5",
    dot: "#10B981",
  },
  probleme: {
    label: "Problème",
    color: "#EF4444",
    bg: "#FEF2F2",
    dot: "#EF4444",
  },
};

const STATUS_COURSIER = {
  disponible: {
    label: "Disponible",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  en_course: {
    label: "En course",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
  },
  pause: { label: "Pause", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

// Simulation position coursier (coordonnées relatives en %)
const POSITIONS = {
  1: { x: 42, y: 38 },
  3: { x: 67, y: 55 },
};

function LiveDot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#10B981",
        boxShadow: "0 0 0 0 rgba(16,185,129,0.4)",
        animation: "livePulse 1.5s infinite",
      }}
    />
  );
}

export default function Livraisons() {
  const [selectedLivraison, setSelectedLivraison] = useState(null);
  const [livraisons, setLivraisons] = useState(LIVRAISONS);
  const [tick, setTick] = useState(0);

  // Simulation temps réel
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const enRoute = livraisons.filter((l) => l.status === "en_route").length;
  const pretes = livraisons.filter((l) => l.status === "prete").length;
  const livrees = livraisons.filter((l) => l.status === "livree").length;
  const dispo = COURSIERS.filter((c) => c.status === "disponible").length;

  const assignerCoursier = (livraisonId, coursierId) => {
    setLivraisons((prev) =>
      prev.map((l) =>
        l.id === livraisonId
          ? {
              ...l,
              coursier: coursierId,
              status: "en_route",
              tempsEstime: "12 min",
            }
          : l
      )
    );
    const c = COURSIERS.find((c) => c.id === coursierId);
    toast.success(`${c.name} assigné à la livraison`, { icon: "🛵" });
  };

  const signalerProbleme = (livraisonId) => {
    setLivraisons((prev) =>
      prev.map((l) => (l.id === livraisonId ? { ...l, status: "probleme" } : l))
    );
    toast.error("Problème signalé — L'équipe LIVRR est notifiée", {
      duration: 4000,
    });
  };

  return (
    <div className="page">
      <style>{`
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes mapPing {
          0%,100% { transform: scale(1); opacity:1; }
          50%      { transform: scale(1.4); opacity:0.7; }
        }
        .livraison-row:hover { background: rgba(201,169,110,0.03) !important; }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
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
            Livraisons
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "6px",
            }}
          >
            <LiveDot />
            <span style={{ fontSize: "13px", color: "var(--gray)" }}>
              Suivi en temps réel · Mis à jour il y a quelques secondes
            </span>
          </div>
        </div>
        <button
          className="btn-outline"
          style={{ fontSize: "12px" }}
          onClick={() => toast("Rapport exporté", { icon: "📊" })}
        >
          Exporter le rapport
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "En route",
            value: enRoute,
            color: "#3B82F6",
            bg: "#EFF6FF",
            icon: "🛵",
          },
          {
            label: "Prêtes",
            value: pretes,
            color: "#F59E0B",
            bg: "#FEF3C7",
            icon: "📦",
          },
          {
            label: "Livrées aujourd'hui",
            value: livrees,
            color: "#10B981",
            bg: "#ECFDF5",
            icon: "✓",
          },
          {
            label: "Coursiers dispos",
            value: dispo,
            color: "#8B5CF6",
            bg: "#F5F3FF",
            icon: "👤",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              background: s.bg,
              border: `1px solid ${s.color}22`,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: s.color,
                }}
              >
                {s.label}
              </div>
              <span style={{ fontSize: "18px" }}>{s.icon}</span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "40px",
                fontWeight: "300",
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "24px",
        }}
      >
        {/* COLONNE GAUCHE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* CARTE SIMULÉE */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                Carte en direct — Paris
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#10B981",
                  fontWeight: "600",
                }}
              >
                <LiveDot /> Live
              </div>
            </div>
            {/* Carte simulée */}
            <div
              style={{
                position: "relative",
                height: "280px",
                background: "linear-gradient(135deg, #F8F6F0 0%, #EDE9E0 100%)",
                overflow: "hidden",
              }}
            >
              {/* Grille rues simulées */}
              {[20, 40, 60, 80].map((p) => (
                <div
                  key={p}
                  style={{
                    position: "absolute",
                    left: `${p}%`,
                    top: 0,
                    bottom: 0,
                    borderLeft: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
              ))}
              {[25, 50, 75].map((p) => (
                <div
                  key={p}
                  style={{
                    position: "absolute",
                    top: `${p}%`,
                    left: 0,
                    right: 0,
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
              ))}
              {/* Axes principaux */}
              <div
                style={{
                  position: "absolute",
                  left: "30%",
                  top: 0,
                  bottom: 0,
                  borderLeft: "2px solid rgba(0,0,0,0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: 0,
                  right: 0,
                  borderTop: "2px solid rgba(0,0,0,0.1)",
                }}
              />

              {/* Boutique */}
              <div
                style={{
                  position: "absolute",
                  left: "15%",
                  top: "35%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--noir)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    border: "2px solid var(--gold)",
                  }}
                >
                  🏪
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "36px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "var(--noir)",
                    whiteSpace: "nowrap",
                    background: "rgba(255,255,255,0.9)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  Sandro Paris
                </div>
              </div>

              {/* Coursiers en route */}
              {COURSIERS.filter((c) => c.status === "en_course").map((c) => {
                const pos = POSITIONS[c.id] || { x: 50, y: 50 };
                return (
                  <div
                    key={c.id}
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#3B82F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                        animation: "mapPing 2s infinite",
                        border: "2px solid #fff",
                      }}
                    >
                      🛵
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#3B82F6",
                        whiteSpace: "nowrap",
                        background: "rgba(255,255,255,0.95)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {c.name.split(" ")[0]}
                    </div>
                  </div>
                );
              })}

              {/* Destinations clients */}
              {livraisons
                .filter((l) => l.status === "en_route")
                .map((l, i) => (
                  <div
                    key={l.id}
                    style={{
                      position: "absolute",
                      left: `${55 + i * 20}%`,
                      top: `${20 + i * 15}%`,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#F59E0B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
                      }}
                    >
                      📍
                    </div>
                  </div>
                ))}

              {/* Légende */}
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "10px",
                  lineHeight: 1.8,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  🏪 <span>Boutique</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  🛵 <span>Coursier</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  📍 <span>Destination</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE LIVRAISONS */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                Livraisons du jour
              </h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Adresse</th>
                  <th>Coursier</th>
                  <th>ETA</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {livraisons.map((l) => {
                  const st = STATUS_LIVRAISON[l.status];
                  const coursier = COURSIERS.find((c) => c.id === l.coursier);
                  return (
                    <tr
                      key={l.id}
                      className="livraison-row"
                      style={{
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onClick={() => setSelectedLivraison(l)}
                    >
                      <td
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {l.commande}
                      </td>
                      <td style={{ fontWeight: "500" }}>{l.client}</td>
                      <td
                        style={{
                          fontSize: "12px",
                          color: "var(--gray)",
                          maxWidth: "140px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.adresse}
                      </td>
                      <td>
                        {coursier ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                background: "var(--gold-light)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                fontWeight: "700",
                                color: "var(--gold-dark)",
                              }}
                            >
                              {coursier.avatar}
                            </div>
                            <span
                              style={{ fontSize: "12px", fontWeight: "500" }}
                            >
                              {coursier.name}
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--warning)",
                              fontWeight: "600",
                            }}
                          >
                            Non assigné
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color:
                            l.status === "en_route" ? "#3B82F6" : "var(--gray)",
                        }}
                      >
                        {l.tempsEstime}
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "700",
                            background: st.bg,
                            color: st.color,
                          }}
                        >
                          <span
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: st.dot,
                              flexShrink: 0,
                            }}
                          />
                          {st.label}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {l.status === "prete" && !l.coursier && (
                          <select
                            style={{
                              fontSize: "11px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--gold)",
                              background: "var(--gold-lighter)",
                              color: "var(--gold-dark)",
                              cursor: "pointer",
                              fontFamily: "var(--font-body)",
                              fontWeight: "600",
                            }}
                            defaultValue=""
                            onChange={(e) =>
                              e.target.value &&
                              assignerCoursier(l.id, parseInt(e.target.value))
                            }
                          >
                            <option value="" disabled>
                              Assigner…
                            </option>
                            {COURSIERS.filter(
                              (c) => c.status === "disponible"
                            ).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {l.status === "en_route" && (
                          <button
                            onClick={() => signalerProbleme(l.id)}
                            style={{
                              fontSize: "11px",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: "1px solid var(--error)",
                              background: "var(--error-bg)",
                              color: "var(--error)",
                              cursor: "pointer",
                              fontFamily: "var(--font-body)",
                              fontWeight: "600",
                            }}
                          >
                            Signaler
                          </button>
                        )}
                        {l.status === "livree" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#10B981",
                              fontWeight: "600",
                            }}
                          >
                            ✓ OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLONNE DROITE — COURSIERS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: "400",
                marginBottom: "16px",
              }}
            >
              Coursiers
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {COURSIERS.map((c) => {
                const st = STATUS_COURSIER[c.status];
                const livraisonsActives = livraisons.filter(
                  (l) => l.coursier === c.id && l.status === "en_route"
                );
                return (
                  <div
                    key={c.id}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,0.07)",
                      background: "#FAFAF8",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: livraisonsActives.length ? "10px" : "0",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--gold-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          color: "var(--gold-dark)",
                          flexShrink: 0,
                        }}
                      >
                        {c.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "600", fontSize: "13px" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                          ⭐ {c.rating} · {c.livraisons} livraisons
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          background: st.bg,
                          color: st.color,
                        }}
                      >
                        {st.label}
                      </span>
                    </div>
                    {livraisonsActives.map((l) => (
                      <div
                        key={l.id}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(59,130,246,0.06)",
                          borderRadius: "6px",
                          borderLeft: "2px solid #3B82F6",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#3B82F6",
                          }}
                        >
                          {l.commande}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--gray)",
                            marginTop: "2px",
                          }}
                        >
                          {l.client} · ETA {l.tempsEstime}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DÉTAIL LIVRAISON */}
      {selectedLivraison && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedLivraison(null)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "480px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gold)",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "4px",
                  }}
                >
                  Détail livraison
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    fontWeight: "400",
                  }}
                >
                  {selectedLivraison.commande}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLivraison(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--gray)",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {[
                { label: "Client", value: selectedLivraison.client },
                { label: "Total", value: `${selectedLivraison.total} €` },
                { label: "Articles", value: selectedLivraison.articles },
                {
                  label: "Prise en charge",
                  value: selectedLivraison.heurePrise,
                },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    background: "#F8F7F4",
                    borderRadius: "10px",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray)",
                      textTransform: "uppercase",
                      fontWeight: "700",
                      marginBottom: "4px",
                    }}
                  >
                    {info.label}
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "14px",
                background: "#F8F7F4",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--gray)",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                Adresse de livraison
              </div>
              <div style={{ fontWeight: "500", fontSize: "14px" }}>
                {selectedLivraison.adresse}
              </div>
            </div>
            <button
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => setSelectedLivraison(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
