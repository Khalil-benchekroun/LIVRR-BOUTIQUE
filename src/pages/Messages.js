import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const REPONSES_RAPIDES = [
  "Bonjour ! Je vous écoute, comment puis-je vous aider ?",
  "Ce produit est disponible en boutique, je vérifie le stock immédiatement.",
  "Votre commande est en cours de préparation, elle sera prête d'ici 15 minutes.",
  "La livraison est estimée entre 30 et 45 minutes à votre adresse.",
  "Ce modèle taille normalement — je vous conseille votre taille habituelle.",
  "Nous acceptons les retours sous 14 jours après livraison.",
  "Je suis désolé pour ce désagrément, je transmets votre demande à notre équipe.",
];

const CHATS = [
  {
    id: 1,
    customer: "Sarah B.",
    email: "sarah@email.fr",
    online: true,
    lastMsg: "Est-ce que la robe taille grand ?",
    time: "14:20",
    unread: 2,
    commandes: [
      {
        id: "ORD-8821",
        produit: "Robe Midi Fleurie",
        status: "En préparation",
        total: 490,
        date: "09/04/2026",
      },
    ],
    messages: [
      {
        id: 101,
        sender: "client",
        text: "Bonjour, j'ai une question sur la Robe Midi Fleurie.",
        time: "14:15",
      },
      {
        id: 102,
        sender: "boutique",
        text: "Bonjour Sarah ! Je vous écoute.",
        time: "14:18",
      },
      {
        id: 103,
        sender: "client",
        text: "Est-ce que la robe taille grand ? Je fais habituellement du M.",
        time: "14:20",
      },
    ],
  },
  {
    id: 2,
    customer: "Karim T.",
    email: "karim@email.fr",
    online: false,
    lastMsg: "Merci pour la rapidité !",
    time: "Hier",
    unread: 0,
    commandes: [
      {
        id: "ORD-8815",
        produit: "Trench Camel + Chapeau",
        status: "Livrée",
        total: 1079,
        date: "08/04/2026",
      },
    ],
    messages: [
      {
        id: 201,
        sender: "client",
        text: "Bonjour, ma commande est bien confirmée ?",
        time: "13:00",
      },
      {
        id: 202,
        sender: "boutique",
        text: "Oui Karim, votre commande est acceptée et en préparation !",
        time: "13:05",
      },
      {
        id: 203,
        sender: "client",
        text: "Merci pour la rapidité !",
        time: "13:10",
      },
    ],
  },
  {
    id: 3,
    customer: "Leila M.",
    email: "leila@email.fr",
    online: true,
    lastMsg: "Vous avez ce parfum en 100ml ?",
    time: "16:05",
    unread: 1,
    commandes: [],
    messages: [
      {
        id: 301,
        sender: "client",
        text: "Bonsoir, vous avez le Parfum Oud en 100ml ?",
        time: "16:05",
      },
    ],
  },
];

const STATUS_COLORS = {
  "En préparation": { color: "#3B82F6", bg: "#EFF6FF" },
  Livrée: { color: "#10B981", bg: "#ECFDF5" },
  Nouvelle: { color: "#F59E0B", bg: "#FEF3C7" },
  Prête: { color: "#8B5CF6", bg: "#F5F3FF" },
};

