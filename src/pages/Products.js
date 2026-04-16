import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

// ── Quotas par abonnement (CDC) ───────────────────────────────────
const ABONNEMENT_QUOTAS = {
  classic: { label: "Classic", quota: 30, color: "#6B7280" },
  signature: { label: "Signature", quota: 100, color: "#3B82F6" },
  prestige: { label: "Prestige", quota: 300, color: "#C9A96E" },
};
const CURRENT_ABONNEMENT = "classic";

const CATEGORIES = [
  "Vêtements",
  "Chaussures",
  "Accessoires",
  "Beauté",
  "Épicerie Fine",
];

const today = new Date().toLocaleDateString("fr-FR");
const nowStr = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const INIT_PRODUCTS = [
  {
    _id: "p1",
    images: [],
    image: null,
    name: "Robe Midi Fleurie",
    brand: "Sandro",
    category: "Vêtements",
    price: 490,
    stock: 22,
    active: true,
    variantes: [
      { taille: "XS", couleur: "Bleu marine", stock: 3 },
      { taille: "S", couleur: "Bleu marine", stock: 8 },
      { taille: "M", couleur: "Bleu marine", stock: 7 },
      { taille: "L", couleur: "Bleu marine", stock: 4 },
      { taille: "S", couleur: "Blanc cassé", stock: 5 },
      { taille: "M", couleur: "Blanc cassé", stock: 3 },
    ],
    historiqueStock: [
      {
        date: today,
        heure: "10:00",
        acteur: "Siham B.",
        action: "Mise à jour stock",
        avant: 18,
        apres: 22,
        motif: "Réception commande fournisseur",
      },
      {
        date: today,
        heure: "09:00",
        acteur: "Système",
        action: "Vente commande ORD-8821",
        avant: 19,
        apres: 18,
        motif: "Commande acceptée",
      },
    ],
  },
  {
    _id: "p2",
    images: [],
    image: null,
    name: "Huile d'Olive Extra Vierge",
    brand: "Terroirs",
    category: "Épicerie Fine",
    price: 45,
    stock: 50,
    active: true,
    variantes: [],
    historiqueStock: [
      {
        date: today,
        heure: "08:30",
        acteur: "Youssef L.",
        action: "Mise à jour stock",
        avant: 40,
        apres: 50,
        motif: "Réassort",
      },
    ],
  },
  {
    _id: "p3",
    images: [],
    image: null,
    name: "Parfum Oud 50ml",
    brand: "Maison Crivelli",
    category: "Beauté",
    price: 280,
    stock: 15,
    active: true,
    variantes: [
      { taille: "50ml", couleur: "", stock: 15 },
      { taille: "100ml", couleur: "", stock: 0 },
    ],
    historiqueStock: [
      {
        date: today,
        heure: "09:15",
        acteur: "Système",
        action: "Vente commande ORD-8770",
        avant: 17,
        apres: 15,
        motif: "2 unités vendues",
      },
    ],
  },
  {
    _id: "p4",
    images: [],
    image: null,
    name: "Sérum Éclat Visage",
    brand: "Augustinus Bader",
    category: "Beauté",
    price: 185,
    stock: 8,
    active: true,
    variantes: [
      { taille: "30ml", couleur: "", stock: 8 },
      { taille: "50ml", couleur: "", stock: 0 },
    ],
    historiqueStock: [],
  },
];

const EMPTY_FORM = {
  images: [],
  image: null,
  name: "",
  brand: "Sandro",
  category: "Vêtements",
  price: "",
  stock: "",
  active: true,
  variantes: [],
  historiqueStock: [],
};

