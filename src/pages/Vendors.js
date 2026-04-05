import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_STAFF = [
  {
    id: 1,
    name: "Siham B.",
    role: "Manager",
    sales: 45,
    commission: "850 €",
    status: "En poste",
    orders: ["ORD-8750", "ORD-8762", "ORD-8771"],
    totalRevenue: 12400,
  },
  {
    id: 2,
    name: "Youssef L.",
    role: "Vendeur Senior",
    sales: 32,
    commission: "420 €",
    status: "En poste",
    orders: ["ORD-8780", "ORD-8795"],
    totalRevenue: 8900,
  },
  {
    id: 3,
    name: "Amine R.",
    role: "Vendeur Junior",
    sales: 12,
    commission: "150 €",
    status: "Repos",
    orders: ["ORD-8801"],
    totalRevenue: 2800,
  },
];

const EMPTY_MEMBER = { name: "", role: "Vendeur Junior", status: "En poste" };

export default function Vendors() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);

  const handleAddMember = () => {
    if (!memberForm.name) return toast.error("Le nom est obligatoire");
    setStaff((prev) => [
      ...prev,
      {
        ...memberForm,
        id: Date.now(),
        sales: 0,
        commission: "0 €",
        orders: [],
        totalRevenue: 0,
      },
    ]);
    toast.success(`${memberForm.name} ajouté(e) à l'équipe`);
    setShowModal(false);
    setMemberForm(EMPTY_MEMBER);
  };

  const toggleStatus = (id) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "En poste" ? "Repos" : "En poste" }
          : s
      )
    );
    toast.success("Statut mis à jour");
  };

  const totalSales = staff.reduce((a, s) => a + s.sales, 0);
  const totalRevenue = staff.reduce((a, s) => a + s.totalRevenue, 0);
  const activeCount = staff.filter((s) => s.status === "En poste").length;

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
            Gestion de l'équipe
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Gérez les accès et suivez les performances des vendeurs
          </p>
        </div>
        <button className="btn-gold" onClick={() => setShowModal(true)}>
          + Ajouter un membre
        </button>
      </div>

      {/* STATS ÉQUIPE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
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
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {staff.map((member) => (
          <div
            key={member.id}
            className="card"
            style={{
              position: "relative",
              opacity: member.status === "Repos" ? 0.75 : 1,
              transition: "var(--transition)",
            }}
          >
            {/* Barre top colorée selon performance */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background:
                  member.sales > 30
                    ? "linear-gradient(90deg, var(--gold), var(--gold-light))"
                    : "linear-gradient(90deg, #ddd, #eee)",
                borderRadius: "18px 18px 0 0",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background:
                    member.status === "En poste"
                      ? "var(--gold)"
                      : "var(--gray-light)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {member.name}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                  {member.role}
                </span>
              </div>
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
              <div style={{ textAlign: "center", flex: 1 }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--gray)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Ventes
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {member.sales}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  flex: 1,
                  borderLeft: "1px solid #f5f5f5",
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
                  Prime calculée
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    color: "var(--success)",
                    fontSize: "16px",
                  }}
                >
                  {member.commission}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  flex: 1,
                  borderLeft: "1px solid #f5f5f5",
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
                  CA traité
                </div>
                <div style={{ fontWeight: "700", fontSize: "14px" }}>
                  {member.totalRevenue.toLocaleString("fr-FR")} €
                </div>
              </div>
            </div>

            {/* Barre de progression ventes */}
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color:
                    member.status === "En poste"
                      ? "var(--success)"
                      : "var(--gray)",
                  fontWeight: "600",
                }}
              >
                ● {member.status}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  className="btn-outline"
                  style={{ fontSize: "11px", padding: "5px 10px" }}
                  onClick={() => setShowDetail(member)}
                >
                  Historique
                </button>
                <button
                  className="btn-outline"
                  style={{ fontSize: "11px", padding: "5px 10px" }}
                  onClick={() => toggleStatus(member.id)}
                >
                  {member.status === "En poste"
                    ? "Mettre en repos"
                    : "Remettre en poste"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL HISTORIQUE VENDEUR */}
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
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
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
                  {showDetail.role}
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
                { label: "Statut", value: showDetail.status },
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

      {/* MODAL AJOUT MEMBRE */}
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
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              width: "100%",
              maxWidth: "420px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              Nouveau membre
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label className="label">Nom complet</label>
                <input
                  className="input-field"
                  placeholder="Ex: Fatima Z."
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Rôle</label>
                <select
                  className="input-field"
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, role: e.target.value })
                  }
                >
                  <option>Manager</option>
                  <option>Vendeur Senior</option>
                  <option>Vendeur Junior</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  className="btn-gold"
                  style={{ flex: 2 }}
                  onClick={handleAddMember}
                >
                  Ajouter
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
        </div>
      )}
    </div>
  );
}
