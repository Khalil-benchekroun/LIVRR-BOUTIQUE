import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Vêtements",
  "Accessoires",
  "Chaussures",
  "Beauté",
  "Épicerie Fine",
  "Bijoux",
  "Maison",
  "Sport",
];
const ABONNEMENTS = [
  {
    id: "classic",
    name: "Classic",
    price: 49,
    features: [
      "Catalogue jusqu'à 30 produits",
      "Visibilité géolocalisée",
      "Back-office complet",
      "Statistiques basiques",
      "Onboarding inclus",
    ],
    color: "var(--white)",
    textColor: "var(--noir)",
    tag: null,
  },
  {
    id: "signature",
    name: "Signature",
    price: 199,
    features: [
      "Catalogue jusqu'à 100 produits",
      "Visibilité avancée",
      "Analytics poussés",
      "Live shopping",
      "Campagnes marketing",
    ],
    color: "var(--noir)",
    textColor: "#fff",
    tag: "Populaire",
  },
  {
    id: "prestige",
    name: "Prestige",
    price: 299,
    features: [
      "Catalogue jusqu'à 300 produits",
      "Placements premium",
      "IA stylistique dédiée",
      "Formation équipe",
      "Support prioritaire",
    ],
    color: "linear-gradient(135deg,#1a1608,#2d2310)",
    textColor: "#fff",
    tag: "Ultra Premium",
    isGradient: true,
  },
];

const STEPS = [
  { id: 1, label: "Boutique", icon: "🏪" },
  { id: 2, label: "Catalogue", icon: "🛍️" },
  { id: 3, label: "Horaires", icon: "🕐" },
  { id: 4, label: "Abonnement", icon: "💎" },
  { id: 5, label: "Validation", icon: "✓" },
];

const JOURS = [
  { id: "lun", label: "Lun–Ven" },
  { id: "sam", label: "Samedi" },
  { id: "dim", label: "Dimanche" },
];

// ── Validation par étape ──────────────────────────────────────────
function validateStep(step, data) {
  if (step === 1) {
    if (!data.boutique.name.trim()) return "Le nom de la boutique est requis";
    if (!data.boutique.email.trim()) return "L'email est requis";
    if (!data.boutique.phone.trim()) return "Le téléphone est requis";
    if (!data.boutique.address.trim()) return "L'adresse est requise";
    if (data.boutique.categories.length === 0)
      return "Sélectionnez au moins une catégorie";
  }
  if (step === 2) {
    if (!data.catalogue.description.trim()) return "Décrivez votre boutique";
  }
  if (step === 4) {
    if (!data.abonnement) return "Choisissez un abonnement";
  }
  return null;
}

// ── Composants étapes ─────────────────────────────────────────────

