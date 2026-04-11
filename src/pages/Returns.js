import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_RETURNS = [
  {
    id: "RET-8821",
    customer: "Yasmine A.",
    product: "Robe Midi Fleurie",
    date: "02/04/2026",
    status: "En attente",
    reason: "Taille trop petite",
  },
  {
    id: "RET-8790",
    customer: "Omar K.",
    product: "Trench Camel",
    date: "01/04/2026",
    status: "Complété",
    reason: "Changement d'avis",
  },
];

export default function Returns() {
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [showModal, setShowModal] = useState(false);

  const handleAction = (id, newStatus) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    toast.success(`Retour ${id} mis à jour : ${newStatus}`);
  };

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
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
            Gestion des Retours
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Traitez les demandes de retour et d'échange
          </p>
        </div>
        <button
          className="btn-gold"
          onClick={() => toast.error("Fonction de scan non configurée")}
        >
          📷 Scanner un Bon de Retour
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID RETOUR</th>
              <th>CLIENT</th>
              <th>PRODUIT</th>
              <th>MOTIF</th>
              <th>STATUT</th>
              <th style={{ textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ fontSize: "13px" }}>{r.id}</strong>
                </td>
                <td>{r.customer}</td>
                <td>{r.product}</td>
                <td
                  style={{
                    fontStyle: "italic",
                    color: "var(--gray)",
                    fontSize: "13px",
                  }}
                >
                  "{r.reason}"
                </td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "Complété"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {r.status === "En attente" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn-outline"
                        style={{
                          fontSize: "11px",
                          padding: "6px 10px",
                          color: "var(--success)",
                          borderColor: "var(--success)",
                        }}
                        onClick={() => handleAction(r.id, "Complété")}
                      >
                        Accepter
                      </button>
                      <button
                        className="btn-outline"
                        style={{
                          fontSize: "11px",
                          padding: "6px 10px",
                          color: "var(--error)",
                          borderColor: "var(--error)",
                        }}
                        onClick={() => handleAction(r.id, "Refusé")}
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                  {r.status !== "En attente" && (
                    <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                      Traité le {r.date}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* STATISTIQUES RAPIDES SUR LES RETOURS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginTop: "32px",
        }}
      >
        <div
          className="card"
          style={{ textAlign: "center", borderLeft: "4px solid var(--gold)" }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "var(--gray)",
              textTransform: "uppercase",
            }}
          >
            Taux de retour
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}
          >
            4.2%
          </div>
        </div>
        <div
          className="card"
          style={{
            textAlign: "center",
            borderLeft: "4px solid var(--success)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "var(--gray)",
              textTransform: "uppercase",
            }}
          >
            Réintégrés au stock
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}
          >
            85%
          </div>
        </div>
        <div
          className="card"
          style={{ textAlign: "center", borderLeft: "4px solid var(--error)" }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "var(--gray)",
              textTransform: "uppercase",
            }}
          >
            Défectueux / Pertes
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}
          >
            15%
          </div>
        </div>
      </div>
    </div>
  );
}
