import React, { useState } from "react";
import toast from "react-hot-toast";

const PRODUCTS_DB = [
  {
    id: 1,
    name: "Robe Midi Fleurie",
    price: 490,
    stock: 12,
    category: "Vêtements",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Trench Camel",
    price: 890,
    stock: 5,
    category: "Vêtements",
    sizes: ["S", "M", "L"],
  },
  {
    id: 3,
    name: "Sac Cuir Noir",
    price: 1200,
    stock: 3,
    category: "Accessoires",
    sizes: ["Unique"],
  },
  {
    id: 4,
    name: "Blazer Structuré",
    price: 295,
    stock: 8,
    category: "Vêtements",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 5,
    name: "Sneakers Cuir Blanc",
    price: 450,
    stock: 6,
    category: "Chaussures",
    sizes: ["36", "37", "38", "39", "40", "41"],
  },
  {
    id: 6,
    name: "Parfum Oud 50ml",
    price: 280,
    stock: 15,
    category: "Beauté",
    sizes: ["50ml"],
  },
];

const STAFF = [
  { id: 1, name: "Siham B.", role: "Manager", status: "En poste" },
  { id: 2, name: "Youssef L.", role: "Vendeur Senior", status: "En poste" },
  { id: 3, name: "Amine R.", role: "Vendeur Junior", status: "Repos" },
];

const EMPTY_CUSTOMER = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
};

