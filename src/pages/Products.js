import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

// --- CONFIGURATION DES CATÉGORIES LIVRR ---
const CATEGORIES = [
  "Vêtements",
  "Chaussures",
  "Accessoires",
  "Beauté",
  "Épicerie Fine",
];

// --- DONNÉES INITIALES POUR LE TEST ---
const INIT_PRODUCTS = [
  {
    _id: "p1",
    image: null,
    name: "Robe Midi Fleurie",
    brand: "Sandro",
    category: "Vêtements",
    price: 490,
    stock: 22,
    active: true,
  },
  {
    _id: "p2",
    image: null,
    name: "Huile d'Olive Extra Vierge",
    brand: "Terroirs",
    category: "Épicerie Fine",
    price: 45,
    stock: 50,
    active: true,
  },
  {
    _id: "p3",
    image: null,
    name: "Parfum Oud 50ml",
    brand: "Maison Crivelli",
    category: "Beauté",
    price: 280,
    stock: 15,
    active: true,
  },
  {
    _id: "p4",
    image: null,
    name: "Sérum Éclat Visage",
    brand: "Augustinus Bader",
    category: "Beauté",
    price: 185,
    stock: 8,
    active: true,
  },
];

const EMPTY_FORM = {
  image: null,
  name: "",
  brand: "Sandro",
  category: "Vêtements",
  price: "",
  stock: "",
  active: true,
};

