import React from "react";
import { Link } from "react-router-dom";

/* ============================================================
   LIVRR — Empty States illustrés
   Usage: <EmptyState type="commandes" />
   ============================================================ */

const CONFIGS = {
  commandes: {
    title: "Aucune commande pour l'instant",
    desc: "Vos commandes apparaîtront ici dès qu'un client passera une commande depuis l'app LIVRR.",
    cta: { label: "Voir le catalogue", to: "/produits" },
    color: "#3B82F6",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <rect
          x="30"
          y="40"
          width="140"
          height="90"
          rx="12"
          fill={`${color}10`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <rect x="44" y="56" width="60" height="8" rx="4" fill={`${color}30`} />
        <rect x="44" y="70" width="90" height="6" rx="3" fill={`${color}20`} />
        <rect x="44" y="82" width="70" height="6" rx="3" fill={`${color}20`} />
        <rect
          x="44"
          y="100"
          width="40"
          height="14"
          rx="7"
          fill={color}
          opacity="0.7"
        />
        <circle
          cx="155"
          cy="50"
          r="18"
          fill={`${color}15`}
          stroke={`${color}40`}
          strokeWidth="1.5"
        />
        <path
          d="M148 50l5 5 8-8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        <circle cx="40" cy="30" r="6" fill={`${color}20`} />
        <circle cx="165" cy="120" r="4" fill={`${color}15`} />
        <circle cx="25" cy="100" r="3" fill={`${color}20`} />
      </svg>
    ),
  },

  produits: {
    title: "Votre catalogue est vide",
    desc: "Ajoutez vos premiers produits pour les rendre disponibles sur l'app LIVRR et commencer à recevoir des commandes.",
    cta: { label: "Ajouter un produit", to: "/produits" },
    color: "#EC4899",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <rect
          x="20"
          y="50"
          width="70"
          height="80"
          rx="10"
          fill={`${color}10`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <rect x="25" y="55" width="60" height="35" rx="6" fill={`${color}15`} />
        <rect x="30" y="96" width="40" height="6" rx="3" fill={`${color}30`} />
        <rect
          x="30"
          y="108"
          width="30"
          height="5"
          rx="2.5"
          fill={`${color}20`}
        />
        <rect
          x="110"
          y="50"
          width="70"
          height="80"
          rx="10"
          fill={`${color}10`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <rect
          x="115"
          y="55"
          width="60"
          height="35"
          rx="6"
          fill={`${color}15`}
        />
        <rect x="120" y="96" width="40" height="6" rx="3" fill={`${color}30`} />
        <rect
          x="120"
          y="108"
          width="30"
          height="5"
          rx="2.5"
          fill={`${color}20`}
        />
        <circle
          cx="100"
          cy="40"
          r="16"
          fill={color}
          opacity="0.15"
          stroke={`${color}50`}
          strokeWidth="1.5"
        />
        <path
          d="M100 33v14M93 40h14"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    ),
  },

  clients: {
    title: "Aucun client encore",
    desc: "Vos clients apparaîtront ici après leur première commande. Vous pouvez aussi importer une liste CSV.",
    cta: { label: "Importer des clients", to: "/clients" },
    color: "#8B5CF6",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <circle
          cx="100"
          cy="60"
          r="28"
          fill={`${color}12`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <circle cx="100" cy="54" r="14" fill={`${color}20`} />
        <path
          d="M68 120c0-17.7 14.3-32 32-32s32 14.3 32 32"
          stroke={`${color}40`}
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="148"
          cy="58"
          r="16"
          fill={`${color}10`}
          stroke={`${color}25`}
          strokeWidth="1.5"
        />
        <circle
          cx="52"
          cy="58"
          r="16"
          fill={`${color}10`}
          stroke={`${color}25`}
          strokeWidth="1.5"
        />
        <circle cx="164" cy="30" r="6" fill={`${color}20`} />
        <circle cx="36" cy="110" r="4" fill={`${color}15`} />
      </svg>
    ),
  },

  messages: {
    title: "Aucun message",
    desc: "Vos conversations avec les clients apparaîtront ici. Les clients peuvent vous écrire depuis l'app LIVRR.",
    cta: null,
    color: "#10B981",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <rect
          x="25"
          y="30"
          width="110"
          height="70"
          rx="14"
          fill={`${color}10`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <path
          d="M25 90l15 20v-20"
          fill={`${color}10`}
          stroke={`${color}30`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect
          x="35"
          y="46"
          width="70"
          height="7"
          rx="3.5"
          fill={`${color}30`}
        />
        <rect x="35" y="59" width="50" height="6" rx="3" fill={`${color}20`} />
        <rect x="35" y="71" width="60" height="6" rx="3" fill={`${color}20`} />
        <rect
          x="90"
          y="80"
          width="85"
          height="55"
          rx="12"
          fill={`${color}08`}
          stroke={`${color}20`}
          strokeWidth="1.5"
        />
        <path
          d="M175 124l-12 16v-16"
          fill={`${color}08`}
          stroke={`${color}20`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="100" y="92" width="55" height="6" rx="3" fill={`${color}20`} />
        <rect
          x="100"
          y="104"
          width="40"
          height="5"
          rx="2.5"
          fill={`${color}15`}
        />
      </svg>
    ),
  },

  avis: {
    title: "Aucun avis reçu",
    desc: "Vos premiers avis clients apparaîtront ici après vos premières livraisons. Une bonne note booste votre visibilité.",
    cta: null,
    color: "#F59E0B",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${60 + i * 20} 70 l4 8 9 1-6.5 6.3 1.5 9L${
              60 + i * 20
            } 88l-8 4.3 1.5-9L47 77.3l9-1z`}
            fill={i < 3 ? color : "none"}
            stroke={color}
            strokeWidth="1.5"
            opacity={i < 3 ? "0.4" : "0.2"}
            transform={`translate(${i * 4 - 8},0) scale(0.9)`}
          />
        ))}
        <circle
          cx="100"
          cy="55"
          r="22"
          fill={`${color}12`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <path
          d="M91 55l6 6 12-12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <rect
          x="55"
          y="110"
          width="90"
          height="7"
          rx="3.5"
          fill={`${color}20`}
        />
        <rect x="68" y="122" width="64" height="6" rx="3" fill={`${color}15`} />
      </svg>
    ),
  },

  livraisons: {
    title: "Aucune livraison en cours",
    desc: "Les livraisons actives apparaîtront ici avec la position de vos coursiers en temps réel.",
    cta: { label: "Voir les commandes", to: "/commandes" },
    color: "#3B82F6",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <circle
          cx="100"
          cy="75"
          r="40"
          fill={`${color}08`}
          stroke={`${color}20`}
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="75"
          r="25"
          fill={`${color}10`}
          stroke={`${color}25`}
          strokeWidth="1"
        />
        <circle cx="100" cy="75" r="5" fill={color} opacity="0.4" />
        <path
          d="M75 90 Q100 55 125 70"
          stroke={`${color}40`}
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 3"
        />
        <circle cx="75" cy="90" r="6" fill={`${color}30`} />
        <text x="71" y="94" fontSize="8" fill={color} opacity="0.7">
          🏪
        </text>
        <circle
          cx="152"
          cy="55"
          r="16"
          fill={`${color}15`}
          stroke={`${color}30`}
          strokeWidth="1.5"
        />
        <text x="144" y="60" fontSize="12">
          🛵
        </text>
        <circle cx="40" cy="115" r="5" fill={`${color}20`} />
        <circle cx="165" cy="120" r="4" fill={`${color}15`} />
      </svg>
    ),
  },

  finance: {
    title: "Aucune transaction",
    desc: "Vos premières transactions apparaîtront ici après votre première commande livrée.",
    cta: null,
    color: "#10B981",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <rect
          x="20"
          y="100"
          width="20"
          height="40"
          rx="4"
          fill={`${color}20`}
        />
        <rect x="50" y="80" width="20" height="60" rx="4" fill={`${color}30`} />
        <rect x="80" y="65" width="20" height="75" rx="4" fill={`${color}40`} />
        <rect
          x="110"
          y="50"
          width="20"
          height="90"
          rx="4"
          fill={color}
          opacity="0.5"
        />
        <rect
          x="140"
          y="35"
          width="20"
          height="105"
          rx="4"
          fill={color}
          opacity="0.6"
        />
        <path
          d="M30 100 L60 80 L90 65 L120 50 L150 35"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
        <circle cx="150" cy="35" r="5" fill={color} opacity="0.6" />
        <rect
          x="15"
          y="148"
          width="170"
          height="1.5"
          rx="1"
          fill={`${color}20`}
        />
      </svg>
    ),
  },

  recherche: {
    title: "Aucun résultat trouvé",
    desc: "Essayez avec d'autres mots-clés ou vérifiez l'orthographe.",
    cta: null,
    color: "#6B7280",
    illustration: (color) => (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "180px" }}
      >
        <circle
          cx="88"
          cy="72"
          r="36"
          fill={`${color}10`}
          stroke={`${color}25`}
          strokeWidth="2"
        />
        <line
          x1="114"
          y1="98"
          x2="150"
          y2="134"
          stroke={`${color}40`}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="78"
          y1="62"
          x2="98"
          y2="82"
          stroke={`${color}30`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="98"
          y1="62"
          x2="78"
          y2="82"
          stroke={`${color}30`}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export default function EmptyState({
  type = "commandes",
  title,
  desc,
  cta,
  style = {},
}) {
  const config = CONFIGS[type] || CONFIGS.commandes;
  const finalTitle = title || config.title;
  const finalDesc = desc || config.desc;
  const finalCta = cta !== undefined ? cta : config.cta;
  const color = config.color;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "60px 32px",
        borderRadius: "16px",
        border: "1.5px dashed rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.5)",
        ...style,
      }}
    >
      {/* Illustration SVG */}
      <div style={{ marginBottom: "24px" }}>{config.illustration(color)}</div>

      {/* Titre */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "24px",
          fontWeight: "400",
          color: "var(--noir)",
          marginBottom: "10px",
          letterSpacing: "-0.01em",
        }}
      >
        {finalTitle}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "var(--gray)",
          lineHeight: 1.7,
          maxWidth: "360px",
          marginBottom: finalCta ? "24px" : "0",
        }}
      >
        {finalDesc}
      </p>

      {/* CTA */}
      {finalCta &&
        (finalCta.onClick ? (
          <button
            onClick={finalCta.onClick}
            className="btn-gold"
            style={{ fontSize: "13px" }}
          >
            {finalCta.label}
          </button>
        ) : (
          <Link
            to={finalCta.to}
            className="btn-gold"
            style={{ fontSize: "13px" }}
          >
            {finalCta.label}
          </Link>
        ))}
    </div>
  );
}