export default function Products() {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterCat, setFilterCat] = useState("all");

  // ── États manquants ajoutés ──
  const [showVariantesModal, setShowVariantesModal] = useState(null); // null | productId
  const [showHistoModal, setShowHistoModal] = useState(false);
  const [histoProduct, setHistoProduct] = useState(null);
  const [stockEdit, setStockEdit] = useState({});
  const [newVariante, setNewVariante] = useState({
    taille: "",
    couleur: "",
    stock: "",
  });

  // Modération IA
  const [moderating, setModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);

  const fileInputRef = useRef(null);
  const abonnement = ABONNEMENT_QUOTAS[CURRENT_ABONNEMENT];
  const quota = abonnement.quota;
  const isQuotaAtteint = products.length >= quota;
  const isQuotaProche = products.length >= quota * 0.9;

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

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
    }, 1800);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => moderateImage(file, reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.price)
      return toast.error("Le nom et le prix sont obligatoires");
    if (!editProduct && products.length >= quota) {
      return toast.error(
        `Quota atteint — Votre abonnement ${abonnement.label} est limité à ${quota} produits. Passez à l'offre supérieure depuis les Paramètres.`,
        { duration: 6000, icon: "🔒" }
      );
    }

    const newStock = parseInt(form.stock) || 0;
    const formattedProduct = {
      ...form,
      price: parseFloat(form.price),
      stock: newStock,
      variantes: form.variantes || [],
      images: form.images || [],
      historiqueStock: form.historiqueStock || [],
    };

    if (editProduct) {
      const oldStock = editProduct.stock || 0;
      if (oldStock !== newStock) {
        const mouvement = {
          date: today,
          heure: nowStr(),
          acteur: "Manager",
          action: "Mise à jour manuelle",
          avant: oldStock,
          apres: newStock,
          motif: "Modification fiche produit",
        };
        formattedProduct.historiqueStock = [
          ...(editProduct.historiqueStock || []),
          mouvement,
        ];
      }
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

      const slotsRestants = quota - products.length;
      const produitsFiltres = newItems.slice(0, Math.max(0, slotsRestants));
      if (produitsFiltres.length === 0) {
        toast.error(
          `Quota atteint — Aucun produit importé. Passez à l'offre supérieure.`,
          { duration: 5000, icon: "🔒" }
        );
        return;
      }
      if (produitsFiltres.length < newItems.length) {
        toast.error(
          `Quota partiel — ${
            newItems.length - produitsFiltres.length
          } produit(s) ignoré(s) : quota ${abonnement.label} atteint.`,
          { duration: 5000 }
        );
      }
      setProducts((prev) => [...produitsFiltres, ...prev]);
      toast.success(
        `${produitsFiltres.length} produits importés. Pensez à ajouter les photos !`
      );
    };
    reader.readAsText(file);
  };

  const addVariante = (productId) => {
    if (!newVariante.taille) return toast.error("La taille est requise");
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? {
              ...p,
              variantes: [
                ...(p.variantes || []),
                { ...newVariante, stock: parseInt(newVariante.stock) || 0 },
              ],
            }
          : p
      )
    );
    setNewVariante({ taille: "", couleur: "", stock: "" });
    toast.success("Variante ajoutée");
  };

  const removeVariante = (productId, idx) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? { ...p, variantes: p.variantes.filter((_, i) => i !== idx) }
          : p
      )
    );
  };

  const updateStockManuel = (productId, newStock) => {
    const p = products.find((p) => p._id === productId);
    if (!p) return;
    const avant = p.stock;
    const apres = parseInt(newStock) || 0;
    const mouvement = {
      date: today,
      heure: nowStr(),
      acteur: "Manager",
      action: "Mise à jour manuelle",
      avant,
      apres,
      motif: "Correction stock",
    };
    setProducts((prev) =>
      prev.map((pr) =>
        pr._id === productId
          ? {
              ...pr,
              stock: apres,
              historiqueStock: [...(pr.historiqueStock || []), mouvement],
            }
          : pr
      )
    );
    setStockEdit((prev) => ({ ...prev, [productId]: undefined }));
    toast.success(`Stock mis à jour : ${avant} → ${apres}`);
  };

  const handleMultiPhotos = (e, productId) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === productId
              ? { ...p, images: [...(p.images || []), reader.result] }
              : p
          )
        );
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${files.length} photo(s) ajoutée(s)`);
  };

  const removePhoto = (productId, idx) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? { ...p, images: p.images.filter((_, i) => i !== idx) }
          : p
      )
    );
  };

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
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "11px", color: "var(--gray)" }}>
                  Quota abonnement {abonnement.label} :&nbsp;
                  <strong
                    style={{
                      color: isQuotaAtteint
                        ? "var(--error)"
                        : isQuotaProche
                        ? "var(--warning)"
                        : "var(--success)",
                    }}
                  >
                    {products.length}/{quota}
                  </strong>
                </span>
                {isQuotaAtteint && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "var(--error)",
                      background: "var(--error-bg)",
                      padding: "2px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    🔒 Quota atteint
                  </span>
                )}
                {isQuotaProche && !isQuotaAtteint && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "var(--warning)",
                      background: "var(--warning-bg)",
                      padding: "2px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    ⚠ Quota bientôt atteint
                  </span>
                )}
              </div>
              <div
                style={{
                  height: "4px",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (products.length / quota) * 100)}%`,
                    background: isQuotaAtteint
                      ? "var(--error)"
                      : isQuotaProche
                      ? "var(--warning)"
                      : "var(--success)",
                    borderRadius: "2px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              {isQuotaAtteint && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--error)",
                    marginTop: "6px",
                    lineHeight: 1.5,
                  }}
                >
                  Vous avez atteint la limite de votre offre {abonnement.label}.
                  Pour ajouter plus de produits, passez à l'offre Signature (100
                  produits) ou Prestige (300 produits) depuis les{" "}
                  <a
                    href="/parametres"
                    style={{ color: "var(--gold)", fontWeight: "600" }}
                  >
                    Paramètres
                  </a>
                  .
                </p>
              )}
            </div>
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

      {/* FILTRES */}
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

      {/* TABLEAU */}
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
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      className="btn-outline"
                      style={{ fontSize: "12px", padding: "7px 12px" }}
                      onClick={() => openEdit(product)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="btn-outline"
                      style={{ fontSize: "12px", padding: "7px 12px" }}
                      onClick={() => setShowVariantesModal(product._id)}
                    >
                      📐 Variantes
                    </button>
                    <button
                      className="btn-outline"
                      style={{ fontSize: "12px", padding: "7px 12px" }}
                      onClick={() => {
                        setHistoProduct(product);
                        setShowHistoModal(true);
                      }}
                    >
                      📋 Stock
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL AJOUT / ÉDITION */}
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
              {/* Zone image */}
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

      {/* MODAL VARIANTES & PHOTOS */}
      {showVariantesModal &&
        (() => {
          const product = products.find((p) => p._id === showVariantesModal);
          if (!product) return null;
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => setShowVariantesModal(null)}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "32px",
                  width: "100%",
                  maxWidth: "580px",
                  maxHeight: "88vh",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--gold)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      Gestion avancée
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "24px",
                        fontWeight: "400",
                      }}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowVariantesModal(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "var(--gray)",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Photos multiples */}
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--gray)",
                      marginBottom: "12px",
                    }}
                  >
                    Photos du produit{" "}
                    {product.images?.length > 0
                      ? `(${product.images.length})`
                      : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "10px",
                    }}
                  >
                    {(product.images || []).map((img, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt=""
                          style={{
                            width: "72px",
                            height: "72px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid rgba(0,0,0,0.08)",
                          }}
                        />
                        <button
                          onClick={() => removePhoto(product._id, idx)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "var(--error)",
                            border: "none",
                            color: "#fff",
                            fontSize: "10px",
                            cursor: "pointer",
                            fontWeight: "800",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✕
                        </button>
                        {idx === 0 && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "rgba(0,0,0,0.5)",
                              color: "#fff",
                              fontSize: "8px",
                              fontWeight: "700",
                              textAlign: "center",
                              borderRadius: "0 0 8px 8px",
                              padding: "2px",
                            }}
                          >
                            PRINCIPALE
                          </div>
                        )}
                      </div>
                    ))}
                    <label
                      style={{
                        width: "72px",
                        height: "72px",
                        border: "1.5px dashed rgba(0,0,0,0.15)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>+</span>
                      <span
                        style={{
                          fontSize: "9px",
                          color: "var(--gray)",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        Ajouter
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => handleMultiPhotos(e, product._id)}
                      />
                    </label>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--gray)",
                      padding: "8px 12px",
                      background: "rgba(0,0,0,0.03)",
                      borderRadius: "8px",
                    }}
                  >
                    💡 La première photo est l'image principale visible par le
                    client.
                  </div>
                </div>

                {/* Variantes */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--gray)",
                      marginBottom: "12px",
                    }}
                  >
                    Variantes ({(product.variantes || []).length})
                  </div>
                  {(product.variantes || []).length > 0 && (
                    <div
                      style={{
                        marginBottom: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {product.variantes.map((v, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            background: "#FAFAF8",
                            borderRadius: "8px",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <span
                              style={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              {v.taille}
                            </span>
                            {v.couleur && (
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "var(--gray)",
                                  marginLeft: "8px",
                                }}
                              >
                                · {v.couleur}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color:
                                  v.stock === 0
                                    ? "var(--error)"
                                    : "var(--success)",
                                fontWeight: "700",
                              }}
                            >
                              {v.stock === 0
                                ? "Rupture"
                                : `${v.stock} en stock`}
                            </span>
                            <button
                              onClick={() => removeVariante(product._id, idx)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--gray)",
                                fontSize: "14px",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "14px",
                      background: "rgba(201,169,110,0.04)",
                      borderRadius: "10px",
                      border: "1px dashed rgba(201,169,110,0.25)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "var(--gray)",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      Ajouter une variante
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 80px",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <input
                        className="input-field"
                        placeholder="Taille (S, M, L…)"
                        value={newVariante.taille}
                        onChange={(e) =>
                          setNewVariante({
                            ...newVariante,
                            taille: e.target.value,
                          })
                        }
                        style={{ marginBottom: 0, fontSize: "13px" }}
                      />
                      <input
                        className="input-field"
                        placeholder="Couleur (optionnel)"
                        value={newVariante.couleur}
                        onChange={(e) =>
                          setNewVariante({
                            ...newVariante,
                            couleur: e.target.value,
                          })
                        }
                        style={{ marginBottom: 0, fontSize: "13px" }}
                      />
                      <input
                        className="input-field"
                        type="number"
                        placeholder="Stock"
                        value={newVariante.stock}
                        onChange={(e) =>
                          setNewVariante({
                            ...newVariante,
                            stock: e.target.value,
                          })
                        }
                        style={{ marginBottom: 0, fontSize: "13px" }}
                      />
                    </div>
                    <button
                      className="btn-gold"
                      style={{ fontSize: "12px" }}
                      onClick={() => addVariante(product._id)}
                    >
                      + Ajouter cette variante
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* MODAL HISTORIQUE STOCK */}
      {showHistoModal &&
        histoProduct &&
        (() => {
          const product =
            products.find((p) => p._id === histoProduct._id) || histoProduct;
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => setShowHistoModal(false)}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "32px",
                  width: "100%",
                  maxWidth: "520px",
                  maxHeight: "88vh",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--gold)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      Historique
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        fontWeight: "400",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        marginTop: "2px",
                      }}
                    >
                      Stock actuel :{" "}
                      <strong style={{ color: "var(--noir)" }}>
                        {product.stock} unités
                      </strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHistoModal(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "var(--gray)",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Mise à jour rapide */}
                <div
                  style={{
                    padding: "14px",
                    background: "rgba(201,169,110,0.06)",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        color: "var(--gray)",
                        marginBottom: "6px",
                      }}
                    >
                      Mise à jour rapide
                    </div>
                    <input
                      type="number"
                      className="input-field"
                      placeholder={`Stock actuel : ${product.stock}`}
                      value={stockEdit[product._id] ?? ""}
                      onChange={(e) =>
                        setStockEdit((prev) => ({
                          ...prev,
                          [product._id]: e.target.value,
                        }))
                      }
                      style={{ marginBottom: 0, fontSize: "13px" }}
                    />
                  </div>
                  <button
                    className="btn-gold"
                    style={{
                      fontSize: "12px",
                      flexShrink: 0,
                      marginTop: "16px",
                    }}
                    onClick={() =>
                      updateStockManuel(product._id, stockEdit[product._id])
                    }
                  >
                    Mettre à jour
                  </button>
                </div>

                {/* Historique mouvements */}
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--gray)",
                      marginBottom: "12px",
                    }}
                  >
                    Mouvements de stock (
                    {(product.historiqueStock || []).length})
                  </div>
                  {(product.historiqueStock || []).length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "32px",
                        color: "var(--gray)",
                        fontSize: "13px",
                      }}
                    >
                      Aucun mouvement enregistré
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0",
                      }}
                    >
                      {[...(product.historiqueStock || [])]
                        .reverse()
                        .map((h, i) => {
                          const diff = h.apres - h.avant;
                          return (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "flex-start",
                                padding: "12px 0",
                                borderBottom: "1px solid rgba(0,0,0,0.05)",
                              }}
                            >
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "8px",
                                  background:
                                    diff > 0
                                      ? "var(--success-bg)"
                                      : diff < 0
                                      ? "var(--error-bg)"
                                      : "rgba(0,0,0,0.04)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  flexShrink: 0,
                                }}
                              >
                                {diff > 0 ? "↑" : diff < 0 ? "↓" : "="}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {h.action}
                                    </span>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "var(--gray)",
                                        marginTop: "2px",
                                      }}
                                    >
                                      par {h.acteur} · {h.motif}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      textAlign: "right",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        color:
                                          diff > 0
                                            ? "var(--success)"
                                            : diff < 0
                                            ? "var(--error)"
                                            : "var(--gray)",
                                      }}
                                    >
                                      {diff > 0 ? `+${diff}` : diff}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "10px",
                                        color: "var(--gray)",
                                      }}
                                    >
                                      {h.avant} → {h.apres}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "var(--gray-light)",
                                    marginTop: "2px",
                                  }}
                                >
                                  {h.heure} · {h.date}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
