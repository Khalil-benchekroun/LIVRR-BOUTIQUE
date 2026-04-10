import React, { useState } from "react";
import toast from "react-hot-toast";

const PERMISSIONS = [
  {
    key: "commandes",
    label: "Commandes",
    icon: "📦",
    desc: "Voir et gérer les commandes",
  },
  {
    key: "pos",
    label: "Commande manuelle",
    icon: "🖊️",
    desc: "Enregistrer des ventes manuelles",
  },
  {
    key: "produits",
    label: "Produits",
    icon: "🛍️",
    desc: "Gérer le catalogue produits",
  },
  {
    key: "clients",
    label: "Clients",
    icon: "👤",
    desc: "Accéder à la liste clients",
  },
  {
    key: "stats",
    label: "Statistiques",
    icon: "📊",
    desc: "Voir les rapports et performances",
  },
  {
    key: "retours",
    label: "Retours",
    icon: "↩️",
    desc: "Gérer les retours commandes",
  },
];

const DEFAULT_PERMS = {
  commandes: true,
  pos: true,
  produits: false,
  clients: false,
  stats: false,
  retours: false,
};

const INITIAL_STAFF = [
  {
    id: 1,
    name: "Siham B.",
    email: "siham@sandro.fr",
    role: "Manager",
    sales: 45,
    commission: "850 €",
    totalRevenue: 12400,
    orders: ["ORD-8750", "ORD-8762", "ORD-8771"],
    permissions: {
      commandes: true,
      pos: true,
      produits: true,
      clients: true,
      stats: true,
      retours: true,
    },
    active: true,
  },
  {
    id: 2,
    name: "Youssef L.",
    email: "youssef@sandro.fr",
    role: "Vendeur Senior",
    sales: 32,
    commission: "420 €",
    totalRevenue: 8900,
    orders: ["ORD-8780", "ORD-8795"],
    permissions: {
      commandes: true,
      pos: true,
      produits: false,
      clients: false,
      stats: false,
      retours: true,
    },
    active: true,
  },
  {
    id: 3,
    name: "Amine R.",
    email: "amine@sandro.fr",
    role: "Vendeur Junior",
    sales: 12,
    commission: "150 €",
    totalRevenue: 2800,
    orders: ["ORD-8801"],
    permissions: { ...DEFAULT_PERMS },
    active: false,
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "Vendeur Junior",
  password: "",
  permissions: { ...DEFAULT_PERMS },
};

export default function Vendors() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showPerms, setShowPerms] = useState(null); // vendeur dont on édite les perms
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);

  const totalSales = staff.reduce((a, s) => a + s.sales, 0);
  const totalRevenue = staff.reduce((a, s) => a + s.totalRevenue, 0);
  const activeCount = staff.filter((s) => s.active).length;

  const handleAdd = () => {
    if (!form.name) return toast.error("Le nom est obligatoire");
    if (!form.email) return toast.error("L'email est obligatoire");
    if (!form.password || form.password.length < 6)
      return toast.error("Mot de passe minimum 6 caractères");
    setStaff((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now(),
        sales: 0,
        commission: "0 €",
        totalRevenue: 0,
        orders: [],
        active: true,
      },
    ]);
    toast.success(`Sous-compte créé pour ${form.name}`);
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  const toggleActive = (id) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    const member = staff.find((s) => s.id === id);
    toast.success(
      `Accès ${member.active ? "désactivé" : "activé"} pour ${member.name}`
    );
  };

  const savePerms = (id, newPerms) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, permissions: newPerms } : s))
    );
    setShowPerms(null);
    toast.success("Permissions mises à jour");
  };

  return (
    <div className="page">
      {/* HEADER */}
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
            Gestion de l'équipe
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            Sous-comptes vendeurs avec accès personnalisés
          </p>
        </div>
        <button
          className="btn-gold"
          onClick={() => {
            setShowModal(true);
            setForm(EMPTY_FORM);
          }}
        >
          + Créer un sous-compte
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Vendeurs actifs",
            value: activeCount,
            icon: "👥",
            bg: "var(--success-bg)",
            color: "var(--success)",
          },
          {
            label: "Ventes totales (mois)",
            value: totalSales,
            icon: "📦",
            bg: "var(--info-bg)",
            color: "var(--info)",
          },
          {
            label: "CA traité",
            value: `${totalRevenue.toLocaleString("fr-FR")} €`,
            icon: "💰",
            bg: "var(--gold-light)",
            color: "var(--gold-dark)",
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

      {/* CARTES VENDEURS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {staff.map((member) => (
          <div
            key={member.id}
            className="card"
            style={{
              position: "relative",
              opacity: member.active ? 1 : 0.6,
              transition: "var(--transition)",
            }}
          >
            {/* Barre top */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: member.active
                  ? "linear-gradient(90deg, var(--gold), var(--gold-light))"
                  : "#ddd",
                borderRadius: "18px 18px 0 0",
              }}
            />

            {/* Header carte */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "16px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: member.active
                    ? "var(--gold)"
                    : "var(--gray-light)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {member.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: "700", fontSize: "16px" }}>
                  {member.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                  {member.role}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray-light)",
                    marginTop: "1px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {member.email}
                </div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: member.active
                    ? "var(--success-bg)"
                    : "rgba(0,0,0,0.06)",
                  color: member.active ? "var(--success)" : "var(--gray)",
                  flexShrink: 0,
                }}
              >
                {member.active ? "Actif" : "Inactif"}
              </span>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderTop: "1px solid #f5f5f5",
                borderBottom: "1px solid #f5f5f5",
                marginBottom: "14px",
              }}
            >
              {[
                { label: "Ventes", value: member.sales },
                { label: "Prime", value: member.commission },
                {
                  label: "CA traité",
                  value: `${member.totalRevenue.toLocaleString("fr-FR")} €`,
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    textAlign: "center",
                    flex: 1,
                    borderLeft: i > 0 ? "1px solid #f5f5f5" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray)",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: i === 0 ? "20px" : "14px",
                      fontFamily: i === 0 ? "var(--font-display)" : "inherit",
                      color: i === 1 ? "var(--success)" : "inherit",
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions preview */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--gray)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Accès activés
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {PERMISSIONS.map(
                  (p) =>
                    member.permissions[p.key] && (
                      <span
                        key={p.key}
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          background: "rgba(201,169,110,0.1)",
                          color: "var(--gold-dark)",
                          fontWeight: "600",
                        }}
                      >
                        {p.icon} {p.label}
                      </span>
                    )
                )}
                {!Object.values(member.permissions).some(Boolean) && (
                  <span style={{ fontSize: "11px", color: "var(--gray)" }}>
                    Aucun accès activé
                  </span>
                )}
              </div>
            </div>

            {/* Barre progression */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "var(--gray)",
                  marginBottom: "4px",
                }}
              >
                <span>Objectif mensuel</span>
                <span>{member.sales}/50</span>
              </div>
              <div
                style={{
                  height: "5px",
                  background: "#F0EDE6",
                  borderRadius: "3px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (member.sales / 50) * 100)}%`,
                    background:
                      member.sales >= 40
                        ? "var(--success)"
                        : member.sales >= 20
                        ? "var(--gold)"
                        : "var(--gray-light)",
                    borderRadius: "3px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                className="btn-outline"
                style={{ flex: 1, fontSize: "11px", padding: "7px 10px" }}
                onClick={() => setShowDetail(member)}
              >
                Historique
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1, fontSize: "11px", padding: "7px 10px" }}
                onClick={() => setShowPerms({ ...member })}
              >
                ⚙️ Permissions
              </button>
              <button
                style={{
                  flex: 1,
                  fontSize: "11px",
                  padding: "7px 10px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: "500",
                  background: member.active
                    ? "var(--error-bg)"
                    : "var(--success-bg)",
                  color: member.active ? "var(--error)" : "var(--success)",
                  transition: "var(--transition)",
                }}
                onClick={() => toggleActive(member.id)}
              >
                {member.active ? "Désactiver" : "Activer"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL CRÉER SOUS-COMPTE ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
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
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
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
              Nouveau sous-compte
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                fontWeight: "400",
                marginBottom: "24px",
              }}
            >
              Créer un accès vendeur
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Nom complet *</label>
                  <input
                    className="input-field"
                    placeholder="Ex: Fatima Z."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <div>
                  <label className="label">Rôle</label>
                  <select
                    className="input-field"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{ marginBottom: 0 }}
                  >
                    <option>Manager</option>
                    <option>Vendeur Senior</option>
                    <option>Vendeur Junior</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Email de connexion *</label>
                <input
                  className="input-field"
                  placeholder="vendeur@boutique.fr"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div>
                <label className="label">Mot de passe *</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input-field"
                    placeholder="Minimum 6 caractères"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    style={{ marginBottom: 0, paddingRight: "40px" }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--gray)",
                      fontSize: "13px",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div
              style={{
                fontSize: "12px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--gray)",
                marginBottom: "14px",
              }}
            >
              Accès au dashboard
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {PERMISSIONS.map((p) => (
                <div
                  key={p.key}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      permissions: {
                        ...f.permissions,
                        [p.key]: !f.permissions[p.key],
                      },
                    }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${
                      form.permissions[p.key]
                        ? "var(--gold)"
                        : "rgba(0,0,0,0.07)"
                    }`,
                    background: form.permissions[p.key]
                      ? "rgba(201,169,110,0.05)"
                      : "#FAFAF8",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "13px" }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                      {p.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: `2px solid ${
                        form.permissions[p.key]
                          ? "var(--gold)"
                          : "rgba(0,0,0,0.15)"
                      }`,
                      background: form.permissions[p.key]
                        ? "var(--gold)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "var(--transition)",
                      flexShrink: 0,
                    }}
                  >
                    {form.permissions[p.key] && (
                      <span
                        style={{
                          color: "var(--noir)",
                          fontSize: "11px",
                          fontWeight: "800",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-gold"
                style={{ flex: 2 }}
                onClick={handleAdd}
              >
                Créer le sous-compte
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PERMISSIONS ── */}
      {showPerms && (
        <PermissionsModal
          member={showPerms}
          onSave={(perms) => savePerms(showPerms.id, perms)}
          onClose={() => setShowPerms(null)}
        />
      )}

      {/* ── MODAL HISTORIQUE ── */}
      {showDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowDetail(null)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              width: "100%",
              maxWidth: "460px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                {showDetail.name.charAt(0)}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                  }}
                >
                  {showDetail.name}
                </h3>
                <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                  {showDetail.role} · {showDetail.email}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {[
                { label: "Ventes", value: showDetail.sales },
                { label: "Prime", value: showDetail.commission },
                {
                  label: "CA traité",
                  value: `${showDetail.totalRevenue.toLocaleString("fr-FR")} €`,
                },
                {
                  label: "Accès",
                  value: `${
                    Object.values(showDetail.permissions).filter(Boolean).length
                  }/${PERMISSIONS.length}`,
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
                  <div style={{ fontWeight: "700", fontSize: "16px" }}>
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "var(--gray)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
              }}
            >
              Commandes traitées
            </div>
            {showDetail.orders.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {showDetail.orders.map((ordId) => (
                  <div
                    key={ordId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "#F8F7F4",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "700",
                        fontSize: "13px",
                      }}
                    >
                      #{ordId}
                    </span>
                    <span className="badge badge-success">Traitée</span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--gray)",
                  fontSize: "13px",
                }}
              >
                Aucune commande assignée
              </div>
            )}
            <button
              className="btn-outline"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={() => setShowDetail(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionsModal({ member, onSave, onClose }) {
  const [perms, setPerms] = useState({ ...member.permissions });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
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
          maxWidth: "480px",
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
          Gestion des accès
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: "400",
            marginBottom: "4px",
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "var(--gray)",
            marginBottom: "24px",
          }}
        >
          {member.role} · {member.email}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          {PERMISSIONS.map((p) => (
            <div
              key={p.key}
              onClick={() =>
                setPerms((prev) => ({ ...prev, [p.key]: !prev[p.key] }))
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "10px",
                border: `1.5px solid ${
                  perms[p.key] ? "var(--gold)" : "rgba(0,0,0,0.07)"
                }`,
                background: perms[p.key] ? "rgba(201,169,110,0.05)" : "#FAFAF8",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            >
              <span style={{ fontSize: "18px" }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", fontSize: "13px" }}>
                  {p.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                  {p.desc}
                </div>
              </div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${
                    perms[p.key] ? "var(--gold)" : "rgba(0,0,0,0.15)"
                  }`,
                  background: perms[p.key] ? "var(--gold)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "var(--transition)",
                  flexShrink: 0,
                }}
              >
                {perms[p.key] && (
                  <span
                    style={{
                      color: "var(--noir)",
                      fontSize: "11px",
                      fontWeight: "800",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-gold"
            style={{ flex: 2 }}
            onClick={() => onSave(perms)}
          >
            Enregistrer les accès
          </button>
          <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
