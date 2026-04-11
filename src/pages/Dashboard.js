import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Données ──────────────────────────────────────────────────────
const RECENT_ORDERS = [
  {
    ref: "#LV-00248",
    client: "Sophie M.",
    items: "Robe Midi × 1",
    total: 490,
    status: "transit",
    time: "8 min",
  },
  {
    ref: "#LV-00247",
    client: "Camille D.",
    items: "Blazer × 1, Ceinture × 1",
    total: 345,
    status: "preparing",
    time: "22 min",
  },
  {
    ref: "#LV-00246",
    client: "Marie L.",
    items: "Trench Camel × 1",
    total: 890,
    status: "delivered",
    time: "1h",
  },
  {
    ref: "#LV-00245",
    client: "Julie P.",
    items: "Robe Fleurie × 2",
    total: 980,
    status: "delivered",
    time: "2h",
  },
];

const STATUS_MAP = {
  transit: { label: "En livraison", cls: "badge-info" },
  preparing: { label: "En préparation", cls: "badge-warning" },
  delivered: { label: "Livrée", cls: "badge-success" },
  pending: { label: "En attente", cls: "badge-gray" },
};

const ALERTS = [
  {
    icon: "⚠️",
    text: "Stock faible : Robe Midi (2 restants)",
    color: "var(--warning-bg)",
    border: "var(--warning)",
    link: "/produits",
  },
  {
    icon: "📦",
    text: "3 commandes en attente de préparation",
    color: "var(--info-bg)",
    border: "var(--info)",
    link: "/commandes",
  },
  {
    icon: "↩️",
    text: "Nouvelle demande de retour — Commande #LV-00220",
    color: "var(--error-bg)",
    border: "var(--error)",
    link: "/retours",
  },
  {
    icon: "⏳",
    text: "Fonds disponibles après délai PSP : 712 €",
    color: "var(--gold-lighter)",
    border: "var(--gold)",
    link: "/finance",
  },
];

const STATS = [
  {
    label: "Commandes aujourd'hui",
    target: 12,
    suffix: "",
    sub: "+3 depuis hier",
    trend: "up",
  },
  {
    label: "Chiffre du jour",
    target: 4820,
    suffix: " €",
    sub: "+12% vs hier",
    trend: "up",
  },
  {
    label: "En cours de livraison",
    target: 3,
    suffix: "",
    sub: "Livraison < 1h",
    trend: null,
  },
  {
    label: "Note moyenne",
    target: 4.8,
    suffix: " ★",
    sub: "Sur 248 avis",
    trend: null,
  },
];

const STOCKS_CRITIQUES = [
  { name: "Robe Midi Fleurie", stock: 2, emoji: "👗" },
  { name: "Mules Beige T38", stock: 1, emoji: "👠" },
  { name: "Trench Camel S", stock: 3, emoji: "🧥" },
];

const ACTIONS_RAPIDES = [
  { icon: "➕", label: "Ajouter un produit", path: "/produits" },
  { icon: "📋", label: "Commandes en attente", path: "/commandes" },
  { icon: "💬", label: "Messages clients", path: "/messages" },
  { icon: "🎁", label: "Créer une promotion", path: "/marketing" },
];

// ── Définition des widgets disponibles ───────────────────────────
const ALL_WIDGETS = [
  {
    id: "stats",
    label: "Statistiques clés",
    icon: "📊",
    description: "CA, commandes, livraisons, note",
  },
  {
    id: "alertes",
    label: "Alertes",
    icon: "🔔",
    description: "Stock, retours, PSP, commandes",
  },
  {
    id: "commandes",
    label: "Commandes récentes",
    icon: "📦",
    description: "Dernières commandes en temps réel",
  },
  {
    id: "stocks",
    label: "Stocks critiques",
    icon: "⚠️",
    description: "Produits en stock faible",
  },
  {
    id: "actions",
    label: "Actions rapides",
    icon: "⚡",
    description: "Raccourcis vers les pages clés",
  },
  {
    id: "livraisons",
    label: "Livraisons en cours",
    icon: "🛵",
    description: "Suivi coursiers actifs",
  },
];

const DEFAULT_WIDGETS = ["stats", "alertes", "commandes", "stocks", "actions"];

// ── Composants ────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const isFloat = !Number.isInteger(target);
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      const current = target * eased;
      setDisplay(isFloat ? current.toFixed(1) : Math.floor(current));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

