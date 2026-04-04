import React, { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_CATS = [
  { id: 1, name: "Vêtements", count: 45, icon: "👕", active: true },
  { id: 2, name: "Accessoires", count: 12, icon: "👜", active: true },
  { id: 3, name: "Chaussures", count: 8, icon: "👠", active: true },
  { id: 4, name: "Épicerie Fine", count: 15, icon: "🍯", active: true },
  { id: 5, name: "Archives / Soldes", count: 22, icon: "🏷️", active: false },
];

export default function Categories() {
  const [categories, setCategories] = useState(INITIAL_CATS);
  const [showAdd, setShowAdd] = useState(false);

  const toggleCat = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast.success("Statut de la catégorie mis à jour");
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
            Structure du Catalogue
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Organisez vos produits par univers pour faciliter la navigation
            client
          </p>
        </div>
        <button className="btn-gold" onClick={() => setShowAdd(true)}>
          + Nouvelle Catégorie
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: cat.active ? 1 : 0.6,
              borderLeft: cat.active
                ? "4px solid var(--gold)"
                : "4px solid var(--gray)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  fontSize: "24px",
                  background: "#f9f9f9",
                  padding: "10px",
                  borderRadius: "12px",
                }}
              >
                {cat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                  {cat.name}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                  {cat.count} articles
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleCat(cat.id)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background: cat.active ? "var(--success)" : "var(--gray-light)",
                position: "relative",
                transition: "0.3s",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "3px",
                  transition: "0.3s",
                  left: cat.active ? "19px" : "3px",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* ZONE D'INFO CDC */}
      <div
        className="card"
        style={{ marginTop: "40px", background: "var(--noir)", color: "#fff" }}
      >
        <h4 style={{ color: "var(--gold)", marginBottom: "10px" }}>
          💡 Conseil Merchandising
        </h4>
        <p style={{ fontSize: "13px", opacity: 0.8, lineHeight: "1.6" }}>
          L'arborescence de votre boutique est automatiquement synchronisée avec
          le <strong>QR Code</strong> en magasin. Une bonne catégorisation
          permet aux clients de trouver leurs articles 30% plus rapidement sur
          l'application mobile.
        </p>
      </div>
    </div>
  );
}
