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
  },
  {
    id: 2,
    name: "Youssef L.",
    role: "Vendeur Senior",
    sales: 32,
    commission: "420 €",
    status: "En poste",
  },
  {
    id: 3,
    name: "Amine R.",
    role: "Vendeur Junior",
    sales: 12,
    commission: "150 €",
    status: "Repos",
  },
];

export default function Vendors() {
  const [staff, setStaff] = useState(INITIAL_STAFF);

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
        <button
          className="btn-gold"
          onClick={() => toast.success("Ouverture du formulaire d'ajout...")}
        >
          + Ajouter un membre
        </button>
      </div>

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
            style={{ position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "var(--gold)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderTop: "1px solid #f5f5f5",
              }}
            >
              <div style={{ textAlign: "center", flex: 1 }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--gray)",
                    textTransform: "uppercase",
                  }}
                >
                  Ventes
                </div>
                <div style={{ fontWeight: "bold" }}>{member.sales}</div>
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
                  }}
                >
                  Prime calculée
                </div>
                <div style={{ fontWeight: "bold", color: "var(--success)" }}>
                  {member.commission}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color:
                    member.status === "En poste"
                      ? "var(--success)"
                      : "var(--gray)",
                }}
              >
                ● {member.status}
              </span>
              <button
                className="btn-outline"
                style={{ fontSize: "11px", padding: "4px 8px" }}
              >
                Gérer accès
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
