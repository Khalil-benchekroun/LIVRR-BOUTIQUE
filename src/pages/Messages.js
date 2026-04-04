import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const INITIAL_CHATS = [
  {
    id: 1,
    customer: "Sarah B.",
    lastMsg: "Est-ce que la robe taille grand ?",
    time: "14:20",
    unread: true,
    online: true,
  },
  {
    id: 2,
    customer: "Karim T.",
    lastMsg: "Merci pour la rapidité !",
    time: "Hier",
    unread: false,
    online: false,
  },
];

const MESSAGES_HISTORY = {
  1: [
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
};

export default function Messages() {
  const [chats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState(INITIAL_CHATS[0]);
  const [messages, setMessages] = useState(MESSAGES_HISTORY[1]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "boutique",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2d", minute: "2d" }),
    };

    setMessages([...messages, newMsg]);
    setInput("");
    toast.success("Message envoyé", { duration: 1000 });
  };

  return (
    <div
      className="page"
      style={{ height: "calc(100vh - 100px)", padding: 0, overflow: "hidden" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          height: "100%",
          background: "#fff",
        }}
      >
        {/* LISTE DES CONVERSATIONS */}
        <div
          style={{
            borderRight: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "24px", borderBottom: "1px solid #eee" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Messages</h2>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat);
                  setMessages(MESSAGES_HISTORY[chat.id] || []);
                }}
                style={{
                  padding: "20px",
                  cursor: "pointer",
                  background:
                    activeChat.id === chat.id ? "#F9FAFB" : "transparent",
                  borderLeft:
                    activeChat.id === chat.id
                      ? "4px solid var(--gold)"
                      : "4px solid transparent",
                  borderBottom: "1px solid #f9f9f9",
                  transition: "0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontWeight: "700", fontSize: "15px" }}>
                    {chat.customer}{" "}
                    {chat.online && (
                      <span style={{ color: "#10B981", fontSize: "10px" }}>
                        ●
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {chat.time}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: chat.unread ? "var(--noir)" : "var(--gray)",
                    fontWeight: chat.unread ? "600" : "400",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chat.lastMsg}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FENÊTRE DE TCHAT ACTIVE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#F3F4F6",
          }}
        >
          {/* Header Chat */}
          <div
            style={{
              padding: "16px 24px",
              background: "#fff",
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {activeChat.customer.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: "600" }}>{activeChat.customer}</div>
              <div style={{ fontSize: "12px", color: "#10B981" }}>En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf:
                    m.sender === "boutique" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    m.sender === "boutique" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius:
                      m.sender === "boutique"
                        ? "16px 16px 2px 16px"
                        : "16px 16px 16px 2px",
                    background:
                      m.sender === "boutique" ? "var(--noir)" : "#fff",
                    color: m.sender === "boutique" ? "#fff" : "var(--noir)",
                    fontSize: "14px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "20px",
              background: "#fff",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "12px",
            }}
          >
            <input
              className="input-field"
              placeholder="Écrivez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button
              className="btn-gold"
              type="submit"
              style={{ padding: "0 24px" }}
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