export default function POS() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSizeModal, setShowSizeModal] = useState(null); // produit en attente de taille

  // Ajoute au panier avec taille
  const addToCartWithSize = (product, size, qty = 1) => {
    const key = `${product.id}-${size}`;
    const exists = cart.find((item) => item.key === key);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.key === key ? { ...item, qty: item.qty + qty } : item
        )
      );
    } else {
      setCart([...cart, { ...product, key, size, qty }]);
    }
    toast.success(`${product.name} [${size}] ajouté`);
    setShowSizeModal(null);
  };

  const handleProductClick = (p) => {
    if (p.sizes.length === 1) {
      addToCartWithSize(p, p.sizes[0]);
    } else {
      setShowSizeModal(p);
    }
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return toast.error("Le panier est vide");
    if (!customer.name) return toast.error("Nom du client requis");
    if (!customer.phone) return toast.error("Numéro de téléphone requis");
    if (!customer.address) return toast.error("Adresse de livraison requise");
    if (!selectedVendor) return toast.error("Veuillez sélectionner un vendeur");

    toast.loading("Enregistrement de la vente...", { duration: 2000 });
    setTimeout(() => {
      toast.success(
        `Commande enregistrée ! Assignée à ${selectedVendor.name}.`
      );
      setCart([]);
      setCustomer(EMPTY_CUSTOMER);
      setSelectedVendor(null);
      setPaymentMethod("card");
    }, 2000);
  };

  const filteredProducts = PRODUCTS_DB.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="page"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "24px",
        height: "calc(100vh - 64px)",
      }}
    >
      {/* GAUCHE : PRODUITS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto",
        }}
      >
        <div className="card">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              marginBottom: "16px",
            }}
          >
            Enregistrer une vente
          </h2>
          <input
            className="input-field"
            placeholder="🔍 Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                textAlign: "center",
                cursor: "pointer",
                transition: "var(--transition)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              onClick={() => handleProductClick(p)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--gold)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)")
              }
            >
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>🛍️</div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  color: "var(--gold)",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                {p.price} €
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--gray)",
                  marginTop: "4px",
                }}
              >
                Stock: {p.stock}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--gray-light)",
                  marginTop: "2px",
                }}
              >
                {p.sizes.slice(0, 3).join(" · ")}
                {p.sizes.length > 3 ? "..." : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DROITE : PANIER + FORMULAIRE */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
        }}
      >
        {/* PANIER */}
        <div className="card">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              marginBottom: "16px",
            }}
          >
            Panier Actuel
          </h3>
          {cart.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--gray)",
                padding: "20px 0",
              }}
            >
              Panier vide
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {cart.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    background: "#F8F7F4",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                      Taille : {item.size} · {item.price} €/u
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => updateQty(item.key, -1)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontWeight: "700",
                        minWidth: "20px",
                        textAlign: "center",
                      }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.key, 1)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "none",
                        background: "var(--error-bg)",
                        color: "var(--error)",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      minWidth: "60px",
                      textAlign: "right",
                      fontSize: "14px",
                    }}
                  >
                    {item.qty * item.price} €
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              borderTop: "2px solid var(--noir)",
              paddingTop: "14px",
              marginTop: "14px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            <span>Total</span>
            <span>{total} €</span>
          </div>
        </div>

        {/* INFOS CLIENT */}
        <div className="card">
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
            Informations client
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <input
                className="input-field"
                placeholder="Nom du client *"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
              <input
                className="input-field"
                placeholder="Téléphone *"
                type="tel"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
            </div>
            <input
              className="input-field"
              placeholder="Email (pour le suivi)"
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              style={{ marginBottom: 0 }}
            />
            <input
              className="input-field"
              placeholder="Adresse de livraison *"
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
              style={{ marginBottom: 0 }}
            />
            <input
              className="input-field"
              placeholder="Ville"
              value={customer.city}
              onChange={(e) =>
                setCustomer({ ...customer, city: e.target.value })
              }
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>

        {/* VENDEUR */}
        <div className="card">
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
            Vendeur assigné *
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {STAFF.map((member) => (
              <div
                key={member.id}
                onClick={() =>
                  member.status === "En poste" && setSelectedVendor(member)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1.5px solid ${
                    selectedVendor?.id === member.id
                      ? "var(--gold)"
                      : "rgba(0,0,0,0.07)"
                  }`,
                  background:
                    selectedVendor?.id === member.id
                      ? "rgba(201,169,110,0.06)"
                      : "#FAFAF8",
                  cursor:
                    member.status === "En poste" ? "pointer" : "not-allowed",
                  opacity: member.status === "Repos" ? 0.45 : 1,
                  transition: "var(--transition)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background:
                      selectedVendor?.id === member.id
                        ? "var(--gold)"
                        : "var(--gold-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "700",
                    color:
                      selectedVendor?.id === member.id
                        ? "#fff"
                        : "var(--gold-dark)",
                    flexShrink: 0,
                  }}
                >
                  {member.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "13px" }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {member.role}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color:
                      member.status === "En poste"
                        ? "var(--success)"
                        : "var(--gray)",
                  }}
                >
                  ● {member.status}
                </span>
                {selectedVendor?.id === member.id && (
                  <span style={{ color: "var(--gold)", fontWeight: "700" }}>
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PAIEMENT */}
        <div className="card">
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
            Mode de paiement
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { key: "card", label: "💳 Carte" },
              { key: "cash", label: "💵 Espèces" },
              { key: "transfer", label: "🏦 Virement" },
            ].map((m) => (
              <div
                key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 8px",
                  borderRadius: "10px",
                  border: `1.5px solid ${
                    paymentMethod === m.key ? "var(--gold)" : "rgba(0,0,0,0.08)"
                  }`,
                  background:
                    paymentMethod === m.key
                      ? "rgba(201,169,110,0.06)"
                      : "transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: paymentMethod === m.key ? "700" : "400",
                  transition: "var(--transition)",
                }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* VALIDER */}
        <button
          className="btn-gold"
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
          onClick={handleCheckout}
        >
          VALIDER LA VENTE
        </button>
      </div>

      {/* MODAL TAILLE */}
      {showSizeModal && (
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
          onClick={() => setShowSizeModal(null)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              width: "100%",
              maxWidth: "360px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                marginBottom: "6px",
              }}
            >
              {showSizeModal.name}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              Sélectionnez une taille
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              {showSizeModal.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => addToCartWithSize(showSizeModal, size)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    background: "#FAFAF8",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    fontFamily: "var(--font-body)",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "var(--gold)";
                    e.target.style.background = "rgba(201,169,110,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(0,0,0,0.1)";
                    e.target.style.background = "#FAFAF8";
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => setShowSizeModal(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
