import React, { useState } from "react";
import toast from "react-hot-toast";

const PRODUCTS_DB = [
  {
    id: 1,
    name: "Robe Midi Fleurie",
    price: 490,
    stock: 12,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Vêtements",
  },
  {
    id: 2,
    name: "Trench Camel",
    price: 890,
    stock: 5,
    sizes: ["S", "M", "L"],
    category: "Vêtements",
  },
  {
    id: 3,
    name: "Sac Cuir Noir",
    price: 1200,
    stock: 3,
    sizes: ["Unique"],
    category: "Accessoires",
  },
  {
    id: 4,
    name: "Blazer Structuré",
    price: 295,
    stock: 8,
    sizes: ["XS", "S", "M", "L"],
    category: "Vêtements",
  },
  {
    id: 5,
    name: "Sneakers Cuir Blanc",
    price: 450,
    stock: 6,
    sizes: ["36", "37", "38", "39", "40", "41"],
    category: "Chaussures",
  },
  {
    id: 6,
    name: "Parfum Oud 50ml",
    price: 280,
    stock: 15,
    sizes: ["50ml"],
    category: "Beauté",
  },
];

const STAFF = [
  { id: 1, name: "Siham B.", role: "Manager" },
  { id: 2, name: "Youssef L.", role: "Vendeur Senior" },
  { id: 3, name: "Amine R.", role: "Vendeur Junior" },
];

const EMPTY = { name: "", email: "", phone: "", address: "", city: "" };

