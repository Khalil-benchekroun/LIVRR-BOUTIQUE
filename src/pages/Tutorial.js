import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STEPS = [
  {
    id: 1,
    icon: "🏪",
    title: "Bienvenue sur LIVRR",
    subtitle: "Espace Boutique",
    description:
      "Votre tableau de bord pour gérer votre boutique, vos commandes et vos livraisons en temps réel. Ce guide vous prendra moins de 3 minutes.",
    highlight: null,
    tip: null,
  },
  {
    id: 2,
    icon: "📊",
    title: "Votre tableau de bord",
    subtitle: "Vue d'ensemble",
    description:
      "Le Dashboard centralise toutes les informations clés : chiffre du jour, commandes en cours, alertes stock et livraisons actives. C'est votre point de départ à chaque ouverture.",
    highlight: "dashboard",
    tip: "💡 Les alertes en haut sont cliquables — elles vous redirigent directement vers la page concernée.",
  },
  {
    id: 3,
    icon: "📦",
    title: "Gestion des commandes",
    subtitle: "Commandes",
    description:
      "Recevez les commandes en temps réel, assignez un vendeur, changez les statuts (En préparation → Prêt → Remis au livreur) et imprimez les étiquettes QR pour le suivi client.",
    highlight: "orders",
    tip: "💡 Une fois la commande prête, cliquez sur '📦 Imprimer l'étiquette QR' — le client peut scanner le QR code pour suivre sa livraison.",
  },
  {
    id: 4,
    icon: "🛍️",
    title: "Votre catalogue produits",
    subtitle: "Produits & Catégories",
    description:
      "Ajoutez vos produits avec photos, tailles, prix et stock. Chaque photo est analysée automatiquement par notre filtre IA pour garantir la qualité du contenu sur la plateforme.",
    highlight: "catalog",
    tip: "💡 Pensez à maintenir votre stock à jour — les produits à stock zéro sont automatiquement masqués sur l'app client.",
  },
  {
    id: 5,
    icon: "🛵",
    title: "Suivi des livraisons",
    subtitle: "Livraisons en temps réel",
    description:
      "Visualisez en direct la position de vos coursiers sur la carte, assignez des livraisons aux coursiers disponibles et suivez chaque commande jusqu'à la confirmation de livraison.",
    highlight: "livraisons",
    tip: "💡 En cas de problème, utilisez le bouton 'Signaler' — l'équipe LIVRR est immédiatement notifiée et intervient.",
  },
  {
    id: 6,
    icon: "👥",
    title: "Votre équipe vendeurs",
    subtitle: "Gestion des accès",
    description:
      "Créez des sous-comptes pour chaque vendeur avec un email et mot de passe individuels. Définissez précisément leurs accès : commandes, caisse, produits, stats… Activez ou désactivez en un clic.",
    highlight: "vendeurs",
    tip: "💡 Un vendeur avec accès 'Commande Manuelle' peut enregistrer des ventes directement depuis la boutique sans accéder aux données financières.",
  },
  {
    id: 7,
    icon: "👤",
    title: "Base clients",
    subtitle: "Gestion clients",
    description:
      "Consultez et gérez votre base clients. Importez une liste CSV existante, ajoutez des clients manuellement, ou exportez votre base pour votre CRM. Chaque client a deux adresses distinctes : livraison et facturation.",
    highlight: "clients",
    tip: "💡 Exportez régulièrement votre base clients — c'est votre donnée la plus précieuse.",
  },
  {
    id: 8,
    icon: "⭐",
    title: "Avis & Réputation",
    subtitle: "Visibilité sur LIVRR",
    description:
      "Votre note moyenne impacte directement votre visibilité sur l'app client. Répondez aux avis rapidement — les boutiques qui répondent sont mieux référencées sur la plateforme.",
    highlight: "avis",
    tip: "💡 Une note ≥ 4/5 vous donne accès aux mises en avant premium dans les sélections LIVRR.",
  },
  {
    id: 9,
    icon: "💰",
    title: "Finance & Comptabilité",
    subtitle: "Suivi des revenus",
    description:
      "Suivez votre CA, visualisez la commission LIVRR (20%), consultez l'état de vos fonds (versés, en attente PSP 14j) et téléchargez vos documents comptables : relevés, factures, rapports.",
    highlight: "finance",
    tip: "💡 Les fonds sont bloqués 14 jours minimum conformément à la réglementation DSP2 européenne avant versement sur votre compte.",
  },
  {
    id: 10,
    icon: "📅",
    title: "Calendrier des disponibilités",
    subtitle: "Gérez vos créneaux",
    description:
      "Bloquez des jours à l'avance : fermetures exceptionnelles, jours fériés, inventaires. Les clients et LIVRR sont automatiquement notifiés. Évitez les commandes aux mauvais moments.",
    highlight: "calendrier",
    tip: "💡 Planifiez vos fermetures à l'avance — les boutiques avec un calendrier à jour reçoivent moins d'annulations.",
  },
  {
    id: 11,
    icon: "⚙️",
    title: "Paramètres & Abonnement",
    subtitle: "Configuration",
    description:
      "Gérez votre profil boutique, vos horaires d'ouverture, votre statut (Ouvert / Indisponible / Fermé) et votre abonnement. Tout changement d'offre nécessite validation LIVRR + paiement.",
    highlight: "settings",
    tip: "💡 Le statut boutique se change en 1 clic depuis les Paramètres — vos clients en sont informés instantanément.",
  },
  {
    id: 12,
    icon: "🚀",
    title: "Vous êtes prêt !",
    subtitle: "C'est parti",
    description:
      "Vous connaissez maintenant toutes les fonctionnalités de votre espace boutique LIVRR. Notre équipe support est disponible 7j/7 pour vous accompagner. Bonne aventure !",
    highlight: null,
    tip: null,
  },
];

