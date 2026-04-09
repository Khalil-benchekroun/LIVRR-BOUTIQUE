import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const PLANS = [
  {
    id: "classic",
    name: "Classic",
    price: 49,
    tag: null,
    description:
      "Entrée accessible, activation rapide, premières ventes immédiates.",
    color: "var(--white)",
    textColor: "var(--noir)",
    features: [
      "Catalogue jusqu'à 30 produits",
      "Visibilité sur la plateforme LIVRR",
      "Mise en avant géolocalisée",
      "Back-office boutique complet",
      "Réception commandes en temps réel",
      "QR code de validation sécurisée",
      "Statistiques basiques (CA, commandes, panier moyen)",
      "Onboarding + support initial",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: 199,
    tag: "Populaire",
    description:
      "Accélération des ventes, performance avancée et visibilité renforcée.",
    color: "var(--noir)",
    textColor: "#fff",
    features: [
      "Tout l'offre Classic",
      "Catalogue jusqu'à 100 produits",
      "Visibilité avancée dans l'application",
      'Priorisation dans les sélections "Coup de cœur"',
      "Analytics avancés (conversion, taux panier, pics horaires)",
      "Accès aux formats live shopping",
      "Campagnes mises en avant (semaine beauté, cadeaux…)",
    ],
  },
  {
    id: "prestige",
    name: "Prestige",
    price: 299,
    tag: "Ultra Premium",
    description:
      "Présence luxe, visibilité maximale, performance et image de marque.",
    color: "linear-gradient(135deg, #1a1608 0%, #2d2310 100%)",
    textColor: "#fff",
    isGradient: true,
    features: [
      "Tout l'offre Signature",
      "Catalogue jusqu'à 300 produits",
      "Placements premium dans l'application",
      "Contenus vidéo & storytelling boutique",
      "IA stylistique dédiée (recommandations, looks, associations)",
      "Formation des équipes boutique",
      "Mise en avant pages éditorialistes",
      "Support dédié prioritaire",
    ],
  },
];

function SubscriptionSection() {
  const [current, setCurrent] = useState("classic");
  // null | { planId, status: "pending_admin" | "pending_payment" | "active" }
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const currentPlan = PLANS.find((p) => p.id === current);

  const handleRequestClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSendRequest = () => {
    setRequest({ planId: selectedPlan.id, status: "pending_admin" });
    setShowModal(false);
    toast.success(
      `Demande envoyée pour l'offre ${selectedPlan.name}. Un gestionnaire LIVRR vous contactera sous 24h.`,
      { icon: "📨", duration: 4000 }
    );
  };

  const handleCancelRequest = () => {
    setRequest(null);
    toast("Demande de changement annulée.", { icon: "↩️" });
  };

  // Simuler validation admin (pour la démo)
  const simulateAdminApproval = () => {
    setRequest((r) => ({ ...r, status: "pending_payment" }));
    toast.success("Demande approuvée par LIVRR ! Procédez au paiement.", {
      icon: "✅",
      duration: 3000,
    });
  };

  const handlePayment = () => {
    toast.loading("Redirection vers le paiement sécurisé...", {
      duration: 2000,
    });
    setTimeout(() => {
      setCurrent(request.planId);
      setRequest(null);
      toast.success(
        `Abonnement ${
          PLANS.find((p) => p.id === request?.planId)?.name
        } activé !`,
        { icon: "🎉", duration: 4000 }
      );
    }, 2000);
  };

  return (
    <>
      <div className="card" style={{ marginTop: "8px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--gold)",
              marginBottom: "6px",
            }}
          >
            Abonnement Boutique
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: "400",
              marginBottom: "6px",
            }}
          >
            Choisissez votre offre
          </h3>
          <p style={{ fontSize: "13px", color: "var(--gray)" }}>
            Abonnement actuel :{" "}
            <strong style={{ color: "var(--noir)" }}>
              {currentPlan?.name}
            </strong>{" "}
            — {currentPlan?.price}€/mois
          </p>
        </div>

        {/* Bannière statut demande en cours */}
        {request && (
          <div
            style={{
              marginBottom: "24px",
              padding: "16px 20px",
              borderRadius: "12px",
              background:
                request.status === "pending_payment"
                  ? "rgba(46,139,87,0.08)"
                  : "rgba(201,169,110,0.08)",
              border: `1px solid ${
                request.status === "pending_payment"
                  ? "rgba(46,139,87,0.3)"
                  : "rgba(201,169,110,0.3)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "22px" }}>
                {request.status === "pending_admin" ? "⏳" : "💳"}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    marginBottom: "2px",
                  }}
                >
                  {request.status === "pending_admin"
                    ? `Demande en attente — Offre ${
                        PLANS.find((p) => p.id === request.planId)?.name
                      }`
                    : `Paiement requis — Offre ${
                        PLANS.find((p) => p.id === request.planId)?.name
                      }`}
                </div>
                <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                  {request.status === "pending_admin"
                    ? "Un gestionnaire LIVRR va examiner votre demande sous 24h."
                    : "Votre demande a été approuvée. Finalisez le paiement pour activer le plan."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              {request.status === "pending_payment" && (
                <button
                  className="btn-gold"
                  style={{ padding: "9px 18px", fontSize: "13px" }}
                  onClick={handlePayment}
                >
                  Payer {PLANS.find((p) => p.id === request.planId)?.price}
                  €/mois
                </button>
              )}
              {/* Bouton démo uniquement */}
              {request.status === "pending_admin" && (
                <button
                  onClick={simulateAdminApproval}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(201,169,110,0.4)",
                    background: "transparent",
                    color: "var(--gold-dark)",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  [Démo] Simuler approbation
                </button>
              )}
              <button
                onClick={handleCancelRequest}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "transparent",
                  color: "var(--gray)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {PLANS.map((plan) => {
            const isActive = current === plan.id;
            const isPending = request?.planId === plan.id;
            const isUpgrade = plan.price > currentPlan?.price;

            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: "16px",
                  padding: "24px",
                  background: plan.isGradient ? plan.color : plan.color,
                  border: isActive
                    ? "2px solid var(--gold)"
                    : isPending
                    ? "2px solid rgba(201,169,110,0.5)"
                    : plan.id === "prestige"
                    ? "2px solid rgba(201,169,110,0.3)"
                    : "2px solid rgba(0,0,0,0.07)",
                  color: plan.textColor,
                  position: "relative",
                  transition: "all 0.25s ease",
                  boxShadow: isActive
                    ? "0 8px 32px rgba(201,169,110,0.2)"
                    : plan.id === "prestige"
                    ? "0 8px 32px rgba(0,0,0,0.15)"
                    : "none",
                  opacity: request && !isPending && !isActive ? 0.5 : 1,
                }}
              >
                {plan.tag && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background:
                        plan.id === "prestige"
                          ? "linear-gradient(135deg, var(--gold), var(--gold-dark))"
                          : "var(--gold)",
                      color: "var(--noir)",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "3px 12px",
                      borderRadius: "20px",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {plan.tag}
                  </div>
                )}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: "var(--gold)",
                      color: "var(--noir)",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    ✓ Actif
                  </div>
                )}
                {isPending && (
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: "rgba(201,169,110,0.15)",
                      color: "var(--gold)",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      border: "1px solid rgba(201,169,110,0.3)",
                    }}
                  >
                    ⏳ En attente
                  </div>
                )}

                <div
                  style={{
                    marginBottom: "16px",
                    marginTop: plan.tag ? "8px" : "0",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "24px",
                      fontWeight: "400",
                      marginBottom: "4px",
                    }}
                  >
                    {plan.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        fontFamily: "var(--font-display)",
                        color:
                          plan.id !== "classic" ? "var(--gold)" : "var(--noir)",
                      }}
                    >
                      {plan.price}€
                    </span>
                    <span style={{ fontSize: "13px", opacity: 0.6 }}>
                      /mois
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      opacity: 0.65,
                      marginTop: "6px",
                      lineHeight: "1.4",
                    }}
                  >
                    {plan.description}
                  </p>
                </div>

                <div
                  style={{
                    height: "1px",
                    background:
                      plan.id === "classic"
                        ? "rgba(0,0,0,0.08)"
                        : "rgba(255,255,255,0.1)",
                    marginBottom: "16px",
                  }}
                />

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 20px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        fontSize: "12px",
                        opacity: 0.85,
                        lineHeight: "1.4",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--gold)",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        ✦
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isActive ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "11px",
                      borderRadius: "10px",
                      border: "1px solid rgba(201,169,110,0.4)",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--gold)",
                    }}
                  >
                    Plan actuel
                  </div>
                ) : isPending ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "11px",
                      borderRadius: "10px",
                      border: "1px solid rgba(201,169,110,0.3)",
                      fontSize: "12px",
                      color: "var(--gold)",
                      opacity: 0.8,
                    }}
                  >
                    Demande en cours…
                  </div>
                ) : (
                  <button
                    disabled={!!request}
                    onClick={() => !request && handleRequestClick(plan)}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "10px",
                      border:
                        plan.id === "classic"
                          ? "1.5px solid rgba(0,0,0,0.15)"
                          : "1.5px solid rgba(201,169,110,0.4)",
                      background: "transparent",
                      color:
                        plan.id === "classic" ? "var(--noir)" : "var(--gold)",
                      cursor: request ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s",
                      fontFamily: "var(--font-body)",
                      opacity: request ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!request)
                        e.currentTarget.style.background =
                          "rgba(201,169,110,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {isUpgrade
                      ? `↑ Passer à ${plan.name}`
                      : `↓ Rétrograder à ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "var(--gray)",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Tout changement d'abonnement nécessite une validation par l'équipe
          LIVRR et un paiement avant activation. Commission sur ventes : 20%.
        </p>
      </div>

      {/* MODAL CONFIRMATION DEMANDE */}
      {showModal && selectedPlan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: "460px",
              width: "100%",
              padding: "36px",
              borderRadius: "20px",
              background: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--gold)",
                marginBottom: "8px",
              }}
            >
              Demande de changement
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: "400",
                marginBottom: "6px",
              }}
            >
              Offre {selectedPlan.name}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              Vous êtes sur le point de demander un changement vers l'offre{" "}
              <strong>{selectedPlan.name}</strong> à{" "}
              <strong>{selectedPlan.price}€/mois</strong>.
            </p>

            <div
              style={{
                background: "var(--gray-bg)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--gray)",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Étapes après votre demande
              </div>
              {[
                { icon: "📨", label: "Demande envoyée à l'équipe LIVRR" },
                {
                  icon: "✅",
                  label: "Validation par un gestionnaire LIVRR (sous 24h)",
                },
                { icon: "💳", label: "Paiement sécurisé pour activer le plan" },
                { icon: "🚀", label: "Nouveau plan actif immédiatement" },
              ].map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: i < 3 ? "10px" : "0",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{step.icon}</span>
                  <span style={{ fontSize: "13px", color: "var(--noir)" }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-gold"
                style={{ flex: 1, padding: "13px" }}
                onClick={handleSendRequest}
              >
                Envoyer la demande
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1, padding: "13px" }}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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

          {/* SECTION ABONNEMENT - placeholder retiré de la colonne */}
        </div>
      </div>

      {/* ABONNEMENT — pleine largeur */}
      <div style={{ marginTop: "24px" }}>
        <SubscriptionSection />
      </div>
    </div>
  );
}
