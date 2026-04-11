import React, { useState } from "react";
import toast from "react-hot-toast";

const BOUTIQUE = {
  name: "Sandro Paris",
  adresse: "12 Rue du Faubourg Saint-Honoré, 75008 Paris",
  url: "https://livrr.app/boutique/sandro-paris",
};

const CATEGORIES = [
  "Vêtements",
  "Chaussures",
  "Accessoires",
  "Beauté",
  "Épicerie Fine",
];

const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Robe Midi Fleurie",
    brand: "Sandro",
    category: "Vêtements",
    price: 490,
    stock: 22,
    active: true,
  },
  {
    id: "p2",
    name: "Blazer Croisé Noir",
    brand: "Sandro",
    category: "Vêtements",
    price: 320,
    stock: 8,
    active: true,
  },
  {
    id: "p3",
    name: "Sneakers Cuir Blanc",
    brand: "Isabel Marant",
    category: "Chaussures",
    price: 450,
    stock: 14,
    active: true,
  },
  {
    id: "p4",
    name: "Sac Cuir Camel",
    brand: "AMI Paris",
    category: "Accessoires",
    price: 890,
    stock: 5,
    active: true,
  },
  {
    id: "p5",
    name: "Parfum Oud 50ml",
    brand: "By Terry",
    category: "Beauté",
    price: 280,
    stock: 20,
    active: true,
  },
  {
    id: "p6",
    name: "Huile d'Olive Extra Vierge",
    brand: "Terroirs",
    category: "Épicerie Fine",
    price: 45,
    stock: 50,
    active: true,
  },
  {
    id: "p7",
    name: "Pull Cachemire Ivoire",
    brand: "Sandro",
    category: "Vêtements",
    price: 390,
    stock: 3,
    active: true,
  },
  {
    id: "p8",
    name: "Mules Dorées",
    brand: "Isabel Marant",
    category: "Chaussures",
    price: 380,
    stock: 0,
    active: false,
  },
  {
    id: "p9",
    name: "Ceinture Dorée",
    brand: "AMI Paris",
    category: "Accessoires",
    price: 195,
    stock: 12,
    active: true,
  },
  {
    id: "p10",
    name: "Crème Visage Luxe",
    brand: "By Terry",
    category: "Beauté",
    price: 165,
    stock: 30,
    active: true,
  },
];

