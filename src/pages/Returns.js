import React, { useState } from "react";
import toast from "react-hot-toast";

/* ============================================================
   LIVRR — Retours CDC V1
   Machine à états : Demande reçue → Retour en cours →
   Reçu & validé → Remboursement en cours → Remboursé
   La boutique confirme réception + conformité
   Horodatage de chaque action
   ============================================================ */

const today = new Date().toLocaleDateString("fr-FR");
const now = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const RETURN_STATUS = {
  demande: {
    label: "Demande reçue",
    color: "#F59E0B",
    bg: "#FEF3C7",
    dot: "#F59E0B",
    step: 1,
  },
  en_cours: {
    label: "Retour en cours",
    color: "#3B82F6",
    bg: "#EFF6FF",
    dot: "#3B82F6",
    step: 2,
  },
  recu: {
    label: "Reçu & validé",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    dot: "#8B5CF6",
    step: 3,
  },
  remb_cours: {
    label: "Remboursement en cours",
    color: "#F97316",
    bg: "#FFF7ED",
    dot: "#F97316",
    step: 4,
  },
  rembourse: {
    label: "Remboursé",
    color: "#10B981",
    bg: "#ECFDF5",
    dot: "#10B981",
    step: 5,
  },
  refuse: {
    label: "Refusé",
    color: "#EF4444",
    bg: "#FEF2F2",
    dot: "#EF4444",
    step: 0,
  },
};

const STEPS_LIST = [
  { key: "demande", label: "Demande" },
  { key: "en_cours", label: "En cours" },
  { key: "recu", label: "Reçu & validé" },
  { key: "remb_cours", label: "Remboursement" },
  { key: "rembourse", label: "Remboursé" },
];

const MOTIFS_RETOUR = [
  "Taille incorrecte",
  "Produit défectueux",
  "Ne correspond pas à la description",
  "Changement d'avis",
  "Article endommagé à la livraison",
  "Mauvaise référence livrée",
];

const MOTIFS_REFUS = [
  "Produit porté / utilisé",
  "Article endommagé par le client",
  "Délai de retour dépassé (14j)",
  "Produit non éligible au retour",
  "Packaging d'origine manquant",
];

const INITIAL_RETURNS = [
  {
    id: "RET-0045",
    orderId: "ORD-8821",
    customer: "Yasmine A.",
    email: "yasmine@email.fr",
    product: "Robe Midi Fleurie",
    size: "M",
    qty: 1,
    prix: 490,
    status: "demande",
    motif: "Taille incorrecte",
    dateClient: "07/04/2026",
    photoUrl: null,
    conformite: null,
    noteConformite: "",
    historique: [
      {
        statut: "Demande reçue",
        acteur: "Client",
        heure: "14:22",
        date: "07/04/2026",
      },
    ],
  },
  {
    id: "RET-0044",
    orderId: "ORD-8790",
    customer: "Omar K.",
    email: "omar@email.fr",
    product: "Trench Camel",
    size: "L",
    qty: 1,
    prix: 890,
    status: "en_cours",
    motif: "Ne correspond pas à la description",
    dateClient: "05/04/2026",
    photoUrl: null,
    conformite: null,
    noteConformite: "",
    historique: [
      {
        statut: "Demande reçue",
        acteur: "Client",
        heure: "10:10",
        date: "05/04/2026",
      },
      {
        statut: "Retour en cours",
        acteur: "Boutique",
        heure: "10:45",
        date: "05/04/2026",
      },
    ],
  },
  {
    id: "RET-0043",
    orderId: "ORD-8770",
    customer: "Leila M.",
    email: "leila@email.fr",
    product: "Blazer Structuré",
    size: "S",
    qty: 1,
    prix: 295,
    status: "remb_cours",
    motif: "Produit défectueux",
    dateClient: "02/04/2026",
    photoUrl: null,
    conformite: true,
    noteConformite: "Couture défectueuse visible sur la manche gauche",
    historique: [
      {
        statut: "Demande reçue",
        acteur: "Client",
        heure: "09:30",
        date: "02/04/2026",
      },
      {
        statut: "Retour en cours",
        acteur: "Boutique",
        heure: "11:00",
        date: "02/04/2026",
      },
      {
        statut: "Reçu & validé",
        acteur: "Siham B.",
        heure: "14:00",
        date: "04/04/2026",
        note: "Couture défectueuse confirmée",
      },
      {
        statut: "Remboursement en cours",
        acteur: "Système",
        heure: "14:01",
        date: "04/04/2026",
      },
    ],
  },
  {
    id: "RET-0042",
    orderId: "ORD-8750",
    customer: "Sophie M.",
    email: "sophie@email.fr",
    product: "Parfum Oud 50ml",
    size: "Unique",
    qty: 1,
    prix: 280,
    status: "rembourse",
    motif: "Changement d'avis",
    dateClient: "28/03/2026",
    photoUrl: null,
    conformite: true,
    noteConformite: "Flacon intact, non ouvert",
    historique: [
      {
        statut: "Demande reçue",
        acteur: "Client",
        heure: "16:00",
        date: "28/03/2026",
      },
      {
        statut: "Retour en cours",
        acteur: "Boutique",
        heure: "16:30",
        date: "28/03/2026",
      },
      {
        statut: "Reçu & validé",
        acteur: "Youssef L.",
        heure: "10:00",
        date: "30/03/2026",
      },
      {
        statut: "Remboursement en cours",
        acteur: "Système",
        heure: "10:01",
        date: "30/03/2026",
      },
      {
        statut: "Remboursé",
        acteur: "Système",
        heure: "09:00",
        date: "05/04/2026",
      },
    ],
  },
];

