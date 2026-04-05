import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const storeName = "Sandro Paris";
  const [openSub, setOpenSub] = useState("dashboard");

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const menuGroups = [
    {
      id: "dashboard",
      label: "DATA VISUALISATION",
      icon: "📊",
      subItems: [
        { path: "/", label: "Vue d'ensemble" },
        { path: "/statistiques", label: "Statistiques & Rapports" },
      ],
    },
    {
      id: "orders",
      label: "COMMANDES",
      icon: "📦",
      subItems: [
        { path: "/commandes", label: "Toutes les commandes" },
        { path: "/commandes-pos", label: "Commande Manuelle" },
        { path: "/retours", label: "Gestion des retours" },
      ],
    },
    {
      id: "catalog",
      label: "QR CODE & ACCÈS",
      icon: "🏷️",
      subItems: [
        { path: "/qrcode", label: "QR Code boutique" },
        { path: "/produits", label: "Produits de la boutique" },
        { path: "/categories", label: "Catégories" },
      ],
    },
    {
      id: "vendeurs",
      label: "GESTION VENDEURS",
      icon: "👥",
      subItems: [{ path: "/vendeurs", label: "Liste des vendeurs" }],
    },
    {
      id: "clients",
      label: "GESTION CLIENTS",
      icon: "👤",
      subItems: [{ path: "/clients", label: "Liste des clients" }],
    },
    {
      id: "marketing",
      label: "PROMOTION",
      icon: "🎟️",
      subItems: [{ path: "/marketing", label: "Coupons de réduction" }],
    },
    {
      id: "services",
      label: "SERVICES ANNEXES",
      icon: "✨",
      subItems: [
        { path: "/services", label: "Catalogue des services" },
        { path: "/services", label: "Réservations" },
      ],
    },
    {
      id: "settings",
      label: "PARAMÈTRES",
      icon: "⚙️",
      subItems: [{ path: "/parametres", label: "Configuration Boutique" }],
    },
  ];

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "var(--sidebar)",
        color: "#fff",
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      <div style={{ padding: "30px 24px 10px 24px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--gold)",
            fontSize: "28px",
            letterSpacing: "2px",
            margin: 0,
          }}
        >
          LIVRR
        </h1>
        <div
          style={{
            fontSize: "9px",
            color: "var(--gray-light)",
            letterSpacing: "1px",
            marginTop: "4px",
          }}
        >
          ESPACE BOUTIQUE
        </div>
      </div>
      <div
        style={{
          padding: "20px 24px",
          marginBottom: "15px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            background: "var(--gold)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--noir)",
            fontWeight: "800",
            fontSize: "16px",
          }}
        >
          {storeName.charAt(0)}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {storeName}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "var(--gold)",
              fontWeight: "600",
              opacity: 0.8,
            }}
          >
            Boutique Élite
          </span>
        </div>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
        {menuGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: "8px" }}>
            <div
              onClick={() => setOpenSub(openSub === group.id ? "" : group.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "0.2s",
                background:
                  openSub === group.id
                    ? "rgba(255,255,255,0.03)"
                    : "transparent",
                color:
                  openSub === group.id
                    ? "var(--gold)"
                    : "rgba(255,255,255,0.6)",
              }}
            >
              <span style={{ fontSize: "18px" }}>{group.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: "600" }}>
                {group.label}
              </span>
              <span
                style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.5 }}
              >
                {openSub === group.id ? "▼" : "▶"}
              </span>
            </div>
            {openSub === group.id && (
              <div
                style={{
                  marginLeft: "32px",
                  marginTop: "4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                {group.subItems.map((sub, idx) => (
                  <NavLink
                    key={sub.path + idx}
                    to={sub.path}
                    className={({ isActive }) =>
                      isActive ? "sub-active" : "sub-link"
                    }
                    style={{
                      padding: "8px 12px",
                      fontSize: "13px",
                      textDecoration: "none",
                      borderRadius: "6px",
                      color: "rgba(255,255,255,0.4)",
                      transition: "0.2s",
                      display: "block",
                    }}
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            color: "var(--error)",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            background: "none",
            border: "none",
          }}
        >
          ● DÉCONNEXION
        </button>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `.sub-link:hover { color: #fff !important; background: rgba(255,255,255,0.05); } .sub-active { color: var(--gold) !important; background: rgba(201, 169, 110, 0.1) !important; font-weight: 600; border-right: 2px solid var(--gold); }`,
        }}
      />
    </div>
  );
}
