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

  // --- GESTION DE L'IMAGE ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
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
              {/* ZONE IMAGE */}
              <div
                style={{
                  padding: "24px",
                  background: "#F8FAFC",
                  borderRadius: "16px",
                  border: "2px dashed #E2E8F0",
                  textAlign: "center",
                }}
              >
                {form.image && (
                  <img
                    src={form.image}
                    alt=""
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "15px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray)",
                    marginBottom: "10px",
                  }}
                >
                  Photo du produit (JPG, PNG)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ fontSize: "12px" }}
                />
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
