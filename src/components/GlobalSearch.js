import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================
   LIVRR — Recherche Globale + Raccourcis Clavier
   Ctrl+K  → ouvre la recherche
   ?       → ouvre le panneau raccourcis
   Usage : <GlobalSearch /> dans AppLayout, après <Sidebar />
   ============================================================ */

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], label: "Recherche globale" },
  { keys: ["?"], label: "Afficher les raccourcis" },
  { keys: ["Esc"], label: "Fermer / Annuler" },
  { keys: ["D"], label: "Dashboard" },
  { keys: ["C"], label: "Commandes" },
  { keys: ["P"], label: "Produits" },
  { keys: ["M"], label: "Messages" },
  { keys: ["S"], label: "Statistiques" },
  { keys: ["F"], label: "Finance" },
  { keys: ["N"], label: "Nouvelle vente (POS)" },
];

const NAV_SHORTCUTS = {
  d: "/",
  c: "/commandes",
  p: "/produits",
  m: "/messages",
  s: "/statistiques",
  f: "/finance",
  n: "/commandes-pos",
};

// Données mockées pour la recherche
const SEARCH_DATA = {
  commandes: [
    {
      id: "ORD-8821",
      label: "Sarah B. — Robe Midi Fleurie",
      sub: "490 € · En préparation",
      path: "/commandes",
      icon: "📦",
    },
    {
      id: "ORD-8815",
      label: "Karim T. — Trench Camel",
      sub: "1 079 € · Prête",
      path: "/commandes",
      icon: "📦",
    },
    {
      id: "ORD-8790",
      label: "Yasmine M. — Blazer Structuré",
      sub: "295 € · Livrée",
      path: "/commandes",
      icon: "📦",
    },
    {
      id: "ORD-8770",
      label: "Mehdi S. — Parfum Oud",
      sub: "680 € · Livrée",
      path: "/commandes",
      icon: "📦",
    },
  ],
  produits: [
    {
      id: "p1",
      label: "Robe Midi Fleurie",
      sub: "490 € · 22 en stock · Vêtements",
      path: "/produits",
      icon: "🛍️",
    },
    {
      id: "p2",
      label: "Trench Camel",
      sub: "890 € · 8 en stock · Vêtements",
      path: "/produits",
      icon: "🛍️",
    },
    {
      id: "p3",
      label: "Parfum Oud 50ml",
      sub: "280 € · 15 en stock · Beauté",
      path: "/produits",
      icon: "🛍️",
    },
    {
      id: "p4",
      label: "Sérum Éclat Visage",
      sub: "195 € · 12 en stock · Beauté",
      path: "/produits",
      icon: "🛍️",
    },
    {
      id: "p5",
      label: "Blazer Structuré",
      sub: "295 € · 5 en stock · Vêtements",
      path: "/produits",
      icon: "🛍️",
    },
  ],
  clients: [
    {
      id: "c1",
      label: "Sarah B.",
      sub: "sarah@email.fr · 3 commandes",
      path: "/clients",
      icon: "👤",
    },
    {
      id: "c2",
      label: "Karim T.",
      sub: "karim@email.fr · 2 commandes",
      path: "/clients",
      icon: "👤",
    },
    {
      id: "c3",
      label: "Yasmine M.",
      sub: "yasmine@email.fr · 1 commande",
      path: "/clients",
      icon: "👤",
    },
  ],
  pages: [
    {
      id: "dashboard",
      label: "Dashboard",
      sub: "Vue d'ensemble",
      path: "/",
      icon: "📊",
    },
    {
      id: "commandes",
      label: "Commandes",
      sub: "Gérer les commandes",
      path: "/commandes",
      icon: "📦",
    },
    {
      id: "produits",
      label: "Produits",
      sub: "Catalogue",
      path: "/produits",
      icon: "🛍️",
    },
    {
      id: "clients",
      label: "Clients",
      sub: "Base clients",
      path: "/clients",
      icon: "👤",
    },
    {
      id: "messages",
      label: "Messages",
      sub: "Chat clients",
      path: "/messages",
      icon: "💬",
    },
    {
      id: "stats",
      label: "Statistiques",
      sub: "Performances",
      path: "/statistiques",
      icon: "📈",
    },
    {
      id: "finance",
      label: "Finance",
      sub: "CA & documents",
      path: "/finance",
      icon: "💰",
    },
    {
      id: "livraisons",
      label: "Livraisons",
      sub: "Suivi coursiers",
      path: "/livraisons",
      icon: "🛵",
    },
    {
      id: "avis",
      label: "Avis",
      sub: "Réputation boutique",
      path: "/avis",
      icon: "⭐",
    },
    {
      id: "calendrier",
      label: "Calendrier",
      sub: "Disponibilités",
      path: "/calendrier",
      icon: "📅",
    },
    {
      id: "marketing",
      label: "Marketing",
      sub: "Coupons & promos",
      path: "/marketing",
      icon: "🎟️",
    },
    {
      id: "parametres",
      label: "Paramètres",
      sub: "Configuration boutique",
      path: "/parametres",
      icon: "⚙️",
    },
  ],
};

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "rgba(201,169,110,0.25)",
          color: "var(--noir)",
          borderRadius: "2px",
          padding: "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlobalSearch() {
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Résultats filtrés
  const results =
    query.trim().length < 1
      ? []
      : (() => {
          const q = query.toLowerCase();
          const all = [
            ...SEARCH_DATA.pages
              .filter(
                (p) =>
                  p.label.toLowerCase().includes(q) ||
                  p.sub.toLowerCase().includes(q)
              )
              .map((r) => ({ ...r, cat: "Page" })),
            ...SEARCH_DATA.commandes
              .filter(
                (r) =>
                  r.label.toLowerCase().includes(q) ||
                  r.id.toLowerCase().includes(q)
              )
              .map((r) => ({ ...r, cat: "Commande" })),
            ...SEARCH_DATA.produits
              .filter((r) => r.label.toLowerCase().includes(q))
              .map((r) => ({ ...r, cat: "Produit" })),
            ...SEARCH_DATA.clients
              .filter((r) => r.label.toLowerCase().includes(q))
              .map((r) => ({ ...r, cat: "Client" })),
          ];
          return all.slice(0, 8);
        })();

  // Quick links (sans recherche)
  const quickLinks = [...SEARCH_DATA.pages.slice(0, 6)];

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      // Ctrl+K ou Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((s) => {
          if (!s) setQuery("");
          return !s;
        });
        setShowShortcuts(false);
      }
      // ? pour raccourcis
      if (
        e.key === "?" &&
        !showSearch &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA"
      ) {
        setShowShortcuts((s) => !s);
      }
      // Esc
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowShortcuts(false);
      }
      // Navigation clavier dans search
      if (showSearch) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIdx((i) =>
            Math.min(i + 1, (results.length || quickLinks.length) - 1)
          );
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIdx((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter") {
          const list = results.length ? results : quickLinks;
          if (list[activeIdx]) {
            navigate(list[activeIdx].path);
            setShowSearch(false);
            setQuery("");
          }
        }
      }
      // Raccourcis nav (hors inputs)
      if (
        !showSearch &&
        !showShortcuts &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "SELECT"
      ) {
        const path = NAV_SHORTCUTS[e.key.toLowerCase()];
        if (path) navigate(path);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showSearch, showShortcuts, results, quickLinks, activeIdx, navigate]);

  useEffect(() => {
    if (showSearch) setTimeout(() => inputRef.current?.focus(), 50);
  }, [showSearch]);

  const goTo = (path) => {
    navigate(path);
    setShowSearch(false);
    setQuery("");
  };

  const displayList = results.length ? results : quickLinks;

  return (
    <>
      {/* ── MODAL RECHERCHE ── */}
      {showSearch && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "80px",
          }}
          onClick={() => setShowSearch(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "580px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une commande, un produit, un client..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  fontFamily: "var(--font-body)",
                  color: "var(--noir)",
                  background: "transparent",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--gray)",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              )}
              <kbd
                style={{
                  padding: "3px 8px",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "var(--gray)",
                  flexShrink: 0,
                }}
              >
                Esc
              </kbd>
            </div>

            {/* Résultats */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {!query && (
                <div
                  style={{
                    padding: "10px 20px 6px",
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--gray)",
                  }}
                >
                  Navigation rapide
                </div>
              )}
              {query && results.length === 0 && (
                <div
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "var(--gray)",
                    fontSize: "14px",
                  }}
                >
                  Aucun résultat pour « {query} »
                </div>
              )}
              {displayList.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => goTo(item.path)}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    padding: "12px 20px",
                    cursor: "pointer",
                    transition: "background 0.1s",
                    background:
                      i === activeIdx
                        ? "rgba(201,169,110,0.07)"
                        : "transparent",
                    borderLeft:
                      i === activeIdx
                        ? "2px solid var(--gold)"
                        : "2px solid transparent",
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      {highlight(item.label, query)}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                  {item.cat && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "var(--gray)",
                        background: "rgba(0,0,0,0.05)",
                        padding: "3px 8px",
                        borderRadius: "20px",
                        flexShrink: 0,
                      }}
                    >
                      {item.cat}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--gray)",
                      flexShrink: 0,
                    }}
                  >
                    ↵
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 20px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                gap: "16px",
                fontSize: "11px",
                color: "var(--gray)",
              }}
            >
              <span>↑↓ Naviguer</span>
              <span>↵ Ouvrir</span>
              <span>Esc Fermer</span>
            </div>
          </div>
        </div>
      )}

      {/* ── PANNEAU RACCOURCIS ── */}
      {showShortcuts && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowShortcuts(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "6px",
              }}
            >
              Raccourcis clavier
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "var(--gray)",
                marginBottom: "20px",
              }}
            >
              Disponibles hors champs de saisie
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {SHORTCUTS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background:
                      i % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "var(--noir)" }}>
                    {s.label}
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        style={{
                          padding: "3px 8px",
                          background: "rgba(0,0,0,0.07)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                          fontFamily: "monospace",
                          color: "var(--noir)",
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "20px",
                padding: "12px 14px",
                background: "rgba(201,169,110,0.06)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--gray)",
                textAlign: "center",
              }}
            >
              Appuyez sur{" "}
              <kbd
                style={{
                  padding: "2px 7px",
                  background: "rgba(0,0,0,0.07)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                Esc
              </kbd>{" "}
              pour fermer
            </div>
          </div>
        </div>
      )}

      {/* Bouton flottant ? */}
      <button
        onClick={() => setShowShortcuts(true)}
        title="Raccourcis clavier (?)"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "var(--noir)",
          color: "rgba(255,255,255,0.6)",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "700",
          fontFamily: "monospace",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          zIndex: 500,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--gold)";
          e.currentTarget.style.color = "var(--noir)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--noir)";
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        }}
      >
        ?
      </button>
    </>
  );
}