export default function Products() {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterCat, setFilterCat] = useState("all");

  const fileInputRef = useRef(null);

  // --- GESTION DES CHAMPS DU FORMULAIRE ---
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // --- OUVERTURE MODAL (NOUVEAU / MODIF) ---
  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditProduct(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({ ...product });
    setShowModal(true);
  };

  // --- GESTION DE L'IMAGE + MODÉRATION IA ---
  const [moderating, setModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState(null); // null | "approved" | "rejected"

  const BLOCKED_KEYWORDS = [
    "nude",
    "naked",
    "explicit",
    "drug",
    "weapon",
    "violence",
    "xxx",
  ];

  const moderateImage = (file, dataUrl) => {
    setModerating(true);
    setModerationResult(null);
    // Simulation modération IA (en prod : appel API Google Vision / AWS Rekognition)
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      const isBlocked = BLOCKED_KEYWORDS.some((k) => fileName.includes(k));
      if (isBlocked) {
        setModerationResult("rejected");
        setModerating(false);
        toast.error(
          "⚠️ Image refusée : contenu potentiellement inapproprié détecté par le filtre IA.",
          { duration: 5000 }
        );
      } else {
        setForm((prev) => ({ ...prev, image: dataUrl }));
        setModerationResult("approved");
        setModerating(false);
        toast.success("✓ Image validée par le filtre IA LIVRR", {
          duration: 2000,
        });
      }
    }, 1800); // simule le temps d'analyse IA
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => moderateImage(file, reader.result);
    reader.readAsDataURL(file);
  };

  // --- SAUVEGARDE (CREATE & UPDATE) ---
  const handleSave = () => {
    if (!form.name || !form.price)
      return toast.error("Le nom et le prix sont obligatoires");

    const formattedProduct = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
    };

    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? formattedProduct : p))
      );
      toast.success("Produit mis à jour avec succès");
    } else {
      const newP = { ...formattedProduct, _id: "p" + Date.now() };
      setProducts((prev) => [newP, ...prev]);
      toast.success("Produit ajouté au catalogue");
    }
    setShowModal(false);
  };

  // --- IMPORTATION MASSIVE CSV ---
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split("\n");
      const newItems = rows
        .slice(1)
        .map((row, index) => {
          const cols = row.split(",");
          if (cols.length < 2) return null;
          return {
            _id: "bulk-" + Date.now() + index,
            image: null,
            name: cols[0]?.trim(),
            brand: cols[1]?.trim() || "LIVRR Partner",
            category: cols[2]?.trim() || "Épicerie Fine",
            price: parseFloat(cols[3]) || 0,
            stock: parseInt(cols[4]) || 0,
            active: true,
          };
        })
        .filter((p) => p !== null && p.name);

      setProducts((prev) => [...newItems, ...prev]);
      toast.success(
        `${newItems.length} produits importés. Pensez à ajouter les photos !`
      );
    };
    reader.readAsText(file);
  };

  // --- FILTRAGE ---
  const filtered = products
    .filter((p) => filterCat === "all" || p.category === filterCat)
    .filter(
      (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="page">
      {/* SECTION ENTÊTE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
            Produits & Stocks
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            Gestion de l'inventaire — {products.length} références
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleCSVImport}
          />
          <button
            className="btn-outline"
            onClick={() => fileInputRef.current.click()}
          >
            📥 Importer CSV
          </button>
          <button className="btn-gold" onClick={openNew}>
            + Nouveau produit
          </button>
        </div>
      </div>

      {/* RECHERCHE ET FILTRES PAR CATÉGORIE */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          className="input-field"
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "220px", marginBottom: 0 }}
        />

        <button
          onClick={() => setFilterCat("all")}
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            fontSize: "13px",
            cursor: "pointer",
            border: "none",
            background: filterCat === "all" ? "var(--noir)" : "var(--white)",
            color: filterCat === "all" ? "var(--white)" : "var(--gray)",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          Tous
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              background: filterCat === cat ? "var(--noir)" : "var(--white)",
              color: filterCat === cat ? "var(--white)" : "var(--gray)",
              fontWeight: "600",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TABLEAU DES PRODUITS */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ARTICLE</th>
              <th>CATÉGORIE</th>
              <th>PRIX UNITAIRE</th>
              <th>STOCK</th>
              <th>STATUT</th>
              <th style={{ textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product._id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "10px",
                        background: "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "20px", opacity: 0.4 }}>
                          📷
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                        {product.brand}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-gray">{product.category}</span>
                </td>
                <td style={{ fontWeight: "700" }}>{product.price} €</td>
                <td
                  style={{
                    fontWeight: "600",
                    color: product.stock < 5 ? "var(--error)" : "inherit",
                  }}
                >
                  {product.stock} pcs
                </td>
                <td>
                  <span
                    style={{
                      color: product.active ? "#10B981" : "#9CA3AF",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                  >
                    {product.active ? "● ACTIF" : "○ INACTIF"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn-outline"
                    style={{ fontSize: "12px", padding: "7px 14px" }}
                    onClick={() => openEdit(product)}
                  >
                    Modifier / Photo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL D'ÉDITION ET AJOUT */}
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
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "24px",
              padding: "36px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "28px",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  fontFamily: "var(--font-display)",
                }}
              >
                {editProduct ? "Modifier l'article" : "Nouvel article"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#ccc",
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* ZONE IMAGE + MODÉRATION IA */}
              <div
                style={{
                  padding: "20px",
                  background: "#F8FAFC",
                  borderRadius: "16px",
                  border: `2px dashed ${
                    moderationResult === "rejected"
                      ? "var(--error)"
                      : moderationResult === "approved"
                      ? "var(--success)"
                      : "#E2E8F0"
                  }`,
                  textAlign: "center",
                  transition: "border-color 0.3s",
                }}
              >
                {moderating ? (
                  <div style={{ padding: "12px 0" }}>
                    <div
                      className="spinner"
                      style={{ margin: "0 auto 12px" }}
                    />
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--gray)",
                        fontWeight: "600",
                      }}
                    >
                      Analyse IA en cours…
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--gray-light)",
                        marginTop: "4px",
                      }}
                    >
                      Vérification du contenu par le filtre LIVRR
                    </div>
                  </div>
                ) : (
                  <>
                    {form.image && moderationResult === "approved" && (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          marginBottom: "12px",
                        }}
                      >
                        <img
                          src={form.image}
                          alt=""
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "var(--success)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          ✓
                        </div>
                      </div>
                    )}
                    {moderationResult === "rejected" && (
                      <div
                        style={{
                          padding: "10px",
                          background: "var(--error-bg)",
                          borderRadius: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--error)",
                            fontWeight: "700",
                            marginBottom: "4px",
                          }}
                        >
                          ⚠️ Image refusée
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--error)",
                            opacity: 0.8,
                          }}
                        >
                          Contenu inapproprié détecté. Veuillez choisir une
                          autre image.
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        marginBottom: "10px",
                      }}
                    >
                      {moderationResult === "approved"
                        ? "✓ Image validée par le filtre IA LIVRR"
                        : "Photo du produit (JPG, PNG) — Analysée par IA"}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ fontSize: "12px" }}
                    />
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "10px",
                        color: "var(--gray-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      🤖 Filtrage automatique · Contenu inapproprié bloqué
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="label">Nom du produit</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Ex: Coffret Huile d'Argan"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label className="label">Catégorie</label>
                  <select
                    className="input-field"
                    value={form.category}
                    onChange={handleChange("category")}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Prix de vente (€)</label>
                  <input
                    className="input-field"
                    type="number"
                    value={form.price}
                    onChange={handleChange("price")}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label className="label">Stock disponible</label>
                  <input
                    className="input-field"
                    type="number"
                    value={form.stock}
                    onChange={handleChange("stock")}
                  />
                </div>
                <div>
                  <label className="label">Statut</label>
                  <select
                    className="input-field"
                    value={form.active}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        active: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  className="btn-gold"
                  style={{ flex: 2, padding: "14px" }}
                  onClick={handleSave}
                >
                  {editProduct ? "Mettre à jour" : "Ajouter au catalogue"}
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
