import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STEPS = [
  {
    id: 1,
    icon: "✦",
    title: "Bienvenue sur LIVRR",
    subtitle: "Espace Boutique",
    description:
      "Votre espace de gestion boutique complet. Commandes, catalogue, livraisons, finance — tout est centralisé ici. Ce guide vous prendra environ 5 minutes.",
    highlight: null,
    tip: null,
  },
  {
    id: 2,
    icon: "📊",
    title: "Tableau de bord",
    subtitle: "Vue d'ensemble",
    description:
      "Le Dashboard est votre point de départ quotidien. Vous y voyez le CA du jour, les commandes en cours, les alertes stock et les livraisons actives. Il est personnalisable — cliquez sur '⚙ Personnaliser' pour choisir quels blocs afficher.",
    highlight: "dashboard",
    tip: "💡 Vous pouvez basculer le statut de votre boutique (Ouvert / Indisponible / Fermé) directement depuis le Dashboard — vos clients en sont notifiés instantanément.",
  },
  {
    id: 3,
    icon: "🔔",
    title: "Notifications en temps réel",
    subtitle: "Cloche & alertes",
    description:
      "La cloche dans la sidebar génère des notifications automatiques : nouvelle commande, stock critique, paiement reçu, demande de retour, fonds PSP disponibles. Cliquez sur chaque notification pour la marquer comme lue.",
    highlight: "dashboard",
    tip: "💡 Les alertes du Dashboard sont cliquables — elles vous redirigent directement vers la page concernée (Produits, Commandes, Retours, Finance).",
  },
  {
    id: 4,
    icon: "📦",
    title: "Gestion des commandes",
    subtitle: "Machine à états CDC",
    description:
      "Chaque commande suit un cycle précis : Nouvelle → Acceptée → En préparation → Prête → Prise en charge → Livrée. Vous devez accepter ou refuser chaque commande manuellement. En cas de refus, un motif obligatoire est requis — il est conservé dans l'historique.",
    highlight: "orders",
    tip: "💡 Délai critique : vous avez 3 à 5 minutes pour accepter une commande après le paiement client. Au-delà, la commande est automatiquement annulée et le client remboursé.",
  },
  {
    id: 5,
    icon: "🛍️",
    title: "Catalogue & Quotas",
    subtitle: "Produits & Catégories",
    description:
      "Ajoutez vos produits avec photos, tailles, prix et stock. Chaque photo est filtrée automatiquement par IA. Attention : votre catalogue est limité par votre abonnement — 30 produits (Classic), 100 (Signature) ou 300 (Prestige). Une barre de progression vous indique votre quota restant.",
    highlight: "catalog",
    tip: "💡 Les produits au stock zéro sont automatiquement masqués côté client. Pensez à désactiver plutôt que supprimer pour garder l'historique.",
  },
  {
    id: 6,
    icon: "↩️",
    title: "Gestion des retours",
    subtitle: "Flow CDC complet",
    description:
      "Les retours suivent 5 étapes : Demande reçue → Retour en cours → Reçu & validé → Remboursement en cours → Remboursé. Vous devez confirmer la réception physique du produit et sa conformité. Si conforme, le remboursement est déclenché automatiquement par LIVRR.",
    highlight: "orders",
    tip: "💡 Si le produit reçu est endommagé ou non conforme, vous pouvez refuser le retour avec un motif documenté. Le SAV LIVRR arbitre en cas de litige.",
  },
  {
    id: 7,
    icon: "🛵",
    title: "Suivi des livraisons",
    subtitle: "Temps réel",
    description:
      "Visualisez la position de vos coursiers sur la carte en direct. Assignez un coursier disponible à une commande prête, suivez chaque livraison jusqu'à confirmation. En cas de problème, le bouton 'Signaler' notifie immédiatement l'équipe LIVRR.",
    highlight: "livraisons",
    tip: "💡 Le délai de livraison LIVRR est < 1 heure. Ce délai démarre à partir du moment où vous acceptez la commande — pas au moment du paiement.",
  },
  {
    id: 8,
    icon: "👥",
    title: "Équipe vendeurs",
    subtitle: "Sous-comptes & performances",
    description:
      "Créez des comptes individuels pour chaque vendeur avec email et mot de passe. Définissez leurs permissions (Commandes, POS, Produits, Clients, Stats, Retours). La page affiche les performances de chaque vendeur : CA généré, commandes traitées, note client, temps moyen de préparation.",
    highlight: "vendeurs",
    tip: "💡 Un vendeur avec permission 'Vente manuelle' peut encaisser directement en boutique sans avoir accès aux données financières.",
  },
  {
    id: 9,
    icon: "👤",
    title: "Base clients",
    subtitle: "Gestion & import",
    description:
      "Consultez et gérez vos clients. Chaque fiche comporte deux adresses distinctes (livraison et facturation). Importez une liste CSV existante avec aperçu avant confirmation. Exportez votre base pour votre CRM externe.",
    highlight: "clients",
    tip: "💡 L'historique commandes de chaque client est visible dans la page Messages quand vous chattez avec eux.",
  },
  {
    id: 10,
    icon: "💬",
    title: "Messages clients",
    subtitle: "Chat & réponses rapides",
    description:
      "Répondez aux questions de vos clients avant et après achat. Le bouton ⚡ ouvre les réponses rapides prédéfinies pour gagner du temps. Le bouton 📦 affiche l'historique des commandes du client actif directement dans le chat.",
    highlight: "messages",
    tip: "💡 Les échanges avec les clients et le Support LIVRR sont dans des canaux distincts — évitez toute confusion entre les deux.",
  },
  {
    id: 11,
    icon: "⭐",
    title: "Avis & Réputation",
    subtitle: "Visibilité sur LIVRR",
    description:
      "Votre note moyenne impacte directement votre visibilité dans l'app client. Répondez aux avis rapidement — les boutiques qui répondent sont mieux référencées. Une note ≥ 4/5 vous donne accès aux mises en avant premium de LIVRR.",
    highlight: "avis",
    tip: "💡 Les avis sans réponse sont signalés par un badge orange. Objectif : répondre à tous les avis sous 48h pour maximiser votre score de réputation.",
  },
  {
    id: 12,
    icon: "📈",
    title: "Statistiques",
    subtitle: "Performances & analyses",
    description:
      "Analysez votre CA sur 7j / 30j / 3 mois / 6 mois / 1 an avec comparaison automatique vs période précédente. Visualisez vos heures de pointe, top produits, clients actifs par mois et taux de fidélisation.",
    highlight: "dashboard",
    tip: "💡 Le pic d'activité est généralement entre 17h et 18h — assurez-vous d'avoir votre équipe au complet à ces heures.",
  },
  {
    id: 13,
    icon: "💰",
    title: "Finance & Comptabilité",
    subtitle: "CA, commission & versements",
    description:
      "Suivez votre CA brut, la commission LIVRR (20%), et votre CA net. Les fonds sont bloqués 14 jours minimum (réglementation DSP2) avant versement. Téléchargez vos relevés mensuels, factures de commission et rapports annuels.",
    highlight: "finance",
    tip: "💡 Les remboursements de retours sont déduits automatiquement avant versement. Vérifiez régulièrement l'état de vos fonds 'en attente PSP'.",
  },
  {
    id: 14,
    icon: "📅",
    title: "Calendrier des disponibilités",
    subtitle: "Fermetures & créneaux",
    description:
      "Bloquez des jours à l'avance : fermetures exceptionnelles, jours fériés, inventaires, mode Rush. Les clients et LIVRR sont notifiés automatiquement. Évitez les commandes aux mauvais moments.",
    highlight: "calendrier",
    tip: "💡 Planifiez vos fermetures au moins 48h à l'avance — les boutiques avec un calendrier à jour reçoivent moins d'annulations et ont une meilleure note de fiabilité.",
  },
  {
    id: 15,
    icon: "🎟️",
    title: "Marketing & Promotions",
    subtitle: "Coupons & codes promo",
    description:
      "Créez des codes promotionnels avec deux limites distinctes : nombre d'utilisations total (ex: 100 fois) et nombre d'utilisations par client (ex: 1 fois). Activez ou désactivez vos coupons en un clic.",
    highlight: "marketing",
    tip: "💡 Les coupons LIVRR sont appliqués côté plateforme — vous recevez le montant plein, LIVRR absorbe la réduction dans certains cas de campagnes partenaires.",
  },
  {
    id: 16,
    icon: "⚙️",
    title: "Paramètres boutique",
    subtitle: "Configuration complète",
    description:
      "Gérez vos informations publiques, horaires, zones desservies et délais de préparation. Renseignez vos coordonnées bancaires (IBAN) pour les versements. Choisissez votre abonnement (Classic / Signature / Prestige) — tout changement est soumis à validation LIVRR.",
    highlight: "settings",
    tip: "💡 Les zones desservies impactent directement quels clients peuvent vous commander. Plus vos zones sont précises, moins vous aurez de commandes hors périmètre.",
  },
  {
    id: 17,
    icon: "🔍",
    title: "Recherche globale",
    subtitle: "Ctrl+K",
    description:
      "Appuyez sur Ctrl+K depuis n'importe quelle page pour rechercher simultanément dans vos commandes, produits et clients. Navigation instantanée avec les flèches du clavier. Appuyez sur ? pour voir tous les raccourcis disponibles.",
    highlight: null,
    tip: "💡 Raccourcis de navigation rapide : D = Dashboard, C = Commandes, P = Produits, M = Messages, S = Statistiques, F = Finance, N = Nouvelle vente.",
  },
  {
    id: 18,
    icon: "🆘",
    title: "Support LIVRR",
    subtitle: "Aide & tickets",
    description:
      "En cas de problème, rendez-vous dans Messages & Support → Support LIVRR. Trois canaux disponibles : chat en direct (Lun–Ven 9h–19h), email support@livrr.fr, et ligne urgences. Créez un ticket avec catégorie et priorité pour un suivi structuré.",
    highlight: "messages",
    tip: "💡 Les incidents de livraison et litiges clients doivent être signalés via le Support LIVRR — pas directement au coursier. Notre équipe intervient sous 2 heures.",
  },
  {
    id: 19,
    icon: "🚀",
    title: "Vous êtes prêt !",
    subtitle: "C'est parti",
    description:
      "Vous maîtrisez maintenant l'ensemble de votre espace boutique LIVRR. Notre équipe support est disponible 7j/7 pour vous accompagner. Votre première commande vous attend peut-être déjà.",
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
  messages: { icon: "💬", label: "Messages", color: "#10B981" },
  marketing: { icon: "🎟️", label: "Marketing", color: "#EC4899" },
};

export default function Tutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[currentStep];
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  const goTo = (index) => {
    if (animating || index === currentStep) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(index);
      setAnimating(false);
    }, 180);
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) goTo(currentStep + 1);
    else finish();
  };

  const prev = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  const finish = () => {
    localStorage.setItem("livrr_tutorial_done", "true");
    setCompleted(true);
  };

  const skip = () => {
    if (
      window.confirm(
        "Passer le tutoriel ? Vous pourrez le retrouver dans Support LIVRR."
      )
    ) {
      localStorage.setItem("livrr_tutorial_done", "true");
      navigate("/");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") skip();
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
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "80px",
              color: "var(--gold)",
              marginBottom: "24px",
              lineHeight: 1,
            }}
          >
            ✦
          </div>
          <h1
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
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.8,
              marginBottom: "40px",
            }}
          >
            Vous maîtrisez maintenant votre espace boutique LIVRR.
            <br />
            Votre première commande vous attend peut-être déjà.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px 36px",
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
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "24px",
            }}
          >
            Retrouvez ce tutoriel à tout moment dans Support LIVRR
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
      {/* ── SIDEBAR PROGRESSION ── */}
      <div
        style={{
          width: "272px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "32px 24px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="livrr-logo"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              letterSpacing: "6px",
              fontWeight: "400",
              marginBottom: "4px",
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
            }}
          >
            Guide d'utilisation
          </div>
        </div>

        {/* Progression */}
        <div
          style={{
            padding: "18px 24px",
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
            <span>
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>
          <div
            style={{
              height: "2px",
              background: "rgba(255,255,255,0.07)",
              borderRadius: "1px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--gold-dark), var(--gold))",
                borderRadius: "1px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "6px",
            }}
          >
            {Math.round(progress)}% complété
          </div>
        </div>

        {/* Liste étapes */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
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
                  gap: "10px",
                  padding: "9px 24px",
                  cursor: "pointer",
                  transition: "all 0.15s",
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
                    width: "20px",
                    height: "20px",
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
                    fontSize: "9px",
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
                    fontSize: "11px",
                    fontWeight: isCurrent ? "600" : "400",
                    color: isCurrent
                      ? "rgba(255,255,255,0.9)"
                      : isDone
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.22)",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={skip}
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Passer le tutoriel →
          </button>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header dots */}
        <div
          style={{
            padding: "22px 52px",
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
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              maxWidth: "400px",
            }}
          >
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  width: i === currentStep ? "20px" : "4px",
                  background:
                    i < currentStep
                      ? "var(--gold)"
                      : i === currentStep
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.1)",
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
              maxWidth: "620px",
              width: "100%",
              textAlign: "center",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* Icône */}
            <div
              style={{ fontSize: "64px", marginBottom: "20px", lineHeight: 1 }}
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
                  color: "rgba(201,169,110,0.7)",
                  marginBottom: "10px",
                }}
              >
                {step.subtitle}
              </div>
            )}

            {/* Titre */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "44px",
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
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.85,
                marginBottom: step.tip || step.highlight ? "24px" : "48px",
              }}
            >
              {step.description}
            </p>

            {/* Section highlight badge */}
            {step.highlight && SECTION_ICONS[step.highlight] && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 20px",
                  background: `${SECTION_ICONS[step.highlight].color}14`,
                  border: `1px solid ${SECTION_ICONS[step.highlight].color}33`,
                  borderRadius: "30px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "16px" }}>
                  {SECTION_ICONS[step.highlight].icon}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: SECTION_ICONS[step.highlight].color,
                  }}
                >
                  Section : {SECTION_ICONS[step.highlight].label}
                </span>
              </div>
            )}

            {/* Tip */}
            {step.tip && (
              <div
                style={{
                  padding: "14px 18px",
                  background: "rgba(201,169,110,0.07)",
                  border: "1px solid rgba(201,169,110,0.18)",
                  borderRadius: "10px",
                  marginBottom: "40px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {step.tip}
                </p>
              </div>
            )}

            {/* Spacer si pas de tip */}
            {!step.tip && !step.highlight && <div style={{ height: "8px" }} />}
            {(step.tip || step.highlight) && <div style={{ height: "8px" }} />}

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
                  background: "var(--gold)",
                  color: "var(--noir)",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.04em",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.25)",
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

            {/* Raccourcis */}
            <div
              style={{
                marginTop: "24px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.15)",
                display: "flex",
                gap: "20px",
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