// Widget Stats
function WidgetStats({ visible }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "18px",
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="stat-card gold-top"
          style={{ animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
        >
          <div className="stat-label">{s.label}</div>
          <div className="stat-value" style={{ fontSize: "36px" }}>
            {visible ? (
              <AnimatedNumber
                target={s.target}
                suffix={s.suffix}
                duration={1000 + i * 150}
              />
            ) : (
              `0${s.suffix}`
            )}
          </div>
          <div className={s.trend === "up" ? "stat-trend-up" : "stat-sub"}>
            {s.trend === "up" && "↑ "}
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

// Widget Alertes
function WidgetAlertes() {
  const [dismissed, setDismissed] = useState([]);
  return (
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
          Alertes
        </h3>
        {dismissed.length < ALERTS.length && (
          <span style={{ fontSize: "11px", color: "var(--gray)" }}>
            {ALERTS.length - dismissed.length} active
            {ALERTS.length - dismissed.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ALERTS.filter((_, i) => !dismissed.includes(i)).map((a, i) => (
          <Link
            key={i}
            to={a.link}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              padding: "13px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              borderLeft: `3px solid ${a.border}`,
              background: a.color,
              textDecoration: "none",
              color: "var(--noir)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: "16px" }}>{a.icon}</span>
            <span style={{ fontWeight: "500", flex: 1, fontSize: "14px" }}>
              {a.text}
            </span>
            <span
              style={{ fontSize: "11px", color: "var(--gray)", flexShrink: 0 }}
            >
              Voir →
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDismissed((d) => [...d, ALERTS.indexOf(a)]);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--gray)",
                fontSize: "14px",
                padding: "0 0 0 8px",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </Link>
        ))}
        {dismissed.length === ALERTS.length && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--gray)",
              fontSize: "13px",
            }}
          >
            ✓ Toutes les alertes ont été traitées
          </div>
        )}
      </div>
    </div>
  );
}

