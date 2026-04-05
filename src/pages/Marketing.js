import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

// --- DONNÉES MOCK ---
const INITIAL_COUPONS = [
  {
    id: 1,
    code: "BIENVENUE10",
    type: "percentage",
    value: 10,
    minOrder: 50,
    usage: 145,
    maxUsage: 500,
    expiry: "2026-12-31",
    active: true,
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    code: "LIVRR2026",
    type: "fixed",
    value: 5,
    minOrder: 30,
    usage: 89,
    maxUsage: 200,
    expiry: "2026-06-30",
    active: false,
    createdAt: "2026-01-20",
  },
  {
    id: 3,
    code: "SANDRO20",
    type: "percentage",
    value: 20,
    minOrder: 150,
    usage: 34,
    maxUsage: 100,
    expiry: "2026-04-30",
    active: true,
    createdAt: "2026-03-01",
  },
  {
    id: 4,
    code: "RUSH15",
    type: "fixed",
    value: 15,
    minOrder: 80,
    usage: 12,
    maxUsage: 50,
    expiry: "2026-04-10",
    active: true,
    createdAt: "2026-03-15",
  },
];

const INITIAL_HISTORY = [
  {
    id: "h1",
    name: "Soldes Hiver 2026",
    type: "percentage",
    value: 30,
    startDate: "2026-01-08",
    endDate: "2026-02-05",
    orders: 312,
    revenue: 47800,
    status: "terminée",
  },
  {
    id: "h2",
    name: "Saint-Valentin",
    type: "fixed",
    value: 20,
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    orders: 87,
    revenue: 12400,
    status: "terminée",
  },
  {
    id: "h3",
    name: "Printemps Luxe",
    type: "percentage",
    value: 15,
    startDate: "2026-03-20",
    endDate: "2026-04-20",
    orders: 145,
    revenue: 28600,
    status: "en cours",
  },
  {
    id: "h4",
    name: "Flash Weekend",
    type: "fixed",
    value: 10,
    startDate: "2026-04-05",
    endDate: "2026-04-06",
    orders: 0,
    revenue: 0,
    status: "planifiée",
  },
  {
    id: "h5",
    name: "Black Friday 2025",
    type: "percentage",
    value: 40,
    startDate: "2025-11-28",
    endDate: "2025-12-01",
    orders: 628,
    revenue: 89400,
    status: "terminée",
  },
];

const EMPTY_COUPON = {
  code: "",
  type: "percentage",
  value: "",
  minOrder: "",
  maxUsage: "",
  expiry: "",
};
const EMPTY_PROMO = {
  name: "",
  type: "percentage",
  value: "",
  startDate: "",
  endDate: "",
};

const STATUS_STYLES = {
  "en cours": {
    bg: "var(--success-bg)",
    color: "var(--success)",
    dot: "#2E8B57",
  },
  planifiée: { bg: "var(--info-bg)", color: "var(--info)", dot: "#185FA5" },
  terminée: { bg: "#F0EDE6", color: "var(--gray)", dot: "#9CA3AF" },
};

