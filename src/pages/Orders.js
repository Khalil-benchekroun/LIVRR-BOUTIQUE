import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_ORDERS = [
  {
    id: "ORD-8821",
    customer: "Sarah B.",
    items: [{ name: "Robe Midi Fleurie", size: "M", qty: 1, price: 490 }],
    total: 490,
    status: "new",
    time: "Il y a 5 min",
    address: "Anfa Park, Résidence les Palmiers, Casablanca",
    deliverySlot: "18h - 19h",
    assignedVendor: null,
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
    assignedVendor: "Siham B.",
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
    assignedVendor: "Youssef L.",
  },
];

const INITIAL_STAFF = [
  { id: 1, name: "Siham B.", role: "Manager", status: "En poste", sales: 45 },
  {
    id: 2,
    name: "Youssef L.",
    role: "Vendeur Senior",
    status: "En poste",
    sales: 32,
  },
  {
    id: 3,
    name: "Amine R.",
    role: "Vendeur Junior",
    status: "Repos",
    sales: 12,
  },
];

const STATUS_CONFIG = {
  new: {
    label: "À Valider",
    bg: "#FFFBEB",
    color: "#B45309",
    border: "#FEF3C7",
    dot: "#F59E0B",
  },
  preparing: {
    label: "En préparation",
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#DBEAFE",
    dot: "#3B82F6",
  },
  ready: {
    label: "Prête",
    bg: "#F0FDF4",
    color: "#15803D",
    border: "#DCFCE7",
    dot: "#22C55E",
  },
};

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "new", label: "Nouvelles" },
  { id: "preparing", label: "En cours" },
  { id: "ready", label: "Prêtes" },
];

