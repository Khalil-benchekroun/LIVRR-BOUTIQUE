import React, { useState } from "react";
import toast from "react-hot-toast";

const FAQ = [
  {
    q: "Comment modifier mon abonnement ?",
    r: "Rendez-vous dans Paramètres > Abonnement Boutique. Toute modification nécessite une validation LIVRR et un paiement avant activation.",
  },
  {
    q: "Quel est le délai de versement des fonds ?",
    r: "Conformément à la réglementation DSP2 européenne, les fonds sont maintenus 14 jours minimum sur la plateforme avant versement sur votre compte.",
  },
  {
    q: "Comment signaler un problème avec une commande ?",
    r: "Depuis la page Commandes, cliquez sur la commande concernée et utilisez le bouton 'Signaler un problème'. Notre équipe intervient sous 2h.",
  },
  {
    q: "Comment connecter mon stock via API ?",
    r: "La connexion API (Shopify, Lightspeed, etc.) est disponible sur les offres Signature et Prestige. Contactez notre équipe technique via ce formulaire.",
  },
  {
    q: "Une image a été refusée par le filtre IA, que faire ?",
    r: "Si vous pensez que le refus est une erreur, contactez notre équipe de modération avec le nom du produit concerné. Délai de traitement : 24h.",
  },
  {
    q: "Comment exporter ma comptabilité ?",
    r: "Depuis la section Finance, vous pouvez exporter vos transactions en CSV et télécharger vos documents comptables (relevés, factures) à tout moment.",
  },
];

const TICKETS = [
  {
    id: "TKT-001",
    sujet: "Problème d'affichage produit",
    statut: "résolu",
    date: "05/04/2026",
    priorite: "normale",
  },
  {
    id: "TKT-002",
    sujet: "Retard de versement",
    statut: "en cours",
    date: "07/04/2026",
    priorite: "haute",
  },
  {
    id: "TKT-003",
    sujet: "Question API stocks",
    statut: "en attente",
    date: "09/04/2026",
    priorite: "normale",
  },
];

const STATUT_TICKET = {
  résolu: { cls: "badge-success", label: "Résolu" },
  "en cours": { cls: "badge-info", label: "En cours" },
  "en attente": { cls: "badge-warning", label: "En attente" },
};

export default function Support() {
  const [activeTab, setActiveTab] = useState("faq");
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    sujet: "",
    categorie: "general",
    message: "",
    priorite: "normale",
  });

  const handleSubmit = () => {
    if (!form.sujet || !form.message)
      return toast.error("Sujet et message requis");
    toast.success("Ticket créé ! Notre équipe vous répond sous 24h.", {
      icon: "✅",
      duration: 4000,
    });
    setForm({
      sujet: "",
      categorie: "general",
      message: "",
      priorite: "normale",
    });
  };

  const TAB = {
    fontSize: "13px",
    fontWeight: "600",
    padding: "8px 18px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "38px",
            fontWeight: "400",
          }}
        >
          Support LIVRR
        </h1>
        <p style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}>
          FAQ · Créer un ticket · Suivi de vos demandes
        </p>
      </div>

      {/* Contacts rapides */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            icon: "💬",
            title: "Chat en direct",
            desc: "Lun–Ven 9h–19h",
            action: "Démarrer le chat",
            color: "var(--success-bg)",
            border: "var(--success)",
          },
          {
            icon: "📧",
            title: "Email support",
            desc: "support@livrr.fr",
            action: "Envoyer un email",
            color: "var(--info-bg)",
            border: "var(--info)",
          },
          {
            icon: "📞",
            title: "Urgences",
            desc: "+33 1 XX XX XX XX",
            action: "Appeler",
            color: "var(--gold-lighter)",
            border: "var(--gold)",
          },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              background: c.color,
              border: `1px solid ${c.border}`,
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "24px" }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                  marginBottom: "3px",
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--gray)",
                  marginBottom: "10px",
                }}
              >
                {c.desc}
              </div>
              <button
                onClick={() => toast(`${c.action}…`)}
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--noir)",
                  background: "rgba(255,255,255,0.7)",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                {c.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        {[
          { key: "faq", label: "❓ FAQ" },
          { key: "ticket", label: "🎫 Créer un ticket" },
          { key: "suivi", label: "📋 Mes tickets" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              ...TAB,
              borderRadius: "0",
              paddingBottom: "12px",
              borderBottom: `2px solid ${
                activeTab === t.key ? "var(--gold)" : "transparent"
              }`,
              color: activeTab === t.key ? "var(--noir)" : "var(--gray)",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* FAQ */}
      {activeTab === "faq" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FAQ.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: `1px solid ${
                  openFaq === i ? "var(--gold)" : "rgba(0,0,0,0.07)"
                }`,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  {item.q}
                </span>
                <span
                  style={{
                    color: "var(--gold)",
                    fontSize: "18px",
                    flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  +
                </span>
              </div>
              {openFaq === i && (
                <div
                  style={{
                    padding: "0 20px 16px",
                    fontSize: "13px",
                    color: "var(--gray)",
                    lineHeight: 1.7,
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ paddingTop: "12px" }}>{item.r}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CRÉER UN TICKET */}
      {activeTab === "ticket" && (
        <div className="card" style={{ maxWidth: "600px" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: "400",
              marginBottom: "24px",
            }}
          >
            Nouveau ticket
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label className="label">Catégorie</label>
                <select
                  className="input-field"
                  value={form.categorie}
                  onChange={(e) =>
                    setForm({ ...form, categorie: e.target.value })
                  }
                  style={{ marginBottom: 0 }}
                >
                  <option value="general">Question générale</option>
                  <option value="commande">Problème commande</option>
                  <option value="paiement">Paiement / Finance</option>
                  <option value="technique">Problème technique</option>
                  <option value="abonnement">Abonnement</option>
                  <option value="moderation">Modération visuelle</option>
                </select>
              </div>
              <div>
                <label className="label">Priorité</label>
                <select
                  className="input-field"
                  value={form.priorite}
                  onChange={(e) =>
                    setForm({ ...form, priorite: e.target.value })
                  }
                  style={{ marginBottom: 0 }}
                >
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Sujet *</label>
              <input
                className="input-field"
                placeholder="Décrivez brièvement votre problème"
                value={form.sujet}
                onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea
                className="input-field"
                placeholder="Décrivez votre problème en détail..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                style={{ marginBottom: 0, resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-gold"
                style={{ flex: 2 }}
                onClick={handleSubmit}
              >
                Envoyer le ticket
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() =>
                  setForm({
                    sujet: "",
                    categorie: "general",
                    message: "",
                    priorite: "normale",
                  })
                }
              >
                Réinitialiser
              </button>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--gray)",
                lineHeight: 1.6,
              }}
            >
              ⏱️ Délai de réponse : 24h en semaine · Urgences traitées sous 2h
            </div>
          </div>
        </div>
      )}

      {/* MES TICKETS */}
      {activeTab === "suivi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TICKETS.map((t) => {
            const cfg = STATUT_TICKET[t.statut];
            return (
              <div
                key={t.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "var(--gray)",
                    flexShrink: 0,
                  }}
                >
                  {t.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {t.sujet}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--gray)",
                      marginTop: "2px",
                    }}
                  >
                    Créé le {t.date} · Priorité {t.priorite}
                  </div>
                </div>
                <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                <button
                  className="btn-outline"
                  style={{
                    fontSize: "12px",
                    padding: "7px 14px",
                    flexShrink: 0,
                  }}
                  onClick={() => toast(`Ticket ${t.id} — ${t.sujet}`)}
                >
                  Voir le détail
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