export default function Marketing() {
  const [tab, setTab] = useState("coupons");
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  // Modals
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON);
  const [promoForm, setPromoForm] = useState(EMPTY_PROMO);

  // Recherche globale
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // --- STATS ---
  const totalUsage = coupons.reduce((a, c) => a + c.usage, 0);
  const activeCoupons = coupons.filter((c) => c.active).length;
  const ongoingPromos = history.filter((h) => h.status === "en cours").length;
  const totalRevenue = history.reduce((a, h) => a + h.revenue, 0);

  // --- COUPONS ---
  const toggleCoupon = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast.success("Statut du coupon mis à jour");
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon supprimé");
  };

  const handleCouponCreate = () => {
    if (!couponForm.code || !couponForm.value)
      return toast.error("Code et valeur obligatoires");
    const coupon = {
      ...couponForm,
      id: Date.now(),
      usage: 0,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
      value: parseFloat(couponForm.value),
      minOrder: parseFloat(couponForm.minOrder) || 0,
      maxUsage: parseInt(couponForm.maxUsage) || 999,
    };
    setCoupons([coupon, ...coupons]);
    setShowCouponModal(false);
    setCouponForm(EMPTY_COUPON);
    toast.success(`Coupon ${coupon.code} créé !`);
  };

  // --- PROMOTIONS ---
  const handlePromoCreate = () => {
    if (
      !promoForm.name ||
      !promoForm.value ||
      !promoForm.startDate ||
      !promoForm.endDate
    )
      return toast.error("Tous les champs sont obligatoires");

    const today = new Date().toISOString().split("T")[0];
    const status =
      promoForm.startDate > today
        ? "planifiée"
        : promoForm.endDate >= today
        ? "en cours"
        : "terminée";

    const promo = {
      ...promoForm,
      id: "h" + Date.now(),
      value: parseFloat(promoForm.value),
      orders: 0,
      revenue: 0,
      status,
    };
    setHistory([promo, ...history]);
    setShowPromoModal(false);
    setPromoForm(EMPTY_PROMO);
    toast.success(`Promotion "${promo.name}" créée !`);
  };

  // --- FILTRES ---
  const filteredCoupons = useMemo(
    () =>
      coupons
        .filter(
          (c) =>
            filterStatus === "all" ||
            (filterStatus === "actif" ? c.active : !c.active)
        )
        .filter((c) => filterType === "all" || c.type === filterType)
        .filter(
          (c) => !search || c.code.toLowerCase().includes(search.toLowerCase())
        ),
    [coupons, filterStatus, filterType, search]
  );

  const filteredHistory = useMemo(
    () =>
      history
        .filter((h) => filterStatus === "all" || h.status === filterStatus)
        .filter((h) => filterType === "all" || h.type === filterType)
        .filter(
          (h) => !search || h.name.toLowerCase().includes(search.toLowerCase())
        ),
    [history, filterStatus, filterType, search]
  );

  const isExpiringSoon = (expiry) => {
    if (!expiry) return false;
    const diff = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
            Promotion Commerciale
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Coupons, campagnes et historique des promotions
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {tab === "coupons" && (
            <button
              className="btn-gold"
              onClick={() => setShowCouponModal(true)}
            >
              + Créer un coupon
            </button>
          )}
          {tab === "historique" && (
            <button
              className="btn-gold"
              onClick={() => setShowPromoModal(true)}
            >
              + Nouvelle promotion
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Coupons actifs",
            value: activeCoupons,
            icon: "🎟️",
            color: "var(--gold-dark)",
            bg: "var(--gold-light)",
          },
          {
            label: "Utilisations totales",
            value: totalUsage,
            icon: "📊",
            color: "var(--info)",
            bg: "var(--info-bg)",
          },
          {
            label: "Promos en cours",
            value: ongoingPromos,
            icon: "🔥",
            color: "var(--success)",
            bg: "var(--success-bg)",
          },
          {
            label: "CA généré (promos)",
            value: `${(totalRevenue / 1000).toFixed(0)}k €`,
            icon: "💰",
            color: "var(--success)",
            bg: "var(--success-bg)",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--gray)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                }}
              >
                {s.icon}
              </span>
            </div>
            <div
              style={{
                fontSize: "32px",
                fontFamily: "var(--font-display)",
                color: "var(--noir)",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "var(--white)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          width: "fit-content",
        }}
      >
        {[
          { key: "coupons", label: "🎟️ Coupons de réduction" },
          { key: "historique", label: "📋 Historique des promotions" },
          { key: "recherche", label: "🔍 Recherche" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setSearch("");
              setFilterType("all");
              setFilterStatus("all");
            }}
            style={{
              padding: "9px 18px",
              borderRadius: "9px",
              border: "none",
              background: tab === t.key ? "var(--noir)" : "transparent",
              color: tab === t.key ? "#fff" : "var(--gray)",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== COUPONS ===== */}
      {tab === "coupons" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="table">
            <thead>
              <tr>
                <th>CODE COUPON</th>
                <th>RÉDUCTION</th>
                <th>CONDITION</th>
                <th>UTILISATIONS</th>
                <th>EXPIRATION</th>
                <th>STATUT</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          background: c.active ? "var(--noir)" : "#F0EDE6",
                          color: c.active ? "var(--gold)" : "var(--gray)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "800",
                          letterSpacing: "1.5px",
                          fontFamily: "monospace",
                        }}
                      >
                        {c.code}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "var(--noir)",
                      }}
                    >
                      {c.type === "percentage"
                        ? `−${c.value}%`
                        : `−${c.value} €`}
                    </span>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--gray)" }}>
                    {c.minOrder > 0 ? `Dès ${c.minOrder} €` : "Sans minimum"}
                  </td>
                  <td>
                    <div style={{ fontWeight: "700" }}>{c.usage}</div>
                    <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                      / {c.maxUsage} max
                    </div>
                    {/* Barre de progression */}
                    <div
                      style={{
                        width: "60px",
                        height: "4px",
                        background: "#F0EDE6",
                        borderRadius: "2px",
                        marginTop: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (c.usage / c.maxUsage) * 100
                          )}%`,
                          height: "100%",
                          borderRadius: "2px",
                          background:
                            c.usage / c.maxUsage > 0.8
                              ? "var(--error)"
                              : "var(--gold)",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    {c.expiry ? (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: isExpiringSoon(c.expiry)
                            ? "var(--warning)"
                            : "var(--gray)",
                        }}
                      >
                        {isExpiringSoon(c.expiry) && "⚠️ "}
                        {new Date(c.expiry).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span
                        style={{ fontSize: "12px", color: "var(--gray-light)" }}
                      >
                        Sans limite
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        c.active ? "badge-success" : "badge-gray"
                      }`}
                    >
                      {c.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn-outline"
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                        onClick={() => toggleCoupon(c.id)}
                      >
                        {c.active ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        className="btn-danger"
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                        onClick={() => deleteCoupon(c.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== HISTORIQUE ===== */}
      {tab === "historique" && (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ maxWidth: "180px", marginBottom: 0 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="en cours">En cours</option>
              <option value="planifiée">Planifiée</option>
              <option value="terminée">Terminée</option>
            </select>
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ maxWidth: "180px", marginBottom: 0 }}
            >
              <option value="all">Tous les types</option>
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
            </select>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {filteredHistory.map((h) => {
              const st = STATUS_STYLES[h.status] || STATUS_STYLES["terminée"];
              return (
                <div
                  key={h.id}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "20px 24px",
                  }}
                >
                  {/* Pastille statut */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: st.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: st.dot,
                      }}
                    />
                  </div>

                  {/* Infos promo */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontWeight: "700", fontSize: "15px" }}>
                        {h.name}
                      </span>
                      <span
                        className="badge"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {h.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                      {new Date(h.startDate).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })}
                      {" → "}
                      {new Date(h.endDate).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Réduction */}
                  <div style={{ textAlign: "center", minWidth: "80px" }}>
                    <div
                      style={{
                        fontSize: "22px",
                        fontFamily: "var(--font-display)",
                        fontWeight: "400",
                        color: "var(--gold-dark)",
                      }}
                    >
                      {h.type === "percentage"
                        ? `−${h.value}%`
                        : `−${h.value} €`}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--gray)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h.type === "percentage" ? "Remise" : "Fixe"}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: "24px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: "700", fontSize: "18px" }}>
                        {h.orders}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--gray)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Commandes
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "18px",
                          color:
                            h.revenue > 0
                              ? "var(--success)"
                              : "var(--gray-light)",
                        }}
                      >
                        {h.revenue > 0
                          ? `${h.revenue.toLocaleString("fr-FR")} €`
                          : "—"}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--gray)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Chiffre d'affaires
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredHistory.length === 0 && (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--gray)",
                }}
              >
                Aucune promotion trouvée
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== RECHERCHE GLOBALE ===== */}
      {tab === "recherche" && (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <input
              className="input-field"
              placeholder="Rechercher un coupon ou une promotion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
              autoFocus
            />
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ maxWidth: "180px", marginBottom: 0 }}
            >
              <option value="all">Tous les types</option>
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
            </select>
          </div>

          {/* Résultats coupons */}
          {filteredCoupons.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "var(--gray)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "10px",
                }}
              >
                🎟️ Coupons ({filteredCoupons.length})
              </div>
              <div
                className="card"
                style={{ padding: 0, overflow: "hidden", marginBottom: "20px" }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>RÉDUCTION</th>
                      <th>UTILISATIONS</th>
                      <th>EXPIRATION</th>
                      <th>STATUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoupons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "800",
                              fontSize: "13px",
                              letterSpacing: "1px",
                              color: c.active ? "var(--noir)" : "var(--gray)",
                            }}
                          >
                            {c.code}
                          </span>
                        </td>
                        <td style={{ fontWeight: "700" }}>
                          {c.type === "percentage"
                            ? `−${c.value}%`
                            : `−${c.value} €`}
                        </td>
                        <td>
                          {c.usage} / {c.maxUsage}
                        </td>
                        <td
                          style={{
                            fontSize: "12px",
                            color: isExpiringSoon(c.expiry)
                              ? "var(--warning)"
                              : "var(--gray)",
                          }}
                        >
                          {c.expiry
                            ? new Date(c.expiry).toLocaleDateString("fr-FR")
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              c.active ? "badge-success" : "badge-gray"
                            }`}
                          >
                            {c.active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Résultats historique */}
          {filteredHistory.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "var(--gray)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "10px",
                }}
              >
                📋 Promotions ({filteredHistory.length})
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {filteredHistory.map((h) => {
                  const st =
                    STATUS_STYLES[h.status] || STATUS_STYLES["terminée"];
                  return (
                    <div
                      key={h.id}
                      className="card"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: st.dot,
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: "700" }}>{h.name}</div>
                          <div
                            style={{ fontSize: "11px", color: "var(--gray)" }}
                          >
                            {new Date(h.startDate).toLocaleDateString("fr-FR")}{" "}
                            → {new Date(h.endDate).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "700",
                            color: "var(--gold-dark)",
                          }}
                        >
                          {h.type === "percentage"
                            ? `−${h.value}%`
                            : `−${h.value} €`}
                        </span>
                        <span
                          className="badge"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {h.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {filteredCoupons.length === 0 &&
            filteredHistory.length === 0 &&
            search && (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "60px",
                  color: "var(--gray)",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
                <div style={{ fontWeight: "700", marginBottom: "6px" }}>
                  Aucun résultat pour « {search} »
                </div>
                <div style={{ fontSize: "13px" }}>
                  Essayez un code coupon ou un nom de promotion
                </div>
              </div>
            )}

          {!search && (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "60px",
                color: "var(--gray)",
                background: "#FAFAF8",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
              <div style={{ fontSize: "14px" }}>
                Tapez un mot-clé pour rechercher parmi vos coupons et promotions
              </div>
            </div>
          )}
        </>
      )}

      {/* ====== MODAL COUPON ====== */}
      {showCouponModal && (
        <div style={overlayStyle} onClick={() => setShowCouponModal(false)}>
          <div
            className="card"
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              Nouveau coupon
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label className="label">Code coupon</label>
                <input
                  className="input-field"
                  placeholder="Ex: RUSH26"
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Type</label>
                  <select
                    className="input-field"
                    value={couponForm.type}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, type: e.target.value })
                    }
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Valeur</label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    placeholder={couponForm.type === "percentage" ? "10" : "15"}
                    value={couponForm.value}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Minimum de commande (€)</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="0"
                    value={couponForm.minOrder}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, minOrder: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Nb. utilisations max</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="100"
                    value={couponForm.maxUsage}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, maxUsage: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label">Date d'expiration</label>
                <input
                  className="input-field"
                  type="date"
                  value={couponForm.expiry}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, expiry: e.target.value })
                  }
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  className="btn-gold"
                  style={{ flex: 2 }}
                  onClick={handleCouponCreate}
                >
                  Créer le coupon
                </button>
                <button
                  className="btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowCouponModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL PROMOTION ====== */}
      {showPromoModal && (
        <div style={overlayStyle} onClick={() => setShowPromoModal(false)}>
          <div
            className="card"
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              Nouvelle promotion
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label className="label">Nom de la promotion</label>
                <input
                  className="input-field"
                  placeholder="Ex: Soldes Été 2026"
                  value={promoForm.name}
                  onChange={(e) =>
                    setPromoForm({ ...promoForm, name: e.target.value })
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Type</label>
                  <select
                    className="input-field"
                    value={promoForm.type}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, type: e.target.value })
                    }
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Valeur</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="20"
                    value={promoForm.value}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Date de début</label>
                  <input
                    className="input-field"
                    type="date"
                    value={promoForm.startDate}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Date de fin</label>
                  <input
                    className="input-field"
                    type="date"
                    value={promoForm.endDate}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  className="btn-gold"
                  style={{ flex: 2 }}
                  onClick={handlePromoCreate}
                >
                  Créer la promotion
                </button>
                <button
                  className="btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowPromoModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const modalStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "30px",
  width: "100%",
  maxWidth: "480px",
  maxHeight: "90vh",
  overflowY: "auto",
};