export default function POS() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(EMPTY);
  const [vendor, setVendor] = useState(null);
  const [payment, setPayment] = useState("card");
  const [sizeModal, setSizeModal] = useState(null);
  const [step, setStep] = useState(1); // 1=catalogue, 2=panier+form

  const addItem = (p, size) => {
    const key = `${p.id}-${size}`;
    setCart((prev) => {
      const ex = prev.find((i) => i.key === key);
      if (ex)
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, key, size, qty: 1 }];
    });
    toast.success(`${p.name} ajouté`, { duration: 1500 });
    setSizeModal(null);
  };

  const clickProduct = (p) => {
    if (p.sizes.length === 1) addItem(p, p.sizes[0]);
    else setSizeModal(p);
  };

  const updateQty = (key, d) =>
    setCart((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, qty: Math.max(1, i.qty + d) } : i
      )
    );

  const remove = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = () => {
    if (!cart.length) return toast.error("Panier vide");
    if (!customer.name) return toast.error("Nom requis");
    if (!customer.phone) return toast.error("Téléphone requis");
    if (!customer.address) return toast.error("Adresse requise");
    if (!vendor) return toast.error("Sélectionnez un vendeur");
    toast.loading("Enregistrement...", { duration: 2000 });
    setTimeout(() => {
      toast.success(`Commande enregistrée — ${vendor.name}`);
      setCart([]);
      setCustomer(EMPTY);
      setVendor(null);
      setPayment("card");
      setStep(1);
    }, 2000);
  };

  const filtered = PRODUCTS_DB.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page" style={{ paddingBottom: 0, minHeight: "100vh" }}>
      {/* ── HEADER avec stepper ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: "400",
              lineHeight: 1,
            }}
          >
            Enregistrer une vente
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "13px", marginTop: "6px" }}
          >
            Sélectionnez les articles puis renseignez les informations client
          </p>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[
            { n: 1, label: "Articles" },
            { n: 2, label: "Finaliser" },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div
                onClick={() =>
                  (s.n === 2 && cart.length > 0 && setStep(2)) ||
                  (s.n === 1 && setStep(1))
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  background: step === s.n ? "var(--noir)" : "rgba(0,0,0,0.05)",
                  color: step === s.n ? "#fff" : "var(--gray)",
                  transition: "var(--transition)",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background:
                      step === s.n ? "var(--gold)" : "rgba(255,255,255,0.15)",
                    color: step === s.n ? "var(--noir)" : "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  {s.n}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600" }}>
                  {s.label}
                </span>
              </div>
              {i === 0 && (
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    background: "rgba(0,0,0,0.15)",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── ÉTAPE 1 : CATALOGUE ── */}
      {step === 1 && (
        <div style={{ animation: "pageFadeIn 0.3s ease" }}>
          {/* Search + panier résumé */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "24px",
              alignItems: "center",
            }}
          >
            <input
              className="input-field"
              placeholder="🔍 Rechercher un article..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
            />
            {cart.length > 0 && (
              <button
                onClick={() => setStep(2)}
                className="btn-gold"
                style={{
                  whiteSpace: "nowrap",
                  padding: "11px 24px",
                  gap: "10px",
                }}
              >
                Panier ({cart.length}) — {total} € →
              </button>
            )}
          </div>

          {/* Grille produits */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => clickProduct(p)}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px 20px",
                  cursor: "pointer",
                  border: "1.5px solid rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(201,169,110,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Indicateur dans le panier */}
                {cart.some((i) => i.id === p.id) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "var(--gold)",
                      color: "var(--noir)",
                      borderRadius: "20px",
                      padding: "2px 8px",
                      fontSize: "10px",
                      fontWeight: "800",
                    }}
                  >
                    ✓ Ajouté
                  </div>
                )}
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>🛍️</div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  {p.category}
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    color: "var(--gold)",
                    fontWeight: "700",
                    fontSize: "20px",
                    marginBottom: "8px",
                  }}
                >
                  {p.price} €
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                    Stock : {p.stock}
                  </span>
                  <span
                    style={{ fontSize: "11px", color: "var(--gray-light)" }}
                  >
                    {p.sizes.slice(0, 3).join(" · ")}
                    {p.sizes.length > 3 ? "…" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ÉTAPE 2 : RÉCAP + FORMULAIRE ── */}
      {step === 2 && (
        <div style={{ animation: "pageFadeIn 0.3s ease" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {/* COL GAUCHE : Panier */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                    }}
                  >
                    Panier
                  </h3>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      fontSize: "12px",
                      color: "var(--gold)",
                      fontWeight: "600",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    + Ajouter des articles
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        background: "#F8F7F4",
                        borderRadius: "10px",
                      }}
                    >
                      <div style={{ fontSize: "20px" }}>🛍️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "700", fontSize: "13px" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                          Taille {item.size} · {item.price} €/u
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
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
                          }}
                        >
                          +
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
                      <button
                        onClick={() => remove(item.key)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: "none",
                          background: "var(--error-bg)",
                          color: "var(--error)",
                          cursor: "pointer",
                          fontSize: "11px",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "var(--noir)",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    TOTAL
                  </span>
                  <span
                    style={{
                      color: "var(--gold)",
                      fontFamily: "var(--font-display)",
                      fontSize: "28px",
                      fontWeight: "400",
                    }}
                  >
                    {total} €
                  </span>
                </div>
              </div>

              {/* Vendeur */}
              <div className="card">
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--gray)",
                    marginBottom: "14px",
                  }}
                >
                  Vendeur assigné *
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {STAFF.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setVendor(m)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: `1.5px solid ${
                          vendor?.id === m.id
                            ? "var(--gold)"
                            : "rgba(0,0,0,0.07)"
                        }`,
                        background:
                          vendor?.id === m.id
                            ? "rgba(201,169,110,0.06)"
                            : "#FAFAF8",
                        cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          background:
                            vendor?.id === m.id
                              ? "var(--gold)"
                              : "var(--gold-light)",
                          color:
                            vendor?.id === m.id ? "#fff" : "var(--gold-dark)",
                        }}
                      >
                        {m.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "13px" }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                          {m.role}
                        </div>
                      </div>
                      {vendor?.id === m.id && (
                        <span
                          style={{ color: "var(--gold)", fontWeight: "800" }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COL DROITE : Infos client + paiement */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="card">
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--gray)",
                    marginBottom: "20px",
                  }}
                >
                  Informations client
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
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
                        placeholder="Ex: Sophie Martin"
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer({ ...customer, name: e.target.value })
                        }
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                    <div>
                      <label className="label">Téléphone *</label>
                      <input
                        className="input-field"
                        placeholder="+33 6 12 34 56 78"
                        type="tel"
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer({ ...customer, phone: e.target.value })
                        }
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      className="input-field"
                      placeholder="sophie@example.com"
                      type="email"
                      value={customer.email}
                      onChange={(e) =>
                        setCustomer({ ...customer, email: e.target.value })
                      }
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <div>
                    <label className="label">Adresse de livraison *</label>
                    <input
                      className="input-field"
                      placeholder="42 Avenue Montaigne, 75008 Paris"
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <div>
                    <label className="label">Ville</label>
                    <input
                      className="input-field"
                      placeholder="Paris"
                      value={customer.city}
                      onChange={(e) =>
                        setCustomer({ ...customer, city: e.target.value })
                      }
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="card">
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--gray)",
                    marginBottom: "14px",
                  }}
                >
                  Mode de paiement
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {[
                    { key: "card", icon: "💳", label: "Carte" },
                    { key: "cash", icon: "💵", label: "Espèces" },
                  ].map((m) => (
                    <div
                      key={m.key}
                      onClick={() => setPayment(m.key)}
                      style={{
                        textAlign: "center",
                        padding: "16px 8px",
                        borderRadius: "12px",
                        border: `2px solid ${
                          payment === m.key ? "var(--gold)" : "rgba(0,0,0,0.08)"
                        }`,
                        background:
                          payment === m.key
                            ? "rgba(201,169,110,0.06)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                    >
                      <div style={{ fontSize: "22px", marginBottom: "6px" }}>
                        {m.icon}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: payment === m.key ? "700" : "400",
                          color:
                            payment === m.key
                              ? "var(--gold-dark)"
                              : "var(--gray)",
                        }}
                      >
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                className="btn-gold"
                onClick={checkout}
                style={{
                  padding: "18px",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  borderRadius: "14px",
                }}
              >
                VALIDER LA VENTE — {total} €
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal taille */}
      {sizeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSizeModal(null)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "380px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--gold)",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}
            >
              Sélection taille
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                marginBottom: "4px",
              }}
            >
              {sizeModal.name}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
              }}
            >
              {sizeModal.price} €
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {sizeModal.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => addItem(sizeModal, size)}
                  style={{
                    padding: "12px 22px",
                    borderRadius: "10px",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    background: "#FAFAF8",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "var(--gold)";
                    e.target.style.background = "rgba(201,169,110,0.06)";
                    e.target.style.color = "var(--gold-dark)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(0,0,0,0.1)";
                    e.target.style.background = "#FAFAF8";
                    e.target.style.color = "inherit";
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => setSizeModal(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