export default function Messages() {
  const [chats, setChats] = useState(CHATS);
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState("");
  const [showRapides, setShowRapides] = useState(false);
  const [showCommandes, setShowCommandes] = useState(false);
  const [search, setSearch] = useState("");
  const [autoReplied, setAutoReplied] = useState(new Set()); // track chats déjà auto-répondus
  const scrollRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeId);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    setChats((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
    );
  }, [activeId, activeChat?.messages?.length]);

  // Déclenche l'auto-réponse LIVRR quand un client envoie un message
  // (simulé ici côté boutique — en prod ce serait côté serveur)
  const triggerAutoReply = (chatId) => {
    // On n'envoie l'auto-réponse qu'une seule fois par conversation
    if (autoReplied.has(chatId)) return;
    setAutoReplied((prev) => new Set([...prev, chatId]));

    const autoMsg = {
      id: Date.now() + 1,
      sender: "boutique",
      text: "Bonjour ! Nous avons bien reçu votre message et notre équipe revient vers vous dans les meilleurs délais. Merci de votre patience.",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isAuto: true,
    };

    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [...c.messages, autoMsg],
                lastMsg: autoMsg.text,
                time: "maintenant",
              }
            : c
        )
      );
      toast(
        "💬 Réponse automatique envoyée à " +
          (chats.find((c) => c.id === chatId)?.customer || ""),
        {
          icon: "🤖",
          duration: 3000,
        }
      );
    }, 1500); // délai de 1.5s pour simuler la réponse automatique
  };

  const send = (text) => {
    if (!text.trim()) return;
    const msg = {
      id: Date.now(),
      sender: "boutique",
      text,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMsg: text,
              time: "maintenant",
            }
          : c
      )
    );
    setInput("");
    setShowRapides(false);
  };

  // Simule la réception d'un message client (pour la démo)
  const simulateClientMessage = () => {
    const chat = chats.find((c) => c.id === activeId);
    if (!chat) return;
    const clientMsg = {
      id: Date.now(),
      sender: "client",
      text: "Bonjour, j'aurais besoin d'informations sur ma commande.",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, clientMsg],
              lastMsg: clientMsg.text,
              time: "maintenant",
              unread: 1,
            }
          : c
      )
    );
    // Déclenche l'auto-réponse
    triggerAutoReply(activeId);
  };

  const handleSend = (e) => {
    e.preventDefault();
    send(input);
  };

  const filteredChats = chats.filter(
    (c) =>
      c.customer.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMsg.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        height: "calc(100vh)",
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      {/* ── LISTE CONVERSATIONS ── */}
      <div
        style={{
          borderRight: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <div
          style={{
            padding: "20px 16px 14px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: "400",
              marginBottom: "12px",
            }}
          >
            Messages
          </h2>
          <input
            className="input-field"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 0, fontSize: "13px", padding: "8px 12px" }}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveId(chat.id);
                setShowCommandes(false);
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                transition: "background 0.15s",
                background:
                  activeId === chat.id
                    ? "rgba(201,169,110,0.06)"
                    : "transparent",
                borderLeft:
                  activeId === chat.id
                    ? "3px solid var(--gold)"
                    : "3px solid transparent",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (activeId !== chat.id)
                  e.currentTarget.style.background = "rgba(0,0,0,0.02)";
              }}
              onMouseLeave={(e) => {
                if (activeId !== chat.id)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {/* Avatar avec indicateur online */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: "rgba(201,169,110,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: "14px",
                        color: "var(--gold-dark)",
                      }}
                    >
                      {chat.customer.charAt(0)}
                    </div>
                    {chat.online && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background: "#10B981",
                          border: "2px solid #fff",
                        }}
                      />
                    )}
                  </div>
                  <span style={{ fontWeight: "700", fontSize: "14px" }}>
                    {chat.customer}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {chat.time}
                  </span>
                  {chat.unread > 0 && (
                    <span
                      style={{
                        background: "var(--gold)",
                        color: "var(--noir)",
                        borderRadius: "20px",
                        padding: "1px 7px",
                        fontSize: "10px",
                        fontWeight: "800",
                      }}
                    >
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: chat.unread > 0 ? "var(--noir)" : "var(--gray)",
                  fontWeight: chat.unread > 0 ? "600" : "400",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingLeft: "42px",
                }}
              >
                {chat.lastMsg}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FENÊTRE CHAT ── */}
      {activeChat && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#F8F7F4",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 20px",
              background: "#fff",
              borderBottom: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "rgba(201,169,110,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    color: "var(--gold-dark)",
                  }}
                >
                  {activeChat.customer.charAt(0)}
                </div>
                {activeChat.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 1,
                      right: 1,
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#10B981",
                      border: "2px solid #fff",
                    }}
                  />
                )}
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px" }}>
                  {activeChat.customer}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: activeChat.online ? "#10B981" : "var(--gray)",
                    fontWeight: "600",
                  }}
                >
                  {activeChat.online ? "En ligne" : "Hors ligne"} ·{" "}
                  {activeChat.email}
                </div>
              </div>
            </div>
            <button
              onClick={simulateClientMessage}
              title="Simuler un message client (démo)"
              style={{
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "rgba(0,0,0,0.03)",
                fontSize: "11px",
                fontWeight: "600",
                color: "var(--gray)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.07)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.03)")
              }
            >
              💬 Simuler client
            </button>
            <button
              onClick={() => setShowCommandes(!showCommandes)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: `1px solid ${
                  showCommandes ? "var(--gold)" : "rgba(0,0,0,0.1)"
                }`,
                background: showCommandes
                  ? "rgba(201,169,110,0.08)"
                  : "transparent",
                fontSize: "12px",
                fontWeight: "600",
                color: showCommandes ? "var(--gold-dark)" : "var(--gray)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
            >
              📦 Commandes ({activeChat.commandes.length})
            </button>
          </div>

          {/* Panneau commandes */}
          {showCommandes && (
            <div
              style={{
                background: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                padding: "12px 20px",
              }}
            >
              {activeChat.commandes.length === 0 ? (
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--gray)",
                    padding: "8px 0",
                  }}
                >
                  Aucune commande pour ce client
                </div>
              ) : (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {activeChat.commandes.map((cmd) => {
                    const sc = STATUS_COLORS[cmd.status] || {
                      color: "var(--gray)",
                      bg: "rgba(0,0,0,0.04)",
                    };
                    return (
                      <div
                        key={cmd.id}
                        style={{
                          padding: "10px 14px",
                          background: sc.bg,
                          borderRadius: "10px",
                          border: `1px solid ${sc.color}33`,
                          minWidth: "200px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "15px",
                              fontWeight: "600",
                            }}
                          >
                            {cmd.id}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              color: sc.color,
                              background: "rgba(255,255,255,0.7)",
                              padding: "2px 8px",
                              borderRadius: "20px",
                            }}
                          >
                            {cmd.status}
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                          {cmd.produit}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "4px",
                          }}
                        >
                          <span
                            style={{ fontSize: "11px", color: "var(--gray)" }}
                          >
                            {cmd.date}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "15px",
                            }}
                          >
                            {cmd.total} €
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {activeChat.messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    m.sender === "boutique" ? "flex-end" : "flex-start",
                  maxWidth: "72%",
                  alignSelf:
                    m.sender === "boutique" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "11px 16px",
                    borderRadius:
                      m.sender === "boutique"
                        ? "16px 16px 3px 16px"
                        : "16px 16px 16px 3px",
                    background:
                      m.sender === "boutique" ? "var(--noir)" : "#fff",
                    color: m.sender === "boutique" ? "#fff" : "var(--noir)",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  {m.text}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--gray)",
                    marginTop: "4px",
                  }}
                >
                  {m.time}
                </span>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Réponses rapides */}
          {showRapides && (
            <div
              style={{
                background: "#fff",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                padding: "10px 16px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--gray)",
                  marginBottom: "8px",
                }}
              >
                Réponses rapides
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                {REPONSES_RAPIDES.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => send(r)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      color: "var(--noir)",
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(201,169,110,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "14px 20px",
              background: "#fff",
              borderTop: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setShowRapides(!showRapides)}
              title="Réponses rapides"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: `1px solid ${
                  showRapides ? "var(--gold)" : "rgba(0,0,0,0.1)"
                }`,
                background: showRapides
                  ? "rgba(201,169,110,0.1)"
                  : "transparent",
                cursor: "pointer",
                fontSize: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              ⚡
            </button>
            <input
              className="input-field"
              placeholder="Écrivez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, marginBottom: 0, fontSize: "14px" }}
            />
            <button
              type="submit"
              className="btn-gold"
              style={{
                padding: "0 22px",
                height: "40px",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