function ReturnStepper({ status }) {
  if (status === "refuse") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "#FEF2F2",
          borderRadius: "8px",
          border: "1px solid #EF444433",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#EF4444",
          }}
        />
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#EF4444" }}>
          Retour refusé
        </span>
      </div>
    );
  }
  const currentStep = RETURN_STATUS[status]?.step || 1;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {STEPS_LIST.map((s, i) => {
        const stepNum = RETURN_STATUS[s.key]?.step || 0;
        const done = stepNum < currentStep;
        const current = stepNum === currentStep;
        return (
          <React.Fragment key={s.key}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: done
                    ? "#10B981"
                    : current
                    ? "var(--gold)"
                    : "rgba(0,0,0,0.06)",
                  border: `2px solid ${
                    done
                      ? "#10B981"
                      : current
                      ? "var(--gold)"
                      : "rgba(0,0,0,0.1)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: "800",
                  color: done || current ? "#fff" : "rgba(0,0,0,0.3)",
                }}
              >
                {done ? "✓" : stepNum}
              </div>
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: "600",
                  color: done || current ? "var(--noir)" : "var(--gray)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS_LIST.length - 1 && (
              <div
                style={{
                  width: "20px",
                  height: "2px",
                  background:
                    stepNum < currentStep ? "#10B981" : "rgba(0,0,0,0.08)",
                  marginBottom: "14px",
                  transition: "background 0.3s",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Historique({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((h, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "10px",
            paddingBottom: i < items.length - 1 ? "12px" : "0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === 0 ? "var(--gold)" : "rgba(0,0,0,0.15)",
                marginTop: "4px",
                flexShrink: 0,
              }}
            />
            {i < items.length - 1 && (
              <div
                style={{
                  width: "1px",
                  flex: 1,
                  background: "rgba(0,0,0,0.07)",
                  minHeight: "18px",
                }}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>
                {h.statut}
              </span>
              <span style={{ fontSize: "10px", color: "var(--gray)" }}>
                {h.heure} · {h.date}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--gray)" }}>
              par {h.acteur}
            </div>
            {h.note && (
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--gray)",
                  fontStyle: "italic",
                  marginTop: "2px",
                }}
              >
                "{h.note}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Returns() {
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal conformité
  const [showConformite, setShowConformite] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [conformiteOk, setConformiteOk] = useState(null);
  const [noteConf, setNoteConf] = useState("");

  // Modal refus
  const [showRefus, setShowRefus] = useState(false);
  const [motifRefus, setMotifRefus] = useState("");

  const addHisto = (id, statut, acteur, note = null) => {
    const entry = { statut, acteur, heure: now(), date: today };
    if (note) entry.note = note;
    setReturns((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, historique: [...r.historique, entry] } : r
      )
    );
  };

  const transition = (id, newStatus, extra = {}) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, ...extra } : r))
    );
    if (selected?.id === id)
      setSelected((prev) => ({ ...prev, status: newStatus, ...extra }));
  };

  // Étape 1→2 : Boutique prend en charge
  const accepterRetour = (id) => {
    transition(id, "en_cours");
    addHisto(id, "Retour en cours", "Boutique");
    toast.success(
      "Retour pris en charge — Client notifié de renvoyer le colis",
      { icon: "📦" }
    );
  };

  // Étape 2→3 : Réception + conformité
  const openConformite = (id) => {
    setPendingId(id);
    setConformiteOk(null);
    setNoteConf("");
    setShowConformite(true);
  };

  const confirmerReception = () => {
    if (conformiteOk === null)
      return toast.error("Indiquez si le produit est conforme");
    const note =
      noteConf.trim() ||
      (conformiteOk
        ? "Produit conforme à la description"
        : "Produit non conforme");
    transition(pendingId, conformiteOk ? "remb_cours" : "refuse", {
      conformite: conformiteOk,
      noteConformite: note,
    });
    addHisto(
      pendingId,
      conformiteOk ? "Reçu & validé" : "Retour refusé",
      "Boutique",
      note
    );
    if (conformiteOk) {
      addHisto(pendingId, "Remboursement en cours", "Système LIVRR");
      toast.success(
        "Produit reçu et conforme — Remboursement déclenché automatiquement",
        { icon: "✅", duration: 4000 }
      );
    } else {
      toast.error("Produit non conforme — Retour refusé, client notifié", {
        duration: 4000,
      });
    }
    setShowConformite(false);
  };

  // Étape 4→5 : Remboursement complété
  const confirmerRemboursement = (id) => {
    transition(id, "rembourse");
    addHisto(id, "Remboursé", "Système LIVRR");
    toast.success("Remboursement confirmé ✓", { icon: "💳" });
  };

  const filtered = returns.filter(
    (r) => filterStatus === "all" || r.status === filterStatus
  );

  const FILTERS = [
    { key: "all", label: "Tous", count: returns.length },
    {
      key: "demande",
      label: "À traiter",
      count: returns.filter((r) => r.status === "demande").length,
    },
    {
      key: "en_cours",
      label: "En cours",
      count: returns.filter((r) => r.status === "en_cours").length,
    },
    {
      key: "remb_cours",
      label: "Remboursement",
      count: returns.filter((r) => r.status === "remb_cours").length,
    },
    {
      key: "rembourse",
      label: "Terminés",
      count: returns.filter((r) => r.status === "rembourse").length,
    },
  ];

  return (
    <div className="page" style={{ padding: "44px 52px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gray)",
              marginBottom: "8px",
            }}
          >
            Après-vente
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Retours
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "6px" }}
          >
            {returns.filter((r) => r.status === "demande").length} demande
            {returns.filter((r) => r.status === "demande").length !== 1
              ? "s"
              : ""}{" "}
            en attente de traitement
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "16px 20px",
            background: "rgba(201,169,110,0.06)",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: "12px",
          }}
        >
          {[
            {
              label: "En attente",
              value: returns.filter((r) => r.status === "demande").length,
              color: "#F59E0B",
            },
            {
              label: "En cours",
              value: returns.filter((r) => r.status === "en_cours").length,
              color: "#3B82F6",
            },
            {
              label: "Remboursés",
              value: returns.filter((r) => r.status === "rembourse").length,
              color: "#10B981",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                paddingRight: "14px",
                borderRight: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: "300",
                  color: s.color,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--gray)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                color: "var(--noir)",
              }}
            >
              {
                returns.filter((r) =>
                  ["rembourse", "refuse"].includes(r.status)
                ).length
              }
              /{returns.length}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--gray)",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Traités
            </div>
          </div>
        </div>
      </div>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            style={{
              padding: "8px 16px",
              borderRadius: "30px",
              border: `1.5px solid ${
                filterStatus === f.key ? "var(--gold)" : "rgba(0,0,0,0.1)"
              }`,
              background:
                filterStatus === f.key
                  ? "rgba(201,169,110,0.08)"
                  : "transparent",
              color:
                filterStatus === f.key ? "var(--gold-dark)" : "var(--gray)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            {f.label} <span style={{ opacity: 0.6 }}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* LISTE + DÉTAIL */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 400px" : "1fr",
          gap: "20px",
        }}
      >
        {/* LISTE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "var(--gray)",
                background: "#fff",
                borderRadius: "14px",
                border: "1px dashed rgba(0,0,0,0.1)",
              }}
            >
              Aucun retour dans cette catégorie
            </div>
          )}
          {filtered.map((ret) => {
            const cfg = RETURN_STATUS[ret.status];
            const isUrgent = ret.status === "demande";
            return (
              <div
                key={ret.id}
                onClick={() =>
                  setSelected(selected?.id === ret.id ? null : ret)
                }
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  border: `1.5px solid ${
                    selected?.id === ret.id
                      ? "var(--gold)"
                      : isUrgent
                      ? "rgba(245,158,11,0.35)"
                      : "rgba(0,0,0,0.07)"
                  }`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow:
                    selected?.id === ret.id
                      ? "0 4px 20px rgba(201,169,110,0.15)"
                      : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* En-tête */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "18px",
                          fontWeight: "600",
                        }}
                      >
                        {ret.id}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--gray)" }}>
                        ← {ret.orderId}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                      {ret.customer} · {ret.product} ({ret.size})
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--gray)",
                        marginTop: "2px",
                      }}
                    >
                      Motif : {ret.motif}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: cfg.bg,
                        color: cfg.color,
                        border: `1px solid ${cfg.dot}33`,
                      }}
                    >
                      {cfg.label}
                    </span>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        fontWeight: "300",
                        marginTop: "6px",
                      }}
                    >
                      {ret.prix} €
                    </div>
                  </div>
                </div>

                {/* Stepper */}
                <div style={{ marginBottom: "16px", overflowX: "auto" }}>
                  <ReturnStepper status={ret.status} />
                </div>

                {/* Actions */}
                <div
                  style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {ret.status === "demande" && (
                    <button
                      className="btn-gold"
                      style={{ fontSize: "12px", padding: "8px 18px" }}
                      onClick={() => accepterRetour(ret.id)}
                    >
                      ✓ Prendre en charge
                    </button>
                  )}
                  {ret.status === "en_cours" && (
                    <button
                      className="btn-gold"
                      style={{ fontSize: "12px", padding: "8px 18px" }}
                      onClick={() => openConformite(ret.id)}
                    >
                      📦 Confirmer réception & conformité
                    </button>
                  )}
                  {ret.status === "remb_cours" && (
                    <button
                      className="btn-gold"
                      style={{ fontSize: "12px", padding: "8px 18px" }}
                      onClick={() => confirmerRemboursement(ret.id)}
                    >
                      💳 Confirmer remboursement
                    </button>
                  )}
                  {ret.status === "rembourse" && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#10B981",
                        fontWeight: "700",
                      }}
                    >
                      ✓ Dossier clôturé
                    </span>
                  )}
                  {ret.status === "refuse" && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#EF4444",
                        fontWeight: "700",
                      }}
                    >
                      ✕ Retour refusé — {ret.noteConformite}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DÉTAIL */}
        {selected &&
          (() => {
            const ret = returns.find((r) => r.id === selected.id) || selected;
            return (
              <div
                className="card"
                style={{
                  position: "sticky",
                  top: "20px",
                  height: "fit-content",
                  maxHeight: "calc(100vh - 120px)",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
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
                      Détail retour
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        fontWeight: "400",
                      }}
                    >
                      {ret.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "var(--gray)",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Info client */}
                <div
                  style={{
                    padding: "14px",
                    background: "#F8F7F4",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray)",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Client
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {ret.customer}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {ret.email}
                  </div>
                </div>

                {/* Produit */}
                <div
                  style={{
                    padding: "14px",
                    background: "#F8F7F4",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray)",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Produit
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {ret.product}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "4px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "var(--gray)" }}>
                      Taille {ret.size} · Qté {ret.qty}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                      }}
                    >
                      {ret.prix} €
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--warning)",
                      fontWeight: "600",
                      marginTop: "6px",
                    }}
                  >
                    Motif : {ret.motif}
                  </div>
                </div>

                {/* Conformité */}
                {ret.conformite !== null && (
                  <div
                    style={{
                      padding: "12px 14px",
                      background: ret.conformite
                        ? "rgba(16,185,129,0.06)"
                        : "rgba(239,68,68,0.06)",
                      borderRadius: "10px",
                      border: `1px solid ${
                        ret.conformite ? "#10B98133" : "#EF444433"
                      }`,
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: ret.conformite ? "#10B981" : "#EF4444",
                        marginBottom: "4px",
                      }}
                    >
                      {ret.conformite
                        ? "✓ Produit conforme"
                        : "✕ Produit non conforme"}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gray)" }}>
                      {ret.noteConformite}
                    </div>
                  </div>
                )}

                {/* Historique */}
                <div style={{ marginBottom: "16px" }}>
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
                    Historique
                  </div>
                  <Historique items={ret.historique} />
                </div>

                {/* Commande liée */}
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(201,169,110,0.06)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--gray)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Commande liée</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: "600",
                      color: "var(--noir)",
                    }}
                  >
                    {ret.orderId}
                  </span>
                </div>
              </div>
            );
          })()}
      </div>

      {/* MODAL CONFORMITÉ */}
      {showConformite && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowConformite(false)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "460px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--gold)",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}
            >
              Réception & Conformité
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "8px",
              }}
            >
              {pendingId}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray)",
                marginBottom: "24px",
                lineHeight: 1.6,
              }}
            >
              Confirmez que vous avez reçu le produit et indiquez s'il est
              conforme à la description originale.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                onClick={() => setConformiteOk(true)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  border: `2px solid ${
                    conformiteOk === true ? "#10B981" : "rgba(0,0,0,0.08)"
                  }`,
                  background:
                    conformiteOk === true ? "rgba(16,185,129,0.06)" : "#FAFAF8",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>✓</div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    color: conformiteOk === true ? "#10B981" : "var(--noir)",
                  }}
                >
                  Conforme
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    marginTop: "3px",
                  }}
                >
                  Produit intact, en bon état
                </div>
              </div>
              <div
                onClick={() => setConformiteOk(false)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  border: `2px solid ${
                    conformiteOk === false ? "#EF4444" : "rgba(0,0,0,0.08)"
                  }`,
                  background:
                    conformiteOk === false ? "rgba(239,68,68,0.06)" : "#FAFAF8",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>✕</div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    color: conformiteOk === false ? "#EF4444" : "var(--noir)",
                  }}
                >
                  Non conforme
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    marginTop: "3px",
                  }}
                >
                  Produit endommagé / utilisé
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="label">
                Note de conformité{" "}
                {conformiteOk === false ? "(obligatoire)" : ""}
              </label>
              <textarea
                className="input-field"
                placeholder={
                  conformiteOk === false
                    ? "Décrivez le problème constaté..."
                    : "Observation optionnelle..."
                }
                value={noteConf}
                onChange={(e) => setNoteConf(e.target.value)}
                rows={3}
                style={{ marginBottom: 0, resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={
                  conformiteOk === true
                    ? "btn-gold"
                    : conformiteOk === false
                    ? "btn-danger"
                    : "btn-outline"
                }
                style={{ flex: 2, opacity: conformiteOk === null ? 0.5 : 1 }}
                onClick={confirmerReception}
              >
                {conformiteOk === true
                  ? "Valider & déclencher remboursement"
                  : conformiteOk === false
                  ? "Refuser le retour"
                  : "Confirmer"}
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowConformite(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