const QR_API = (text, size = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text
  )}&bgcolor=0A0A0F&color=C9A96E&qzone=2&format=svg`;

export default function QRCodePage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [activeTab, setActiveTab] = useState("qr");
  const [qrSize, setQrSize] = useState(220);
  const [qrType, setQrType] = useState("boutique");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copied, setCopied] = useState(false);

  const qrUrl =
    qrType === "boutique"
      ? BOUTIQUE.url
      : selectedProduct
      ? `${BOUTIQUE.url}/produit/${selectedProduct.id}`
      : BOUTIQUE.url;

  const qrLabel =
    qrType === "boutique"
      ? "QR Code Boutique"
      : selectedProduct
      ? `QR — ${selectedProduct.name}`
      : "Sélectionnez un produit";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl).then(() => {
      setCopied(true);
      toast.success("Lien copié !");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = QR_API(qrUrl, 800);
    link.download = `LIVRR_QR_${qrLabel.replace(/ /g, "_")}.svg`;
    link.target = "_blank";
    link.click();
    toast.success("Téléchargement lancé");
  };

  const toggleProduct = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    toast.success("Visibilité mise à jour");
  };

  const filteredProducts = products
    .filter((p) => filterCat === "all" || p.category === filterCat)
    .filter((p) =>
      filterStock === "dispo"
        ? p.stock > 0
        : filterStock === "rupture"
        ? p.stock === 0
        : true
    )
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    );

  const totalActive = products.filter((p) => p.active).length;
  const totalRupture = products.filter((p) => p.stock === 0).length;

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
            QR Code & Accès Boutique
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Gérez votre vitrine LIVRR et générez vos QR codes
          </p>
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "28px",
          background: "var(--white)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          width: "fit-content",
        }}
      >
        {[
          { key: "qr", label: "🔲 Générateur QR Code" },
          { key: "products", label: "🏷️ Produits de la boutique" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "9px 20px",
              borderRadius: "9px",
              border: "none",
              background: activeTab === t.key ? "var(--noir)" : "transparent",
              color: activeTab === t.key ? "#fff" : "var(--gray)",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== ONGLET QR ===== */}
      {activeTab === "qr" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Carte QR */}
          <div>
            <div
              className="card"
              style={{
                background: "var(--noir)",
                borderRadius: "24px",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    "linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light))",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--gold)",
                    fontSize: "13px",
                    letterSpacing: "3px",
                    marginBottom: "4px",
                  }}
                >
                  LIVRR
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "11px",
                    letterSpacing: "1px",
                  }}
                >
                  {qrLabel.toUpperCase()}
                </div>
              </div>
              <div
                style={{
                  background: "#0A0A0F",
                  borderRadius: "16px",
                  border: "1px solid rgba(201,169,110,0.3)",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {qrType === "produit" && !selectedProduct ? (
                  <div
                    style={{
                      width: `${qrSize}px`,
                      height: `${qrSize}px`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.3)",
                      gap: "10px",
                    }}
                  >
                    <div style={{ fontSize: "36px" }}>🔲</div>
                    <div style={{ fontSize: "12px", textAlign: "center" }}>
                      Sélectionnez un produit
                    </div>
                  </div>
                ) : (
                  <img
                    src={QR_API(qrUrl, qrSize)}
                    alt="QR Code LIVRR"
                    width={qrSize}
                    height={qrSize}
                    style={{ borderRadius: "8px", display: "block" }}
                  />
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {BOUTIQUE.name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                    marginTop: "3px",
                  }}
                >
                  {BOUTIQUE.adresse}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button
                className="btn-gold"
                style={{ flex: 2, fontSize: "13px" }}
                onClick={handleDownloadQR}
              >
                ↓ Télécharger QR
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1, fontSize: "13px" }}
                onClick={handleCopyUrl}
              >
                {copied ? "✓ Copié" : "🔗 Lien"}
              </button>
            </div>
            <div
              style={{
                background: "#F8F7F4",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "11px",
                color: "var(--gray)",
                fontFamily: "monospace",
                wordBreak: "break-all",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {qrUrl}
            </div>
          </div>

          {/* Options */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Type QR */}
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
                Type de QR Code
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  {
                    key: "boutique",
                    label: "QR Code Boutique",
                    desc: "Dirige vers toute la boutique LIVRR",
                    icon: "🏪",
                  },
                  {
                    key: "produit",
                    label: "QR Code Produit",
                    desc: "Dirige vers un produit spécifique",
                    icon: "🏷️",
                  },
                ].map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => {
                      setQrType(opt.key);
                      if (opt.key === "boutique") setSelectedProduct(null);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px",
                      borderRadius: "12px",
                      border: `1.5px solid ${
                        qrType === opt.key ? "var(--gold)" : "rgba(0,0,0,0.08)"
                      }`,
                      background:
                        qrType === opt.key
                          ? "rgba(201,169,110,0.06)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        background:
                          qrType === opt.key ? "var(--gold-light)" : "#F0EDE6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      {opt.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {opt.desc}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: `2px solid ${
                            qrType === opt.key ? "var(--gold)" : "#ccc"
                          }`,
                          background:
                            qrType === opt.key ? "var(--gold)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {qrType === opt.key && (
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: "#fff",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sélection produit */}
            {qrType === "produit" && (
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
                  Sélectionner un produit
                </div>
                <input
                  className="input-field"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ marginBottom: "12px" }}
                />
                <div
                  style={{
                    maxHeight: "240px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {products
                    .filter((p) => p.active)
                    .filter(
                      (p) =>
                        !search ||
                        p.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: `1.5px solid ${
                            selectedProduct?.id === p.id
                              ? "var(--gold)"
                              : "rgba(0,0,0,0.07)"
                          }`,
                          background:
                            selectedProduct?.id === p.id
                              ? "rgba(201,169,110,0.06)"
                              : "#FAFAF8",
                          cursor: "pointer",
                          transition: "var(--transition)",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13px" }}>
                            {p.name}
                          </div>
                          <div
                            style={{ fontSize: "11px", color: "var(--gray)" }}
                          >
                            {p.brand} · {p.price} €
                          </div>
                        </div>
                        {selectedProduct?.id === p.id && (
                          <span
                            style={{
                              color: "var(--gold)",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Taille */}
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
                Taille du QR Code
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { label: "S", size: 160, desc: "Digital" },
                  { label: "M", size: 220, desc: "Affichette" },
                  { label: "L", size: 300, desc: "Vitrine" },
                ].map((opt) => (
                  <div
                    key={opt.size}
                    onClick={() => setQrSize(opt.size)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "12px 8px",
                      borderRadius: "10px",
                      border: `1.5px solid ${
                        qrSize === opt.size ? "var(--gold)" : "rgba(0,0,0,0.08)"
                      }`,
                      background:
                        qrSize === opt.size
                          ? "rgba(201,169,110,0.06)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "18px",
                        color:
                          qrSize === opt.size
                            ? "var(--gold-dark)"
                            : "var(--noir)",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--gray)" }}>
                      {opt.desc}
                    </div>
                    <div
                      style={{ fontSize: "10px", color: "var(--gray-light)" }}
                    >
                      {opt.size}px
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseils */}
            <div
              className="card"
              style={{ background: "var(--noir)", border: "none" }}
            >
              <div
                style={{
                  color: "var(--gold)",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                💡 Conseils d'utilisation
              </div>
              <ul
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "1.8",
                  paddingLeft: "16px",
                }}
              >
                <li>Placez le QR code à l'entrée de la boutique</li>
                <li>Ajoutez-le sur les étiquettes produits</li>
                <li>Intégrez-le dans vos sacs d'emballage</li>
                <li>Utilisez le format L pour la vitrine</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===== ONGLET PRODUITS ===== */}
      {activeTab === "products" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              {
                label: "Produits visibles",
                value: totalActive,
                color: "var(--success)",
                bg: "var(--success-bg)",
                icon: "👁️",
              },
              {
                label: "Total produits",
                value: products.length,
                color: "var(--info)",
                bg: "var(--info-bg)",
                icon: "📦",
              },
              {
                label: "En rupture",
                value: totalRupture,
                color: "var(--error)",
                bg: "var(--error-bg)",
                icon: "⚠️",
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
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <input
              className="input-field"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "220px", marginBottom: 0 }}
            />
            <select
              className="input-field"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              style={{ maxWidth: "180px", marginBottom: 0 }}
            >
              <option value="all">Toutes catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              style={{ maxWidth: "160px", marginBottom: 0 }}
            >
              <option value="all">Tout le stock</option>
              <option value="dispo">Disponible</option>
              <option value="rupture">Rupture</option>
            </select>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>PRODUIT</th>
                  <th>CATÉGORIE</th>
                  <th>PRIX</th>
                  <th>STOCK</th>
                  <th>VISIBLE SUR LIVRR</th>
                  <th style={{ textAlign: "right" }}>QR PRODUIT</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--gray)",
                      }}
                    >
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ opacity: p.active ? 1 : 0.5 }}>
                    <td>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {p.brand}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: "700" }}>{p.price} €</td>
                    <td>
                      <span
                        style={{
                          fontWeight: "700",
                          color:
                            p.stock === 0
                              ? "var(--error)"
                              : p.stock < 5
                              ? "var(--warning)"
                              : "var(--success)",
                        }}
                      >
                        {p.stock === 0 ? "Rupture" : `${p.stock} pcs`}
                      </span>
                    </td>
                    <td>
                      <div
                        onClick={() => toggleProduct(p.id)}
                        style={{
                          width: "40px",
                          height: "22px",
                          borderRadius: "11px",
                          background: p.active ? "var(--success)" : "#ccc",
                          position: "relative",
                          transition: "var(--transition)",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "3px",
                            left: p.active ? "21px" : "3px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: "#fff",
                            transition: "var(--transition)",
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-outline"
                        style={{ fontSize: "12px", padding: "7px 14px" }}
                        onClick={() => {
                          setActiveTab("qr");
                          setQrType("produit");
                          setSelectedProduct(p);
                          toast.success(`QR généré pour "${p.name}"`);
                        }}
                      >
                        🔲 Générer QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
