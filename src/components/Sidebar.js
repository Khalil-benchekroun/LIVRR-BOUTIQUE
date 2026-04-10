import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  const { logout } = useAuth();
  const location = useLocation();
  const storeName = "Sandro Paris";

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    {
      id: 1,
      icon: "📦",
      text: "Nouvelle commande #LV-00249 — Sophie M.",
      time: "Il y a 2 min",
      read: false,
    },
    {
      id: 2,
      icon: "⚠️",
      text: "Stock faible : Robe Midi Fleurie (2 restants)",
      time: "Il y a 15 min",
      read: false,
    },
    {
      id: 3,
      icon: "💳",
      text: "Versement de 1 284 € effectué sur votre compte",
      time: "Il y a 1h",
      read: false,
    },
    {
      id: 4,
      icon: "↩️",
      text: "Demande de retour — Commande #LV-00220",
      time: "Il y a 2h",
      read: true,
    },
    {
      id: 5,
      icon: "⏳",
      text: "Fonds disponibles : 712 € après délai PSP",
      time: "Il y a 3h",
      read: true,
    },
  ]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const getActiveGroup = () => {
    for (const g of menuGroups) {
      if (
        g.subItems.some(
          (s) =>
            s.path === location.pathname ||
            (s.path !== "/" && location.pathname.startsWith(s.path))
        )
      ) {
        return g.id;
      }
    }
    return "dashboard";
  };

  const [openSub, setOpenSub] = useState(getActiveGroup);
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
        @keyframes menuItemIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes subMenuOpen {
          from { opacity: 0; transform: translateY(-6px); max-height: 0; }
          to   { opacity: 1; transform: translateY(0);  max-height: 300px; }
        }
        .sidebar-group-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          user-select: none;
          position: relative;
        }
        .sidebar-group-btn:hover { background: rgba(255,255,255,0.05) !important; }
        .sidebar-group-btn.open {
          background: rgba(201,169,110,0.08) !important;
          color: var(--gold) !important;
        }
        .sub-link {
          padding: 8px 14px;
          font-size: 13px;
          text-decoration: none;
          border-radius: 8px;
          color: rgba(255,255,255,0.38);
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          position: relative; overflow: hidden;
        }
        .sub-link::before {
          content: '';
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 2px; height: 0;
          background: var(--gold);
          border-radius: 1px;
          transition: height 0.2s ease;
        }
        .sub-link:hover {
          color: rgba(255,255,255,0.85) !important;
          background: rgba(255,255,255,0.06) !important;
          padding-left: 18px !important;
        }
        .sub-link:hover::before { height: 60%; }
        .sub-active {
          color: var(--gold) !important;
          background: rgba(201,169,110,0.12) !important;
          font-weight: 600 !important;
          padding-left: 18px !important;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sub-active::before { height: 60% !important; }
        .logout-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.35);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--font-body);
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          text-transform: uppercase;
        }
        .logout-btn:hover {
          color: var(--error) !important;
          background: rgba(192,57,43,0.08) !important;
        }
        .nav-scroll::-webkit-scrollbar { width: 0; }
        .notif-item:hover { background: rgba(201,169,110,0.03) !important; }
      `}</style>

      <div
        style={{
          width: "260px",
          height: "100vh",
          background: "linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 100%)",
          color: "#fff",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          borderRight: "1px solid rgba(201,169,110,0.08)",
          animation: mounted ? "sidebarIn 0.5s ease forwards" : "none",
          boxShadow: "4px 0 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* ── LOGO ── */}
        <div
          style={{
            padding: "32px 24px 20px",
            textAlign: "center",
            borderBottom: "1px solid rgba(201,169,110,0.08)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
              fontSize: "30px",
              letterSpacing: "5px",
              fontWeight: "400",
              margin: 0,
              textShadow: "0 0 30px rgba(201,169,110,0.3)",
            }}
          >
            LIVRR
          </h1>
          <div
            style={{
              fontSize: "8px",
              color: "rgba(201,169,110,0.5)",
              letterSpacing: "3px",
              marginTop: "5px",
              textTransform: "uppercase",
            }}
          >
            Espace Boutique
          </div>
        </div>

        {/* ── BOUTIQUE INFO ── */}
        <div
          style={{
            padding: "18px 20px",
            margin: "12px 16px",
            borderRadius: "14px",
            background: "rgba(201,169,110,0.06)",
            border: "1px solid rgba(201,169,110,0.12)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background:
                "linear-gradient(135deg, var(--gold), var(--gold-dark))",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--noir)",
              fontWeight: "800",
              fontSize: "17px",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(201,169,110,0.3)",
            }}
          >
            {storeName.charAt(0)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
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
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--gold)",
                fontWeight: "500",
                opacity: 0.9,
                letterSpacing: "0.5px",
              }}
            >
              Boutique Élite ✦
            </div>
          </div>
        </div>

        {/* ── CLOCHE NOTIFICATIONS ── */}
        <div
          style={{
            padding: "0 16px",
            marginBottom: "8px",
            position: "relative",
          }}
        >
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              background: showNotifs
                ? "rgba(201,169,110,0.12)"
                : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(201,169,110,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔔</span>
            <span
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: "12px",
                color: "rgba(255,255,255,0.75)",
                fontWeight: "600",
              }}
            >
              Notifications
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "var(--error)",
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "2px 7px",
                  fontSize: "10px",
                  fontWeight: "800",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Panneau notifications */}
          {showNotifs && (
            <div
              style={{
                position: "fixed",
                left: "268px",
                top: "160px",
                width: "340px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                zIndex: 999,
                border: "1px solid rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid rgba(0,0,0,0.07)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    color: "var(--noir)",
                  }}
                >
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      fontSize: "12px",
                      color: "var(--gold)",
                      fontWeight: "600",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className="notif-item"
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: "12px 18px",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      background: n.read ? "#fff" : "rgba(201,169,110,0.04)",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {n.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: n.read ? "400" : "600",
                          color: "var(--noir)",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.text}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--gray)",
                          marginTop: "3px",
                        }}
                      >
                        {n.time}
                      </div>
                    </div>
                    {!n.read && (
                      <div
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "var(--gold)",
                          flexShrink: 0,
                          marginTop: "5px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: "10px 18px",
                  borderTop: "1px solid rgba(0,0,0,0.07)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gold)",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Voir toutes les notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── NAVIGATION ── */}
        <nav
          className="nav-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}
        >
          {menuGroups.map((group, gi) => (
            <div
              key={group.id}
              style={{
                marginBottom: "4px",
                animation: mounted
                  ? `menuItemIn 0.4s ${0.1 + gi * 0.05}s ease both`
                  : "none",
                opacity: mounted ? 1 : 0,
              }}
            >
              <div
                onClick={() => setOpenSub(openSub === group.id ? "" : group.id)}
                className={`sidebar-group-btn ${
                  openSub === group.id ? "open" : ""
                }`}
                style={{
                  color:
                    openSub === group.id
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.5)",
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>
                  {group.icon}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    letterSpacing: "0.06em",
                    flex: 1,
                  }}
                >
                  {group.label}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    opacity: 0.5,
                    transition: "transform 0.3s ease",
                    transform:
                      openSub === group.id ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  ›
                </span>
              </div>

              {openSub === group.id && (
                <div
                  style={{
                    marginLeft: "16px",
                    marginTop: "3px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    animation: "subMenuOpen 0.3s ease forwards",
                    paddingLeft: "10px",
                    borderLeft: "1px solid rgba(201,169,110,0.15)",
                  }}
                >
                  {group.subItems.map((sub, idx) => (
                    <NavLink
                      key={sub.path + idx}
                      to={sub.path}
                      className={({ isActive }) =>
                        isActive ? "sub-active" : "sub-link"
                      }
                    >
                      <span>{sub.label}</span>
                      {sub.badge && (
                        <span
                          style={{
                            background: "var(--gold)",
                            color: "var(--noir)",
                            borderRadius: "20px",
                            padding: "1px 6px",
                            fontSize: "9px",
                            fontWeight: "800",
                            flexShrink: 0,
                          }}
                        >
                          {sub.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── DÉCONNEXION ── */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button className="logout-btn" onClick={handleLogout}>
            <span style={{ fontSize: "8px" }}>●</span>
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}
