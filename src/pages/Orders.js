import React, { useState } from "react";
import toast from "react-hot-toast";

// --- DONNÉES DE TEST (Flux de commandes pour le MVP) ---
const INITIAL_ORDERS = [
  {
    id: "ORD-8821",
    customer: "Sarah B.",
    items: [{ name: "Robe Midi Fleurie", size: "M", qty: 1, price: 490 }],
    total: 490,
    status: "new", // new, preparing, ready
    time: "Il y a 5 min",
    address: "Anfa Park, Résidence les Palmiers, Casablanca",
    deliverySlot: "18h - 19h",
  },
  {
    id: "ORD-8815",
    customer: "Karim T.",
    items: [
      { name: "Trench Camel", size: "L", qty: 1, price: 890 },
      { name: "Chapeau Panama", size: "Unique", qty: 1, price: 189 },
    ],
    total: 1079,
    status: "preparing",
    time: "Il y a 25 min",
    address: "Quartier Gauthier, Rue Mozart, Casablanca",
    deliverySlot: "Dès que possible",
  },
  {
    id: "ORD-8790",
    customer: "Yasmine M.",
    items: [{ name: "Blazer Structuré", size: "S", qty: 1, price: 295 }],
    total: 295,
    status: "ready",
    time: "Il y a 1h",
    address: "Bouskoura, Ville Verte, Casablanca",
    deliverySlot: "Prévu 19h30",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState("all");

  // 1. MISE À JOUR DU STATUT (LOGIQUE CDC)
  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    if (newStatus === "preparing")
      toast.success("Commande acceptée ! Préparation lancée.");
    if (newStatus === "ready")
      toast.success("Colis prêt ! Signal envoyé au coursier LIVRR.");
  };

  // 2. IMPRESSION DU BON (OPTIMISÉ POUR BOUTIQUE)
  const printOrder = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>LIVRR - Bon # ${order.id}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 30px; line-height: 1.6; }
            .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .details { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #000; color: #fff; padding: 10px; }
            td { padding: 12px 10px; border-bottom: 1px solid #eee; }
            .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; border-top: 1px dashed #ccc; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0; letter-spacing:2px;">LIVRR</h1>
            <span>COMMANDE # ${order.id}</span>
          </div>
          <div class="details">
            <p><strong>CLIENT :</strong> ${order.customer}</p>
            <p><strong>ADRESSE :</strong> ${order.address}</p>
            <p><strong>LIVRAISON :</strong> ${order.deliverySlot}</p>
          </div>
          <table>
            <thead><tr><th>ARTICLE</th><th>TAILLE</th><th>QTY</th></tr></thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.size}</td>
                  <td>x ${item.qty}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">TOTAL : €${order.total}</div>
          <div class="footer">Document de préparation interne - Ne pas joindre au colis client.</div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  const filteredOrders = orders.filter(
    (o) => filter === "all" || o.status === filter
  );

  return (
    <div className="page">
      {/* HEADER PAGE */}
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
              fontSize: "32px",
              fontWeight: "400",
            }}
          >
            Commandes
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            Flux opérationnel en temps réel
          </p>
        </div>

        {/* FILTRES DÉLÉGANCE */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "rgba(0,0,0,0.04)",
            padding: "4px",
            borderRadius: "14px",
          }}
        >
          {[
            { id: "all", label: "Toutes" },
            { id: "new", label: "Nouvelles" },
            { id: "preparing", label: "En cours" },
            { id: "ready", label: "Prêtes" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                border: "none",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                background: filter === f.id ? "var(--white)" : "transparent",
                color: filter === f.id ? "var(--noir)" : "var(--gray)",
                fontWeight: filter === f.id ? "600" : "400",
                boxShadow:
                  filter === f.id ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                transition: "0.3s",
              }}
            >
              {f.label}{" "}
              {f.id !== "all" && (
                <span style={{ marginLeft: "4px", opacity: 0.6 }}>
                  ({orders.filter((o) => o.status === f.id).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* LISTE DES COMMANDES */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredOrders.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "80px",
              color: "var(--gray)",
              border: "1px dashed #ddd",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📦</div>
            <p>Aucune commande dans cette section pour le moment.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1.5fr 1fr",
                alignItems: "center",
                gap: "30px",
                padding: "24px",
                borderLeft:
                  order.status === "new"
                    ? "6px solid var(--gold)"
                    : "1px solid rgba(0,0,0,0.05)",
                transition: "0.2s",
                position: "relative",
              }}
            >
              {/* COL 1: ID & TIME */}
              <div>
                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "18px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  #{order.id}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--gray)",
                    marginTop: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ color: "var(--gold)" }}>●</span> {order.time}
                </div>
              </div>

              {/* COL 2: CUSTOMER & ITEMS */}
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    color: "var(--noir)",
                  }}
                >
                  {order.customer}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginTop: "4px",
                    lineHeight: "1.4",
                  }}
                >
                  {order.items
                    .map((i) => `${i.qty}x ${i.name} [Size ${i.size}]`)
                    .join(", ")}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  📍 {order.address}
                </div>
              </div>

              {/* COL 3: STATUS & SLOT */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: "30px",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    background:
                      order.status === "new"
                        ? "#FFFBEB"
                        : order.status === "preparing"
                        ? "#EFF6FF"
                        : "#F0FDF4",
                    color:
                      order.status === "new"
                        ? "#B45309"
                        : order.status === "preparing"
                        ? "#1D4ED8"
                        : "#15803D",
                    border: `1px solid ${
                      order.status === "new"
                        ? "#FEF3C7"
                        : order.status === "preparing"
                        ? "#DBEAFE"
                        : "#DCFCE7"
                    }`,
                  }}
                >
                  {order.status === "new"
                    ? "À Valider"
                    : order.status === "preparing"
                    ? "Préparation"
                    : "Prête / En attente"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    color: "var(--noir)",
                    fontWeight: "500",
                  }}
                >
                  🕒 Slot : {order.deliverySlot}
                </div>
              </div>

              {/* COL 4: ACTIONS (LE CŒUR DU CDC) */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn-outline"
                  onClick={() => printOrder(order)}
                  title="Imprimer le bon de préparation"
                  style={{
                    width: "42px",
                    height: "42px",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                >
                  🖨️
                </button>

                {order.status === "new" && (
                  <button
                    className="btn-gold"
                    style={{
                      padding: "0 24px",
                      height: "42px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                    onClick={() => updateStatus(order.id, "preparing")}
                  >
                    Accepter
                  </button>
                )}

                {order.status === "preparing" && (
                  <button
                    className="btn-gold"
                    style={{
                      padding: "0 24px",
                      height: "42px",
                      fontSize: "13px",
                      fontWeight: "600",
                      background: "#000",
                      color: "#fff",
                    }}
                    onClick={() => updateStatus(order.id, "ready")}
                  >
                    Prêt
                  </button>
                )}

                {order.status === "ready" && (
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--success)",
                        fontWeight: "700",
                      }}
                    >
                      PRÊTE ✅
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                      Coursier notifié
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
