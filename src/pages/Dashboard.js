import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RECENT_ORDERS = [
  {
    ref: "#LV-00248",
    client: "Sophie M.",
    items: "Robe Midi × 1",
    total: 490,
    status: "transit",
    time: "Il y a 8 min",
  },
  {
    ref: "#LV-00247",
    client: "Camille D.",
    items: "Blazer × 1, Ceinture × 1",
    total: 345,
    status: "preparing",
    time: "Il y a 22 min",
  },
  {
    ref: "#LV-00246",
    client: "Marie L.",
    items: "Trench Camel × 1",
    total: 890,
    status: "delivered",
    time: "Il y a 1h",
  },
  {
    ref: "#LV-00245",
    client: "Julie P.",
    items: "Robe Fleurie × 2",
    total: 980,
    status: "delivered",
    time: "Il y a 2h",
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

function AnimatedNumber({ target, suffix, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const isFloat = !Number.isInteger(target);
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
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

export default function Dashboard() {
  const { boutique } = useAuth();
  const [visible, setVisible] = useState(false);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page">
      {/* ── HEADER ── */}
      <div
        style={{
          marginBottom: "36px",
          animation: "slideInLeft 0.5s ease forwards",
        }}
      >
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
            marginTop: "20px",
            height: "1px",
            background:
              "linear-gradient(90deg, var(--gold-light), transparent)",
            width: "120px",
          }}
        />
      </div>

      {/* ── ALERTES ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "32px",
        }}
      >
        {ALERTS.map((a, i) => (
          <Link
            key={i}
            to={a.link}
            style={{
              background: a.color,
              border: `1px solid ${a.border}22`,
              borderLeft: `3px solid ${a.border}`,
              borderRadius: "var(--radius-md)",
              padding: "13px 18px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              fontSize: "14px",
              animation: `slideInRight 0.4s ease ${i * 0.1}s both`,
              textDecoration: "none",
              color: "var(--noir)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: "16px" }}>{a.icon}</span>
            <span style={{ fontWeight: "500", flex: 1 }}>{a.text}</span>
            <span
              style={{ fontSize: "12px", color: "var(--gray)", flexShrink: 0 }}
            >
              Voir →
            </span>
          </Link>
        ))}
      </div>

      {/* ── STAT CARDS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "18px",
          marginBottom: "32px",
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

      {/* ── GRILLE PRINCIPALE ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "22px",
        }}
      >
        {/* Commandes récentes */}
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            animation: "fadeUp 0.6s 0.3s ease both",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background:
                "linear-gradient(135deg, rgba(201,169,110,0.04) 0%, transparent 100%)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
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
                transition: "var(--transition)",
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
                          letterSpacing: "0.5px",
                        }}
                      >
                        {o.ref}
                      </span>
                    </td>
                    <td style={{ fontWeight: "500" }}>{o.client}</td>
                    <td style={{ color: "var(--gray)", fontSize: "13px" }}>
                      {o.items}
                    </td>
                    <td style={{ fontWeight: "700", fontSize: "14px" }}>
                      {o.total} €
                    </td>
                    <td>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td
                      style={{ color: "var(--gray-light)", fontSize: "12px" }}
                    >
                      {o.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Colonne droite */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Actions rapides */}
          <div
            className="card"
            style={{ animation: "fadeUp 0.6s 0.4s ease both" }}
          >
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {[
                { icon: "➕", label: "Ajouter un produit", path: "/produits" },
                {
                  icon: "📋",
                  label: "Commandes en attente",
                  path: "/commandes",
                },
                { icon: "💬", label: "Messages clients", path: "/messages" },
                {
                  icon: "🎁",
                  label: "Créer une promotion",
                  path: "/marketing",
                },
              ].map((a, i) => (
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
                    animation: `fadeUp 0.4s ${0.5 + i * 0.07}s ease both`,
                    opacity: 0,
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

          {/* Stocks critiques */}
          <div
            className="card"
            style={{ animation: "fadeUp 0.6s 0.5s ease both" }}
          >
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
            {[
              { name: "Robe Midi Fleurie", stock: 2, emoji: "👗" },
              { name: "Mules Beige T38", stock: 1, emoji: "👠" },
              { name: "Trench Camel S", stock: 3, emoji: "🧥" },
            ].map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  animation: `fadeUp 0.4s ${0.6 + i * 0.07}s ease both`,
                  opacity: 0,
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
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
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
        </div>
      </div>
    </div>
  );
}
