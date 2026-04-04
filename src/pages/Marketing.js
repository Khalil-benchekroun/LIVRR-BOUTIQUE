import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_COUPONS = [
  {
    id: 1,
    code: "BIENVENUE10",
    type: "percentage",
    value: 10,
    minOrder: 50,
    usage: 145,
    active: true,
  },
  {
    id: 2,
    code: "LIVRR2026",
    type: "fixed",
    value: 5,
    minOrder: 30,
    usage: 89,
    active: false,
  },
];

export default function Marketing() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
  });

  const toggleCoupon = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast.success("Statut du coupon mis à jour");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const coupon = {
      ...newCoupon,
      id: Date.now(),
      usage: 0,
      active: true,
      value: parseFloat(newCoupon.value),
      minOrder: parseFloat(newCoupon.minOrder) || 0,
    };
    setCoupons([coupon, ...coupons]);
    setShowModal(false);
    setNewCoupon({ code: "", type: "percentage", value: "", minOrder: "" });
    toast.success(`Coupon ${coupon.code} créé !`);
  };

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
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: "400",
            }}
          >
            Promotions
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Générez des coupons pour booster vos ventes
          </p>
        </div>
        <button className="btn-gold" onClick={() => setShowModal(true)}>
          + Créer un coupon
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>CODE COUPON</th>
              <th>RÉDUCTION</th>
              <th>CONDITION</th>
              <th>UTILISATIONS</th>
              <th>STATUT</th>
              <th style={{ textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong style={{ letterSpacing: "1px" }}>{c.code}</strong>
                </td>
                <td>
                  {c.type === "percentage" ? `-${c.value}%` : `-${c.value}€`}
                </td>
                <td>
                  {c.minOrder > 0
                    ? `Dès ${c.minOrder}€ d'achat`
                    : "Aucun minimum"}
                </td>
                <td>{c.usage} fois</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "700",
                      background: c.active ? "#DCFCE7" : "#F3F4F6",
                      color: c.active ? "#15803D" : "#9CA3AF",
                    }}
                  >
                    {c.active ? "ACTIF" : "INACTIF"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => toggleCoupon(c.id)}
                    className="btn-outline"
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      borderColor: c.active ? "#E74C3C" : "#10B981",
                      color: c.active ? "#E74C3C" : "#10B981",
                    }}
                  >
                    {c.active ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CRÉATION */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleCreate}
            style={{
              background: "#fff",
              padding: "32px",
              borderRadius: "20px",
              width: "400px",
            }}
          >
            <h3 style={{ marginBottom: "24px", fontSize: "20px" }}>
              Nouveau Coupon
            </h3>

            <label className="label">Code (Ex: RUSH26)</label>
            <input
              className="input-field"
              required
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  code: e.target.value.toUpperCase(),
                })
              }
            />

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
                  value={newCoupon.type}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, type: e.target.value })
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
                  required
                  value={newCoupon.value}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, value: e.target.value })
                  }
                />
              </div>
            </div>

            <label className="label">Minimum de commande (€)</label>
            <input
              className="input-field"
              type="number"
              placeholder="0"
              value={newCoupon.minOrder}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, minOrder: e.target.value })
              }
            />

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button className="btn-gold" type="submit" style={{ flex: 2 }}>
                Créer le coupon
              </button>
              <button
                className="btn-outline"
                type="button"
                onClick={() => setShowModal(false)}
                style={{ flex: 1 }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