const SECTION_ICONS = {
  dashboard: { icon: "📊", label: "Dashboard", color: "#6366F1" },
  orders: { icon: "📦", label: "Commandes", color: "#F59E0B" },
  catalog: { icon: "🛍️", label: "Catalogue", color: "#EC4899" },
  livraisons: { icon: "🛵", label: "Livraisons", color: "#3B82F6" },
  vendeurs: { icon: "👥", label: "Vendeurs", color: "#10B981" },
  clients: { icon: "👤", label: "Clients", color: "#8B5CF6" },
  avis: { icon: "⭐", label: "Avis", color: "#F59E0B" },
  finance: { icon: "💰", label: "Finance", color: "#10B981" },
  calendrier: { icon: "📅", label: "Calendrier", color: "#6366F1" },
  settings: { icon: "⚙️", label: "Paramètres", color: "#6B7280" },
};

export default function Tutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const step = STEPS[currentStep];
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(index);
      setAnimating(false);
    }, 200);
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) goTo(currentStep + 1);
    else finishTutorial();
  };

  const prev = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  const finishTutorial = () => {
    localStorage.setItem("livrr_tutorial_done", "true");
    setCompleted(true);
  };

  const skipTutorial = () => {
    if (
      window.confirm(
        "Passer le tutoriel ? Vous pourrez le retrouver dans Support > Tutoriel."
      )
    ) {
      localStorage.setItem("livrr_tutorial_done", "true");
      navigate("/");
    }
  };

  const goToDashboard = () => navigate("/");

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") skipTutorial();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentStep]);

  if (completed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "520px",
            animation: "pageFadeIn 0.6s ease",
          }}
        >
          <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎉</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "48px",
              fontWeight: "300",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Félicitations !
          </div>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            Vous maîtrisez maintenant votre espace boutique LIVRR. Votre
            première commande vous attend peut-être déjà.
          </p>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={goToDashboard}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                background: "var(--gold)",
                color: "var(--noir)",
                border: "none",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.05em",
              }}
            >
              Accéder au dashboard →
            </button>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "24px",
            }}
          >
            Retrouvez ce tutoriel à tout moment dans Support → Tutoriel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        display: "flex",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR PROGRESSION */}
      <div
        style={{
          width: "280px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          padding: "32px 0",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 28px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
              fontSize: "22px",
              letterSpacing: "6px",
              fontWeight: "400",
            }}
          >
            LIVRR
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            Guide d'utilisation
          </div>
        </div>

        {/* Barre progression globale */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "8px",
            }}
          >
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            style={{
              height: "3px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--gold-dark), var(--gold))",
                borderRadius: "2px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Liste des étapes */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          {STEPS.map((s, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 28px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: isCurrent
                    ? "rgba(201,169,110,0.08)"
                    : "transparent",
                  borderLeft: isCurrent
                    ? "2px solid var(--gold)"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent)
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone
                      ? "var(--gold)"
                      : isCurrent
                      ? "rgba(201,169,110,0.2)"
                      : "rgba(255,255,255,0.05)",
                    border: isCurrent ? "1.5px solid var(--gold)" : "none",
                    fontSize: "10px",
                    fontWeight: "800",
                    color: isDone
                      ? "var(--noir)"
                      : isCurrent
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: isCurrent ? "600" : "400",
                    color: isCurrent
                      ? "rgba(255,255,255,0.9)"
                      : isDone
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.25)",
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Passer */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={skipTutorial}
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.05em",
            }}
          >
            Passer le tutoriel →
          </button>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: "24px 52px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Étape {currentStep + 1} sur {STEPS.length}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === currentStep ? "24px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    i < currentStep
                      ? "var(--gold)"
                      : i === currentStep
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Zone principale */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
          }}
        >
          <div
            style={{
              maxWidth: "640px",
              width: "100%",
              textAlign: "center",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* Icône */}
            <div
              style={{ fontSize: "72px", marginBottom: "24px", lineHeight: 1 }}
            >
              {step.icon}
            </div>

            {/* Subtitle */}
            {step.subtitle && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "12px",
                  opacity: 0.8,
                }}
              >
                {step.subtitle}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "48px",
                fontWeight: "300",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              {step.title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8,
                marginBottom: step.tip ? "28px" : "48px",
              }}
            >
              {step.description}
            </p>

            {/* Tip */}
            {step.tip && (
              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(201,169,110,0.08)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  borderRadius: "12px",
                  marginBottom: "48px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {step.tip}
                </p>
              </div>
            )}

            {/* Section highlight */}
            {step.highlight && SECTION_ICONS[step.highlight] && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",
                  background: `${SECTION_ICONS[step.highlight].color}15`,
                  border: `1px solid ${SECTION_ICONS[step.highlight].color}33`,
                  borderRadius: "30px",
                  marginBottom: "48px",
                }}
              >
                <span style={{ fontSize: "18px" }}>
                  {SECTION_ICONS[step.highlight].icon}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: SECTION_ICONS[step.highlight].color,
                  }}
                >
                  Section : {SECTION_ICONS[step.highlight].label}
                </span>
              </div>
            )}

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {currentStep > 0 && (
                <button
                  onClick={prev}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  ← Précédent
                </button>
              )}
              <button
                onClick={next}
                style={{
                  padding: "14px 36px",
                  borderRadius: "10px",
                  background:
                    currentStep === STEPS.length - 1
                      ? "var(--gold)"
                      : "var(--gold)",
                  color: "var(--noir)",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.04em",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {currentStep === STEPS.length - 1
                  ? "Terminer le tutoriel ✓"
                  : "Suivant →"}
              </button>
            </div>

            {/* Raccourcis clavier */}
            <div
              style={{
                marginTop: "28px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.15)",
                display: "flex",
                gap: "16px",
                justifyContent: "center",
              }}
            >
              <span>← → Naviguer</span>
              <span>Esc Passer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
