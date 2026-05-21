import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LivrrLogo } from "./LuxeAnimations";
import { useAuth } from "../context/AuthContext";

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
    id: "livraisons",
    label: "LIVRAISONS",
    icon: "🛵",
    subItems: [{ path: "/livraisons", label: "Suivi en temps réel" }],
  },
  {
    id: "avis",
    label: "AVIS & RÉPUTATION",
    icon: "⭐",
    subItems: [{ path: "/avis", label: "Avis clients", badge: 2 }],
  },
  {
    id: "calendrier",
    label: "DISPONIBILITÉS",
    icon: "📅",
    subItems: [{ path: "/calendrier", label: "Calendrier" }],
  },
  {
    id: "messages",
    label: "MESSAGES & SUPPORT",
    icon: "💬",
    subItems: [
      { path: "/messages", label: "Messages clients", badge: 1 },
      { path: "/support", label: "Support LIVRR" },
    ],
  },
  {
    id: "finance",
    label: "FINANCE",
    icon: "💰",
    subItems: [{ path: "/finance", label: "Reporting & Documents" }],
  },
  {
    id: "settings",
    label: "PARAMÈTRES",
    icon: "⚙️",
    subItems: [{ path: "/parametres", label: "Configuration Boutique" }],
  },
];

export default function Sidebar() {
  const { logout, boutique } = useAuth();
  const location = useLocation();
  const storeName = boutique?.name || "Ma Boutique";
  const storeLetter = boutique?.logoText || boutique?.name?.charAt(0) || "B";
  const storeCouleur = boutique?.couleur || "#C9A96E";

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, type: "order", icon: "📦", text: "Nouvelle commande #LV-00249 — Sophie M.", time: "Il y a 2 min", read: false },
    { id: 2, type: "stock", icon: "⚠️", text: "Stock faible : Robe Midi Fleurie (2 restants)", time: "Il y a 15 min", read: false },
    { id: 3, type: "payment", icon: "💳", text: "Versement de 1 284 € effectué sur votre compte", time: "Il y a 1h", read: false },
    { id: 4, type: "return", icon: "↩️", text: "Demande de retour — Commande #LV-00220", time: "Il y a 2h", read: true },
    { id: 5, type: "psp", icon: "⏳", text: "Fonds disponibles : 712 € après délai PSP", time: "Il y a 3h", read: true },
  ]);
  const unreadCount = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        @keyframes sidebarIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .nav-scroll::-webkit-scrollbar { width: 0; }

        /* ── Titre de section ── */
        .group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 10px 4px 10px;
          margin-top: 6px;
          user-select: none;
          pointer-events: none;
        }
        .group-header-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .group-header-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          white-space: nowrap;
        }

        /* ── Sous-items ── */
        .sub-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 10px 8px 32px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          border-radius: 7px;
          color: rgba(255,255,255,0.7);
          transition: all 0.15s ease;
          border-left: 2px solid transparent;
          margin: 1px 0;
          line-height: 1.3;
        }
        .sub-link:hover {
          color: #ffffff !important;
          background: rgba(255,255,255,0.08) !important;
          padding-left: 36px !important;
        }
        .sub-active {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 10px 8px 32px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 7px;
          color: #C9A96E !important;
          background: rgba(201,169,110,0.12) !important;
          border-left: 2px solid #C9A96E !important;
          margin: 1px 0;
          line-height: 1.3;
        }

        .logout-btn {
          width: 100%;
          padding: 11px;
          border-radius: 9px;
          color: rgba(255,255,255,0.35);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--font-body);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
        }
        .logout-btn:hover {
          color: #e05555 !important;
          background: rgba(192,57,43,0.08) !important;
        }
      `}</style>

      <div style={{
        width: "260px",
        height: "100vh",
        background: "linear-gradient(180deg, #111118 0%, #0D0D14 100%)",
        color: "#fff",
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        borderRight: "1px solid rgba(201,169,110,0.1)",
        animation: mounted ? "sidebarIn 0.5s ease forwards" : "none",
        boxShadow: "4px 0 40px rgba(0,0,0,0.4)",
      }}>

        {/* ── LOGO ── */}
        <div style={{ padding: "28px 24px 18px", textAlign: "center", borderBottom: "1px solid rgba(201,169,110,0.08)", position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          <LivrrLogo style={{ fontSize: "28px", letterSpacing: "6px" }} />
          <div style={{ fontSize: "8px", color: "rgba(201,169,110,0.55)", letterSpacing: "3px", marginTop: "5px", textTransform: "uppercase" }}>
            Espace Boutique
          </div>
        </div>

        {/* ── BOUTIQUE INFO ── */}
        <div style={{ padding: "14px 16px", margin: "10px 14px", borderRadius: "12px", background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.15)", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div style={{ width: "38px", height: "38px", background: `linear-gradient(135deg, ${storeCouleur}, ${storeCouleur}99)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "15px", flexShrink: 0, boxShadow: `0 4px 12px ${storeCouleur}44` }}>
            {storeLetter}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {storeName}
            </div>
            <div style={{ fontSize: "10px", color: "#C9A96E", fontWeight: "500", letterSpacing: "0.5px" }}>
              Boutique Élite ✦
            </div>
          </div>
        </div>

        {/* ── NOTIFICATIONS ── */}
        <div style={{ padding: "0 14px", marginBottom: "6px", position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ width: "100%", padding: "9px 14px", borderRadius: "10px", background: showNotifs ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.12)", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-body)" }}>
            <span style={{ fontSize: "15px" }}>🔔</span>
            <span style={{ flex: 1, textAlign: "left", fontSize: "12px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ background: "#e05555", color: "#fff", borderRadius: "20px", padding: "2px 7px", fontSize: "10px", fontWeight: "800" }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position: "fixed", left: "268px", top: "80px", width: "340px", background: "#fff", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", zIndex: 999, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#111" }}>Notifications</div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: "12px", color: "#C9A96E", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                    Tout marquer lu
                  </button>
                )}
              </div>
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                {notifs.map((n) => (
                  <div key={n.id} onClick={() => markRead(n.id)}
                    style={{ padding: "12px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", gap: "12px", alignItems: "flex-start", background: n.read ? "#fff" : "rgba(201,169,110,0.04)", cursor: "pointer" }}>
                    <span style={{ fontSize: "17px", flexShrink: 0, marginTop: "1px" }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: n.read ? "400" : "600", color: "#111", lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>{n.time}</div>
                    </div>
                    {!n.read && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#C9A96E", flexShrink: 0, marginTop: "5px" }} />}
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 18px", borderTop: "1px solid rgba(0,0,0,0.07)", textAlign: "center" }}>
                <span style={{ fontSize: "12px", color: "#C9A96E", fontWeight: "600", cursor: "pointer" }}>Voir toutes les notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* ── NAVIGATION — tout toujours visible, pas d'accordion ── */}
        <nav className="nav-scroll" style={{ flex: 1, overflowY: "auto", padding: "4px 10px 8px 10px" }}>
          {menuGroups.map((group) => (
            <div key={group.id}>
              {/* Titre de section — séparateur visuel, non cliquable */}
              <div className="group-header">
                <span style={{ fontSize: "13px", lineHeight: 1 }}>{group.icon}</span>
                <span className="group-header-label">{group.label}</span>
                <div className="group-header-line" />
              </div>

              {/* Sous-items — toujours visibles */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {group.subItems.map((sub, idx) => (
                  <NavLink
                    key={sub.path + idx}
                    to={sub.path}
                    className={({ isActive }) => isActive ? "sub-active" : "sub-link"}
                  >
                    <span>{sub.label}</span>
                    {sub.badge && (
                      <span style={{ background: "#C9A96E", color: "#0A0A0F", borderRadius: "20px", padding: "1px 6px", fontSize: "9px", fontWeight: "800", flexShrink: 0 }}>
                        {sub.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── DÉCONNEXION ── */}
        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <button className="logout-btn" onClick={handleLogout}>
            <span style={{ fontSize: "8px", opacity: 0.6 }}>●</span>
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}