// Widget Commandes
function WidgetCommandes({ visible }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(135deg,rgba(201,169,110,0.04) 0%,transparent 100%)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: "400",
          }}
        >
          Commandes récentes
        </h3>
        <Link
          to="/commandes"
          style={{
            fontSize: "12px",
            color: "var(--gold)",
            fontWeight: "600",
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "gap 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "8px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "4px")}
        >
          Voir tout <span>→</span>
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Client</th>
            <th>Articles</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Heure</th>
          </tr>
        </thead>
        <tbody>
          {RECENT_ORDERS.map((o, i) => {
            const st = STATUS_MAP[o.status];
            return (
              <tr
                key={o.ref}
                style={{
                  animation: `fadeUp 0.4s ${0.4 + i * 0.06}s ease both`,
                  opacity: 0,
                }}
              >
                <td>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    {o.ref}
                  </span>
                </td>
                <td style={{ fontWeight: "500" }}>{o.client}</td>
                <td style={{ color: "var(--gray)", fontSize: "13px" }}>
                  {o.items}
                </td>
                <td style={{ fontWeight: "700" }}>{o.total} €</td>
                <td>
                  <span className={`badge ${st.cls}`}>{st.label}</span>
                </td>
                <td style={{ color: "var(--gray-light)", fontSize: "12px" }}>
                  Il y a {o.time}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Widget Stocks
function WidgetStocks() {
  return (
    <div className="card">
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          marginBottom: "18px",
          fontWeight: "400",
        }}
      >
        Stocks critiques
      </h4>
      {STOCKS_CRITIQUES.map((p, i) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background:
                p.stock <= 2 ? "var(--error-bg)" : "var(--warning-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            {p.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "2px",
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: p.stock <= 2 ? "var(--error)" : "var(--warning)",
                fontWeight: "600",
              }}
            >
              ⚠ {p.stock} restant{p.stock > 1 ? "s" : ""}
            </div>
          </div>
          <Link
            to="/produits"
            style={{
              fontSize: "11px",
              color: "var(--gold)",
              fontWeight: "700",
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid var(--gold-light)",
              transition: "all var(--transition)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--gold-lighter)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Gérer
          </Link>
        </div>
      ))}
    </div>
  );
}

// Widget Actions
function WidgetActions() {
  return (
    <div className="card">
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          marginBottom: "18px",
          fontWeight: "400",
        }}
      >
        Actions rapides
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {ACTIONS_RAPIDES.map((a, i) => (
          <Link
            key={a.label}
            to={a.path}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              padding: "11px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--white-2)",
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--noir)",
              transition: "all var(--transition)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--gold-lighter)";
              e.currentTarget.style.borderColor = "var(--gold-light)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--white-2)";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "16px" }}>{a.icon}</span>
            <span>{a.label}</span>
            <span
              style={{
                marginLeft: "auto",
                color: "var(--gray-light)",
                fontSize: "14px",
              }}
            >
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Widget Livraisons
function WidgetLivraisons() {
  const livraisons = [
    {
      ref: "#LV-00248",
      coursier: "Karim M.",
      eta: "8 min",
      client: "Sophie M.",
    },
    {
      ref: "#LV-00246",
      coursier: "Thomas R.",
      eta: "14 min",
      client: "Marie L.",
    },
  ];
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: "400",
          }}
        >
          Livraisons en cours
        </h4>
        <Link
          to="/livraisons"
          style={{ fontSize: "12px", color: "var(--gold)", fontWeight: "600" }}
        >
          Voir tout →
        </Link>
      </div>
      {livraisons.map((l) => (
        <div
          key={l.ref}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 0",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(59,130,246,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🛵
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>
              {l.ref} → {l.client}
            </div>
            <div style={{ fontSize: "11px", color: "var(--gray)" }}>
              Coursier : {l.coursier}
            </div>
          </div>
          <div
            style={{ fontSize: "13px", fontWeight: "700", color: "#3B82F6" }}
          >
            ETA {l.eta}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MODAL PERSONNALISATION ────────────────────────────────────────
function CustomizeModal({ activeWidgets, onSave, onClose }) {
  const [selection, setSelection] = useState([...activeWidgets]);

  const toggle = (id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  return (
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
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "32px",
          width: "100%",
          maxWidth: "520px",
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
            marginBottom: "6px",
          }}
        >
          Personnalisation
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: "400",
            marginBottom: "6px",
          }}
        >
          Votre dashboard
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "var(--gray)",
            marginBottom: "24px",
          }}
        >
          Choisissez les widgets à afficher sur votre tableau de bord.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          {ALL_WIDGETS.map((w) => {
            const active = selection.includes(w.id);
            return (
              <div
                key={w.id}
                onClick={() => toggle(w.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: `1.5px solid ${
                    active ? "var(--gold)" : "rgba(0,0,0,0.07)"
                  }`,
                  background: active ? "rgba(201,169,110,0.05)" : "#FAFAF8",
                }}
              >
                <span style={{ fontSize: "22px", flexShrink: 0 }}>
                  {w.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginBottom: "2px",
                    }}
                  >
                    {w.label}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {w.description}
                  </div>
                </div>
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    border: `2px solid ${
                      active ? "var(--gold)" : "rgba(0,0,0,0.15)"
                    }`,
                    background: active ? "var(--gold)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        color: "var(--noir)",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-gold"
            style={{ flex: 2 }}
            onClick={() => onSave(selection)}
          >
            Enregistrer ({selection.length} widget
            {selection.length > 1 ? "s" : ""})
          </button>
          <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD PRINCIPAL ───────────────────────────────────────────
export default function Dashboard() {
  const { boutique } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState(() => {
    const saved = localStorage.getItem("livrr_dashboard_widgets");
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const saveWidgets = (selection) => {
    setActiveWidgets(selection);
    localStorage.setItem("livrr_dashboard_widgets", JSON.stringify(selection));
    setShowCustomize(false);
  };

  const has = (id) => activeWidgets.includes(id);

  return (
    <div className="page">
      {/* ── HEADER ── */}
      <div
        style={{
          marginBottom: "32px",
          animation: "slideInLeft 0.5s ease forwards",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--gray)",
              marginBottom: "6px",
              letterSpacing: "0.03em",
            }}
          >
            {greeting} &nbsp;👋
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "400",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            {boutique?.name || "Sandro Paris"}
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div
            style={{
              marginTop: "16px",
              height: "1px",
              background:
                "linear-gradient(90deg, var(--gold-light), transparent)",
              width: "120px",
            }}
          />
        </div>

        {/* Bouton personnaliser */}
        <button
          onClick={() => setShowCustomize(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#fff",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--gray)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 0.2s",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.color = "var(--gold-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
            e.currentTarget.style.color = "var(--gray)";
          }}
        >
          <span style={{ fontSize: "14px" }}>⚙️</span>
          Personnaliser
        </button>
      </div>

      {/* ── WIDGETS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        {/* Stats — pleine largeur */}
        {has("stats") && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <WidgetStats visible={visible} />
          </div>
        )}

        {/* Alertes — pleine largeur */}
        {has("alertes") && (
          <div style={{ animation: "fadeUp 0.5s 0.1s ease both" }}>
            <WidgetAlertes />
          </div>
        )}

        {/* Commandes — pleine largeur */}
        {has("commandes") && (
          <div style={{ animation: "fadeUp 0.5s 0.15s ease both" }}>
            <WidgetCommandes visible={visible} />
          </div>
        )}

        {/* Grille 2 colonnes pour les petits widgets */}
        {(has("stocks") || has("actions") || has("livraisons")) && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "22px",
              animation: "fadeUp 0.5s 0.2s ease both",
            }}
          >
            {has("stocks") && <WidgetStocks />}
            {has("actions") && <WidgetActions />}
            {has("livraisons") && <WidgetLivraisons />}
          </div>
        )}

        {/* Empty state */}
        {activeWidgets.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              border: "2px dashed rgba(0,0,0,0.1)",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📊</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "8px",
              }}
            >
              Dashboard vide
            </h3>
            <p
              style={{
                color: "var(--gray)",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Ajoutez des widgets pour personnaliser votre tableau de bord.
            </p>
            <button className="btn-gold" onClick={() => setShowCustomize(true)}>
              Ajouter des widgets
            </button>
          </div>
        )}
      </div>

      {/* MODAL PERSONNALISATION */}
      {showCustomize && (
        <CustomizeModal
          activeWidgets={activeWidgets}
          onSave={saveWidgets}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </div>
  );
}