function StepBoutique({ data, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div>
          <label className="label">Nom de la boutique *</label>
          <input
            className="input-field"
            placeholder="Ex: Sandro Paris 8e"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div>
          <label className="label">Type d'enseigne</label>
          <select
            className="input-field"
            value={data.type}
            onChange={(e) => onChange({ ...data, type: e.target.value })}
            style={{ marginBottom: 0 }}
          >
            <option value="independant">Boutique indépendante</option>
            <option value="chaine">Chaîne / Franchise</option>
            <option value="createur">Créateur / Marque propre</option>
            <option value="multimarque">Multi-marques</option>
          </select>
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div>
          <label className="label">Email de contact *</label>
          <input
            className="input-field"
            type="email"
            placeholder="contact@boutique.fr"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div>
          <label className="label">Téléphone *</label>
          <input
            className="input-field"
            type="tel"
            placeholder="+33 1 23 45 67 89"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            style={{ marginBottom: 0 }}
          />
        </div>
      </div>
      <div>
        <label className="label">Adresse de collecte *</label>
        <input
          className="input-field"
          placeholder="42 Avenue Montaigne, 75008 Paris"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          style={{ marginBottom: 0 }}
        />
      </div>
      <div>
        <label className="label">
          Catégories de produits * (plusieurs possibles)
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {CATEGORIES.map((cat) => {
            const active = data.categories.includes(cat);
            return (
              <div
                key={cat}
                onClick={() =>
                  onChange({
                    ...data,
                    categories: active
                      ? data.categories.filter((c) => c !== cat)
                      : [...data.categories, cat],
                  })
                }
                style={{
                  padding: "8px 16px",
                  borderRadius: "30px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: `1.5px solid ${
                    active ? "var(--gold)" : "rgba(0,0,0,0.1)"
                  }`,
                  background: active ? "rgba(201,169,110,0.08)" : "transparent",
                  color: active ? "var(--gold-dark)" : "var(--gray)",
                }}
              >
                {cat}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepCatalogue({ data, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label className="label">Description de votre boutique *</label>
        <textarea
          className="input-field"
          placeholder="Décrivez votre boutique, votre univers, vos valeurs… Ce texte sera visible par les clients sur l'app LIVRR."
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={4}
          style={{ marginBottom: 0, resize: "vertical" }}
        />
        <div
          style={{ fontSize: "11px", color: "var(--gray)", marginTop: "4px" }}
        >
          {data.description.length}/500 caractères
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div>
          <label className="label">Nombre de références en stock</label>
          <select
            className="input-field"
            value={data.stockRange}
            onChange={(e) => onChange({ ...data, stockRange: e.target.value })}
            style={{ marginBottom: 0 }}
          >
            <option value="moins30">Moins de 30</option>
            <option value="30-100">30 à 100</option>
            <option value="100-300">100 à 300</option>
            <option value="plus300">Plus de 300</option>
          </select>
        </div>
        <div>
          <label className="label">Panier moyen estimé</label>
          <select
            className="input-field"
            value={data.avgBasket}
            onChange={(e) => onChange({ ...data, avgBasket: e.target.value })}
            style={{ marginBottom: 0 }}
          >
            <option value="moins100">Moins de 100 €</option>
            <option value="100-300">100 à 300 €</option>
            <option value="300-600">300 à 600 €</option>
            <option value="plus600">Plus de 600 €</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Avez-vous déjà un e-commerce ?</label>
        <div style={{ display: "flex", gap: "10px" }}>
          {["Oui, Shopify", "Oui, WooCommerce", "Oui, autre", "Non"].map(
            (opt) => {
              const active = data.ecommerce === opt;
              return (
                <div
                  key={opt}
                  onClick={() => onChange({ ...data, ecommerce: opt })}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontSize: "13px",
                    fontWeight: "600",
                    border: `1.5px solid ${
                      active ? "var(--gold)" : "rgba(0,0,0,0.1)"
                    }`,
                    background: active
                      ? "rgba(201,169,110,0.06)"
                      : "transparent",
                    color: active ? "var(--gold-dark)" : "var(--gray)",
                  }}
                >
                  {opt}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

function StepHoraires({ data, onChange }) {
  const toggleJour = (id) => {
    const current = data.jours[id];
    onChange({
      ...data,
      jours: { ...data.jours, [id]: { ...current, active: !current.active } },
    });
  };
  const setHoraire = (id, field, val) => {
    onChange({
      ...data,
      jours: { ...data.jours, [id]: { ...data.jours[id], [field]: val } },
    });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontSize: "14px", color: "var(--gray)", lineHeight: 1.6 }}>
        Définissez vos horaires d'ouverture habituels. Vous pourrez les modifier
        à tout moment depuis les Paramètres, et bloquer des jours spéciaux
        depuis le Calendrier des disponibilités.
      </p>
      {JOURS.map((j) => {
        const jour = data.jours[j.id];
        return (
          <div
            key={j.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "16px 20px",
              borderRadius: "12px",
              border: `1px solid ${
                jour.active ? "var(--gold)" : "rgba(0,0,0,0.07)"
              }`,
              background: jour.active ? "rgba(201,169,110,0.03)" : "#FAFAF8",
              transition: "all 0.2s",
            }}
          >
            <div style={{ width: "110px", flexShrink: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>
                {j.label}
              </div>
            </div>
            <button
              onClick={() => toggleJour(j.id)}
              style={{
                width: "40px",
                height: "22px",
                borderRadius: "11px",
                border: "none",
                cursor: "pointer",
                background: jour.active ? "var(--gold)" : "#E5E7EB",
                position: "relative",
                transition: "background 0.3s",
                flexShrink: 0,
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
                  left: jour.active ? "21px" : "3px",
                  transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
            {jour.active ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flex: 1,
                }}
              >
                <input
                  type="time"
                  value={jour.open}
                  onChange={(e) => setHoraire(j.id, "open", e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "14px",
                    fontFamily: "var(--font-body)",
                    background: "#fff",
                    color: "var(--noir)",
                  }}
                />
                <span style={{ color: "var(--gray)", fontSize: "13px" }}>
                  →
                </span>
                <input
                  type="time"
                  value={jour.close}
                  onChange={(e) => setHoraire(j.id, "close", e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "14px",
                    fontFamily: "var(--font-body)",
                    background: "#fff",
                    color: "var(--noir)",
                  }}
                />
              </div>
            ) : (
              <span
                style={{
                  color: "var(--gray)",
                  fontSize: "13px",
                  fontStyle: "italic",
                }}
              >
                Fermé
              </span>
            )}
          </div>
        );
      })}
      <div
        style={{
          padding: "14px 18px",
          background: "rgba(201,169,110,0.06)",
          border: "1px solid rgba(201,169,110,0.2)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "var(--gold-dark)",
            fontWeight: "600",
            marginBottom: "3px",
          }}
        >
          💡 Délais de préparation
        </div>
        <div
          style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.6 }}
        >
          LIVRR recommande de prévoir 10–15 minutes de préparation par commande
          pour garantir la livraison en moins d'1 heure.
        </div>
      </div>
    </div>
  );
}

function StepAbonnement({ selected, onSelect }) {
  return (
    <div>
      <p
        style={{
          fontSize: "14px",
          color: "var(--gray)",
          marginBottom: "24px",
          lineHeight: 1.6,
        }}
      >
        Choisissez l'offre qui correspond à votre boutique. Vous pourrez changer
        d'abonnement à tout moment depuis les Paramètres (soumis à validation
        LIVRR).
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "14px",
        }}
      >
        {ABONNEMENTS.map((plan) => {
          const isActive = selected === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              style={{
                borderRadius: "16px",
                padding: "22px",
                cursor: "pointer",
                background: plan.isGradient ? plan.color : plan.color,
                border: `2px solid ${
                  isActive
                    ? "var(--gold)"
                    : plan.id === "prestige"
                    ? "rgba(201,169,110,0.3)"
                    : "rgba(0,0,0,0.07)"
                }`,
                color: plan.textColor,
                position: "relative",
                transition: "all 0.25s",
                boxShadow: isActive
                  ? "0 8px 32px rgba(201,169,110,0.25)"
                  : "none",
                transform: isActive ? "translateY(-2px)" : "none",
              }}
            >
              {plan.tag && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--gold)",
                    color: "var(--noir)",
                    fontSize: "9px",
                    fontWeight: "800",
                    padding: "3px 12px",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.05em",
                  }}
                >
                  {plan.tag}
                </div>
              )}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "var(--noir)",
                      fontSize: "10px",
                      fontWeight: "800",
                    }}
                  >
                    ✓
                  </span>
                </div>
              )}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: "400",
                  marginBottom: "4px",
                  marginTop: plan.tag ? "8px" : "0",
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  color: plan.id !== "classic" ? "var(--gold)" : "var(--noir)",
                  marginBottom: "14px",
                }}
              >
                {plan.price}€
                <span
                  style={{
                    fontSize: "13px",
                    opacity: 0.5,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  /mois
                </span>
              </div>
              <div
                style={{
                  height: "1px",
                  background:
                    plan.id === "classic"
                      ? "rgba(0,0,0,0.08)"
                      : "rgba(255,255,255,0.1)",
                  marginBottom: "14px",
                }}
              />
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "7px",
                      fontSize: "12px",
                      opacity: 0.85,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "16px",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--gray)",
        }}
      >
        Commission LIVRR : 20% sur chaque vente · Engagement sans durée minimale
      </div>
    </div>
  );
}

function StepValidation({ data }) {
  const plan = ABONNEMENTS.find((a) => a.id === data.abonnement);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: "300",
            marginBottom: "8px",
          }}
        >
          Votre dossier est complet !
        </h2>
        <p style={{ fontSize: "14px", color: "var(--gray)", lineHeight: 1.7 }}>
          Un responsable LIVRR examinera votre demande sous 24h.
          <br />
          Vous recevrez un email de confirmation dès validation.
        </p>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {[
          { icon: "🏪", label: "Boutique", value: data.boutique.name },
          { icon: "📧", label: "Email", value: data.boutique.email },
          { icon: "📍", label: "Adresse", value: data.boutique.address },
          {
            icon: "💎",
            label: "Abonnement",
            value: `${plan?.name} — ${plan?.price}€/mois`,
          },
        ].map((info) => (
          <div
            key={info.label}
            style={{
              background: "#F8F7F4",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{info.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--gray)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "3px",
                }}
              >
                {info.label}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {info.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: "16px 20px",
          background: "var(--info-bg)",
          border: "1px solid var(--info)",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "var(--info)",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          📋 Prochaines étapes
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--info)",
            opacity: 0.8,
            lineHeight: 1.7,
          }}
        >
          1. Validation du dossier par l'équipe LIVRR (24h)
          <br />
          2. Signature de la convention partenaire
          <br />
          3. Activation de votre abonnement et premier versement
          <br />
          4. Onboarding technique avec votre gestionnaire dédié
        </div>
      </div>
    </div>
  );
}

// ── COMPOSANT PRINCIPAL ───────────────────────────────────────────
export default function Onboarding() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    boutique: {
      name: "",
      email: "",
      phone: "",
      address: "",
      categories: [],
      type: "independant",
    },
    catalogue: {
      description: "",
      stockRange: "moins30",
      avgBasket: "100-300",
      ecommerce: "Non",
    },
    horaires: {
      jours: {
        lun: { active: true, open: "10:00", close: "19:00" },
        sam: { active: true, open: "10:00", close: "20:00" },
        dim: { active: false, open: "11:00", close: "18:00" },
      },
    },
    abonnement: null,
  });

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const next = () => {
    const error = validateStep(currentStep, formData);
    if (error) {
      toast.error(error);
      return;
    }
    if (currentStep < STEPS.length) setCurrentStep((s) => s + 1);
  };

  const prev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const error = validateStep(currentStep, formData);
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    try {
      await register(formData.boutique);
      setSubmitted(true);
      toast.success("Dossier envoyé ! Vous serez contacté sous 24h.", {
        icon: "✅",
        duration: 5000,
      });
    } catch (e) {
      toast.error("Une erreur est survenue, réessayez");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "480px", padding: "40px" }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✦</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "42px",
              fontWeight: "300",
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            Bienvenue chez LIVRR
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.8,
              marginBottom: "36px",
            }}
          >
            Votre dossier a été transmis. Un responsable vous contactera à{" "}
            {formData.boutique.email} sous 24 heures ouvrées.
          </p>
          <button
            onClick={() => navigate("/login")}
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
              letterSpacing: "0.06em",
            }}
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F5F2",
        fontFamily: "var(--font-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#0A0A0F",
          padding: "0 48px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--gold)",
            fontSize: "20px",
            letterSpacing: "5px",
            fontWeight: "400",
          }}
        >
          LIVRR
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          Rejoindre la plateforme
        </div>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 48px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px 0" }}>
          {/* Steps */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              marginBottom: "12px",
            }}
          >
            {/* Ligne de fond */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                right: "14px",
                height: "2px",
                background: "rgba(0,0,0,0.08)",
                zIndex: 0,
              }}
            />
            {/* Ligne progress */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                height: "2px",
                background: "var(--gold)",
                zIndex: 0,
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }}
            />

            {STEPS.map((step, i) => {
              const isDone = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div
                  key={step.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    zIndex: 1,
                    cursor: isDone ? "pointer" : "default",
                  }}
                  onClick={() => isDone && setCurrentStep(step.id)}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isDone
                        ? "var(--gold)"
                        : isCurrent
                        ? "var(--noir)"
                        : "#fff",
                      border: `2px solid ${
                        isDone
                          ? "var(--gold)"
                          : isCurrent
                          ? "var(--noir)"
                          : "rgba(0,0,0,0.12)"
                      }`,
                      fontSize: "12px",
                      transition: "all 0.3s",
                      boxShadow: isCurrent
                        ? "0 0 0 4px rgba(10,10,15,0.1)"
                        : "none",
                    }}
                  >
                    {isDone ? (
                      <span
                        style={{
                          color: "var(--noir)",
                          fontWeight: "800",
                          fontSize: "11px",
                        }}
                      >
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: "800",
                          fontSize: "10px",
                        }}
                      >
                        {step.id}
                      </span>
                    ) : (
                      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
                        {step.icon}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: isCurrent
                        ? "var(--noir)"
                        : isDone
                        ? "var(--gold-dark)"
                        : "var(--gray)",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "720px" }}>
          {/* Titre de l'étape */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "6px",
              }}
            >
              Étape {currentStep} sur {STEPS.length}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "36px",
                fontWeight: "300",
                color: "var(--noir)",
                marginBottom: "6px",
              }}
            >
              {currentStep === 1 && "Parlez-nous de votre boutique"}
              {currentStep === 2 && "Votre catalogue & univers"}
              {currentStep === 3 && "Vos horaires d'ouverture"}
              {currentStep === 4 && "Choisissez votre offre"}
              {currentStep === 5 && "Récapitulatif de votre dossier"}
            </h1>
          </div>

          {/* Étape active */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              marginBottom: "24px",
            }}
          >
            {currentStep === 1 && (
              <StepBoutique
                data={formData.boutique}
                onChange={(d) => setFormData({ ...formData, boutique: d })}
              />
            )}
            {currentStep === 2 && (
              <StepCatalogue
                data={formData.catalogue}
                onChange={(d) => setFormData({ ...formData, catalogue: d })}
              />
            )}
            {currentStep === 3 && (
              <StepHoraires
                data={formData.horaires}
                onChange={(d) => setFormData({ ...formData, horaires: d })}
              />
            )}
            {currentStep === 4 && (
              <StepAbonnement
                selected={formData.abonnement}
                onSelect={(v) => setFormData({ ...formData, abonnement: v })}
              />
            )}
            {currentStep === 5 && <StepValidation data={formData} />}
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={currentStep === 1 ? () => navigate("/login") : prev}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.12)",
                background: "transparent",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--gray)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--noir)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")
              }
            >
              {currentStep === 1 ? "← Connexion" : "← Précédent"}
            </button>

            {currentStep < STEPS.length ? (
              <button
                onClick={next}
                className="btn-gold"
                style={{
                  padding: "13px 32px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                }}
              >
                Continuer →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-gold"
                disabled={submitting}
                style={{
                  padding: "13px 32px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Envoi en cours…" : "Envoyer ma demande ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