export default function Orders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [filter, setFilter] = useState("all");
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const handleAcceptClick = (orderId) => {
    setPendingOrderId(orderId);
    setSelectedVendorId(null);
    setShowVendorModal(true);
  };

  const handleConfirmVendor = () => {
    if (!selectedVendorId)
      return toast.error("Veuillez sélectionner un vendeur");
    const vendor = staff.find((s) => s.id === selectedVendorId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === pendingOrderId
          ? { ...o, status: "preparing", assignedVendor: vendor.name }
          : o
      )
    );
    setStaff((prev) =>
      prev.map((s) =>
        s.id === selectedVendorId ? { ...s, sales: s.sales + 1 } : s
      )
    );
    toast.success(`Assignée à ${vendor.name} — Préparation lancée !`);
    setShowVendorModal(false);
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (newStatus === "ready")
      toast.success("Colis prêt ! Signal envoyé au coursier LIVRR.");
  };

  const printOrder = (order) => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>LIVRR — Bon #${order.id}</title>
    <style>body{font-family:Helvetica,sans-serif;padding:30px;line-height:1.6}.header{border-bottom:2px solid #000;padding-bottom:15px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}.details{background:#f9f9f9;padding:15px;border-radius:8px;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th{text-align:left;background:#000;color:#fff;padding:10px}td{padding:12px 10px;border-bottom:1px solid #eee}.total{text-align:right;font-weight:bold;font-size:18px;margin-top:20px}.footer{margin-top:40px;text-align:center;font-size:11px;color:#888;border-top:1px dashed #ccc;padding-top:20px}</style>
    </head><body>
    <div class="header"><h1 style="margin:0;letter-spacing:2px">LIVRR</h1><span>COMMANDE #${
      order.id
    }</span></div>
    <div class="details"><p><strong>CLIENT :</strong> ${
      order.customer
    }</p><p><strong>ADRESSE :</strong> ${
      order.address
    }</p><p><strong>LIVRAISON :</strong> ${order.deliverySlot}</p>${
      order.assignedVendor
        ? `<p><strong>VENDEUR :</strong> ${order.assignedVendor}</p>`
        : ""
    }</div>
    <table><thead><tr><th>ARTICLE</th><th>TAILLE</th><th>QTY</th></tr></thead><tbody>${order.items
      .map(
        (i) => `<tr><td>${i.name}</td><td>${i.size}</td><td>x${i.qty}</td></tr>`
      )
      .join("")}</tbody></table>
    <div class="total">TOTAL : €${order.total}</div>
    <div class="footer">Document de préparation interne — Ne pas joindre au colis.</div>
    <script>window.print();window.close();</script></body></html>`);
  };

  const filteredOrders = orders.filter(
    (o) => filter === "all" || o.status === filter
  );

  return (
    <>
      <style>{`
        @keyframes orderIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .order-card {
          background: var(--white);
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.055);
          display: grid;
          grid-template-columns: 160px 1fr 200px 180px;
          align-items: center;
          gap: 28px;
          padding: 24px 28px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .order-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          transform: translateY(-2px);
        }
        .order-card.new-order {
          border-left: 4px solid var(--gold);
          background: linear-gradient(135deg, rgba(201,169,110,0.02) 0%, var(--white) 40%);
        }
        .order-card.new-order::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
        }
        .filter-pill {
          padding: 9px 20px;
          border-radius: 30px;
          border: none;
          font-size: 13px;
          cursor: pointer;
          font-family: var(--font-body);
          font-weight: 500;
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
        }
        .filter-pill.active {
          background: var(--noir);
          color: var(--white);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .filter-pill.inactive {
          background: transparent;
          color: var(--gray);
        }
        .filter-pill.inactive:hover {
          background: var(--white-2);
          color: var(--noir);
        }
        .vendor-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(0,0,0,0.07);
          background: #FAFAF8;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .vendor-card:hover { border-color: var(--gold-light); background: var(--gold-lighter); }
        .vendor-card.selected {
          border-color: var(--gold);
          background: rgba(201,169,110,0.06);
          box-shadow: 0 0 0 3px rgba(201,169,110,0.1);
        }
        .vendor-card.disabled { opacity: 0.45; pointer-events: none; }
        .action-btn-print {
          width: 44px; height: 44px; padding: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: var(--white-2);
          font-size: 18px;
          transition: all 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        .action-btn-print:hover { background: var(--white-3); transform: scale(1.05); }
      `}</style>

      <div className="page">
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "36px",
            animation: "slideInLeft 0.4s ease forwards",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "42px",
                fontWeight: "400",
                marginBottom: "6px",
              }}
            >
              Commandes
            </h1>
            <p style={{ color: "var(--gray)", fontSize: "14px" }}>
              Flux opérationnel en temps réel
            </p>
            <div
              style={{
                marginTop: "16px",
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--gold-light), transparent)",
                width: "80px",
              }}
            />
          </div>

          {/* Filtres */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(0,0,0,0.03)",
              padding: "5px",
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`filter-pill ${
                  filter === f.id ? "active" : "inactive"
                }`}
              >
                {f.label}
                {f.id !== "all" && (
                  <span
                    style={{
                      marginLeft: "5px",
                      opacity: 0.55,
                      fontSize: "12px",
                    }}
                  >
                    ({orders.filter((o) => o.status === f.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── LISTE ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredOrders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px",
                background: "var(--white)",
                borderRadius: "20px",
                border: "1px dashed rgba(0,0,0,0.1)",
                animation: "fadeIn 0.4s ease forwards",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  marginBottom: "8px",
                }}
              >
                Aucune commande
              </div>
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                Cette section est vide pour le moment.
              </p>
            </div>
          ) : (
            filteredOrders.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className={`order-card ${
                    order.status === "new" ? "new-order" : ""
                  }`}
                  style={{
                    animation: `orderIn 0.4s ${i * 0.07}s ease both`,
                    opacity: 0,
                  }}
                >
                  {/* COL 1 — ID & TIME */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: "600",
                        fontSize: "20px",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      #{order.id}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "var(--gold)",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {order.time}
                    </div>
                    {order.assignedVendor && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--info)",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>👤</span> {order.assignedVendor}
                      </div>
                    )}
                  </div>

                  {/* COL 2 — CLIENT & ARTICLES */}
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                        marginBottom: "5px",
                      }}
                    >
                      {order.customer}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--gray)",
                        lineHeight: "1.5",
                        marginBottom: "8px",
                      }}
                    >
                      {order.items
                        .map((i) => `${i.qty}× ${i.name} [${i.size}]`)
                        .join(" · ")}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray-light)",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>📍</span>
                      {order.address}
                    </div>
                  </div>

                  {/* COL 3 — STATUS & SLOT */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 16px",
                        borderRadius: "30px",
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        background: cfg.bg,
                        color: cfg.color,
                        border: `1px solid ${cfg.border}`,
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: cfg.dot,
                          flexShrink: 0,
                        }}
                      />
                      {cfg.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <span>🕒</span> {order.deliverySlot}
                    </div>
                  </div>

                  {/* COL 4 — ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="action-btn-print"
                      onClick={() => printOrder(order)}
                      title="Imprimer le bon"
                    >
                      🖨️
                    </button>

                    {order.status === "new" && (
                      <button
                        className="btn-gold"
                        style={{
                          padding: "0 20px",
                          height: "44px",
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.04em",
                        }}
                        onClick={() => handleAcceptClick(order.id)}
                      >
                        Accepter
                      </button>
                    )}

                    {order.status === "preparing" && (
                      <button
                        style={{
                          padding: "0 20px",
                          height: "44px",
                          fontSize: "13px",
                          fontWeight: "700",
                          letterSpacing: "0.04em",
                          borderRadius: "var(--radius-md)",
                          background: "var(--noir)",
                          color: "var(--white)",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1a1a2e";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--noir)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => updateStatus(order.id, "ready")}
                      >
                        Prêt ✓
                      </button>
                    )}

                    {order.status === "ready" && (
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--success)",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "var(--success)",
                              display: "inline-block",
                            }}
                          />
                          Prête
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--gray-light)",
                            marginTop: "3px",
                          }}
                        >
                          Coursier notifié
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── MODAL VENDEUR ── */}
        {showVendorModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,10,15,0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.2s ease forwards",
            }}
            onClick={() => setShowVendorModal(false)}
          >
            <div
              style={{
                background: "var(--white)",
                borderRadius: "24px",
                padding: "36px",
                width: "100%",
                maxWidth: "480px",
                boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
                animation:
                  "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ligne dorée haut */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, var(--gold), transparent)",
                }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: "400",
                  marginBottom: "6px",
                }}
              >
                Assigner un vendeur
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--gray)",
                  marginBottom: "28px",
                }}
              >
                Commande{" "}
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                  }}
                >
                  #{pendingOrderId}
                </strong>{" "}
                — sélectionnez le vendeur
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "28px",
                }}
              >
                {staff.map((member, i) => (
                  <div
                    key={member.id}
                    className={`vendor-card ${
                      selectedVendorId === member.id ? "selected" : ""
                    } ${member.status === "Repos" ? "disabled" : ""}`}
                    onClick={() =>
                      member.status !== "Repos" &&
                      setSelectedVendorId(member.id)
                    }
                    style={{
                      animation: `fadeUp 0.3s ${i * 0.06}s ease both`,
                      opacity: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "14px",
                        flexShrink: 0,
                        background:
                          selectedVendorId === member.id
                            ? "linear-gradient(135deg, var(--gold), var(--gold-dark))"
                            : "var(--gold-lighter)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "17px",
                        fontWeight: "800",
                        color:
                          selectedVendorId === member.id
                            ? "var(--noir)"
                            : "var(--gold-dark)",
                        transition: "all 0.2s ease",
                        boxShadow:
                          selectedVendorId === member.id
                            ? "0 4px 14px rgba(201,169,110,0.4)"
                            : "none",
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "14px",
                          marginBottom: "2px",
                        }}
                      >
                        {member.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {member.role} · {member.sales} ventes
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color:
                            member.status === "En poste"
                              ? "var(--success)"
                              : "var(--gray)",
                        }}
                      >
                        ● {member.status}
                      </span>
                      {selectedVendorId === member.id && (
                        <span
                          style={{
                            color: "var(--gold)",
                            fontWeight: "800",
                            fontSize: "18px",
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
                  style={{
                    flex: 2,
                    padding: "14px",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.04em",
                  }}
                  onClick={handleConfirmVendor}
                >
                  Confirmer & Lancer →
                </button>
                <button
                  className="btn-outline"
                  style={{ flex: 1, padding: "14px" }}
                  onClick={() => setShowVendorModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
