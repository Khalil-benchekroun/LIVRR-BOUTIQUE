import React, { useState } from "react";
import toast from "react-hot-toast";

const PRODUCTS_DB = [
  {
    id: 1,
    name: "Robe Midi Fleurie",
    price: 490,
    stock: 12,
    category: "Vêtements",
  },
  { id: 2, name: "Trench Camel", price: 890, stock: 5, category: "Vêtements" },
  {
    id: 3,
    name: "Sac Cuir Noir",
    price: 1200,
    stock: 3,
    category: "Accessoires",
  },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });

  const addToCart = (p) => {
    const exists = cart.find((item) => item.id === p.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === p.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
    toast.success(`${p.name} ajouté au panier`);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Le panier est vide");
    if (!customer.name) return toast.error("Nom du client requis");

    toast.loading("Enregistrement de la vente...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Commande enregistrée ! Email de suivi envoyé au client.");
      setCart([]);
      setCustomer({ name: "", email: "", phone: "" });
    }, 2000);
  };

  return (
    <div
      className="page"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: "24px",
        height: "calc(100vh - 64px)",
      }}
    >
      {/* SECTION GAUCHE : RECHERCHE & PRODUITS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="card">
          <h2 style={{ marginBottom: "16px" }}>Enregistrer une vente</h2>
          <input
            className="input-field"
            placeholder="🔍 Rechercher un produit ou scanner un code-barres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            overflowY: "auto",
          }}
        >
          {PRODUCTS_DB.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          ).map((p) => (
            <div
              key={p.id}
              className="card"
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => addToCart(p)}
            >
              <div style={{ fontSize: "30px", marginBottom: "10px" }}>🛍️</div>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>
                {p.name}
              </div>
              <div style={{ color: "var(--gold)", fontWeight: "bold" }}>
                {p.price} €
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--gray)",
                  marginTop: "5px",
                }}
              >
                Stock: {p.stock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION DROITE : PANIER & CLIENT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          className="card"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ marginBottom: "20px" }}>Panier Actuel</h3>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--gray)",
                  marginTop: "40px",
                }}
              >
                Panier vide
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    borderBottom: "1px solid #f5f5f5",
                    paddingBottom: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                      {item.qty} x {item.price} €
                    </div>
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {item.qty * item.price} €
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              borderTop: "2px solid var(--noir)",
              paddingTop: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              <span>Total</span>
              <span>{total} €</span>
            </div>

            <form
              onSubmit={handleCheckout}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                className="input-field"
                placeholder="Nom du client"
                required
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                className="input-field"
                placeholder="Email (pour le suivi)"
                type="email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />
              <button
                className="btn-gold"
                style={{ width: "100%", padding: "15px" }}
                type="submit"
              >
                VALIDER LA VENTE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
