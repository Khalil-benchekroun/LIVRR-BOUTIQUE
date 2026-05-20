import React, { useState } from "react";
import toast from "react-hot-toast";

const AVIS_DATA = [
  {
    id: 1,
    client: "Sophie M.",
    note: 5,
    date: "09/04/2026",
    commande: "#LV-00248",
    commentaire:
      "Livraison ultra rapide, moins de 45 minutes ! La robe est exactement comme sur les photos. Je recommande vivement cette boutique.",
    reponse: null,
    produit: "Robe Midi Fleurie",
  },
  {
    id: 2,
    client: "Marie L.",
    note: 4,
    date: "07/04/2026",
    commande: "#LV-00246",
    commentaire:
      "Très bonne expérience globale. Le livreur était très courtois. Juste un petit bémol sur l'emballage qui aurait pu être un peu plus soigné.",
    reponse:
      "Merci pour votre retour ! Nous prenons note pour l'emballage et travaillons à améliorer notre présentation. À bientôt !",
    produit: "Trench Camel",
  },
  {
    id: 3,
    client: "Camille D.",
    note: 5,
    date: "05/04/2026",
    commande: "#LV-00240",
    commentaire:
      "Parfait du début à la fin. Le blazer est magnifique et la livraison en 38 minutes c'est impressionnant pour Paris.",
    reponse: null,
    produit: "Blazer Structuré",
  },
  {
    id: 4,
    client: "Julie P.",
    note: 3,
    date: "03/04/2026",
    commande: "#LV-00235",
    commentaire:
      "La livraison a pris plus de temps que prévu (1h20). Le produit est bien mais j'attendais mieux côté rapidité.",
    reponse: null,
    produit: "Robe Fleurie",
  },
  {
    id: 5,
    client: "Emma B.",
    note: 5,
    date: "01/04/2026",
    commande: "#LV-00228",
    commentaire:
      "Expérience 5 étoiles. Le sérum est authentique et la boutique a même ajouté un petit mot personnalisé. Très touché.",
    reponse:
      "Merci Emma ! Votre satisfaction est notre priorité. Nous espérons vous revoir bientôt ✨",
    produit: "Sérum Éclat Visage",
  },
  {
    id: 6,
    client: "Sarah K.",
    note: 4,
    date: "28/03/2026",
    commande: "#LV-00220",
    commentaire: "Bonne boutique, bon produit. Livraison dans les délais.",
    reponse: null,
    produit: "Parfum Oud 50ml",
  },
];

function Stars({ note, size = 16, interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => interactive && onSelect && onSelect(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            fontSize: `${size}px`,
            cursor: interactive ? "pointer" : "default",
            color: i <= (hovered || note) ? "#F59E0B" : "#E5E7EB",
            transition: "color 0.15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Avis() {
  const [avis, setAvis] = useState(AVIS_DATA);
  const [filterNote, setFilterNote] = useState("all");
  const [repondreId, setRepondreId] = useState(null);
  const [reponseText, setReponseText] = useState("");

  const noteGlobale = (
    avis.reduce((s, a) => s + a.note, 0) / avis.length
  ).toFixed(1);
  const distribution = [5, 4, 3, 2, 1].map((n) => ({
    note: n,
    count: avis.filter((a) => a.note === n).length,
  }));
  const sansReponse = avis.filter((a) => !a.reponse).length;

  const filtered = avis.filter(
    (a) => filterNote === "all" || a.note === parseInt(filterNote)
  );

  const envoyerReponse = (avisId) => {
    if (!reponseText.trim())
      return toast.error("La réponse ne peut pas être vide");
    setAvis((prev) =>
      prev.map((a) => (a.id === avisId ? { ...a, reponse: reponseText } : a))
    );
    setRepondreId(null);
    setReponseText("");
    toast.success("Réponse publiée ✓", { duration: 2000 });
  };

  const noteColor = (n) =>
    n >= 4.5 ? "#10B981" : n >= 3.5 ? "#F59E0B" : "#EF4444";

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "38px",
              fontWeight: "400",
            }}
          >
            Avis & Réputation
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            Consultez et répondez aux avis de vos clients
          </p>
        </div>
        {sansReponse > 0 && (
          <div
            style={{
              padding: "10px 16px",
              background: "var(--warning-bg)",
              border: "1px solid var(--warning)",
              borderRadius: "10px",
              fontSize: "13px",
              color: "var(--warning)",
              fontWeight: "600",
            }}
          >
            ⚠️ {sansReponse} avis sans réponse
          </div>
        )}
      </div>

      {/* STATS GLOBALES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {/* Note globale */}
        <div
          className="card"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "64px",
              fontWeight: "300",
              color: noteColor(parseFloat(noteGlobale)),
              lineHeight: 1,
            }}
          >
            {noteGlobale}
          </div>
          <Stars note={Math.round(parseFloat(noteGlobale))} size={20} />
          <div
            style={{ fontSize: "12px", color: "var(--gray)", marginTop: "8px" }}
          >
            {avis.length} avis
          </div>
          <div
            style={{ fontSize: "11px", color: "var(--gray)", marginTop: "4px" }}
          >
            Visibilité LIVRR :{" "}
            {parseFloat(noteGlobale) >= 4 ? "⬆ Boostée" : "↘ Réduite"}
          </div>
        </div>

        {/* Distribution */}
        <div className="card">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: "400",
              marginBottom: "16px",
            }}
          >
            Distribution des notes
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {distribution.map((d) => (
              <div
                key={d.note}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    width: "50px",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    {d.note}
                  </span>
                  <span style={{ fontSize: "13px", color: "#F59E0B" }}>★</span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "rgba(0,0,0,0.06)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${
                        avis.length ? (d.count / avis.length) * 100 : 0
                      }%`,
                      background:
                        d.note >= 4
                          ? "#10B981"
                          : d.note === 3
                          ? "#F59E0B"
                          : "#EF4444",
                      borderRadius: "4px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gray)",
                    width: "30px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[
          { key: "all", label: "Tous" },
          { key: "5", label: "★★★★★" },
          { key: "4", label: "★★★★" },
          { key: "3", label: "★★★" },
          { key: "2", label: "★★" },
          { key: "1", label: "★" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterNote(f.key)}
            style={{
              padding: "7px 16px",
              borderRadius: "30px",
              border: `1.5px solid ${
                filterNote === f.key ? "var(--gold)" : "rgba(0,0,0,0.1)"
              }`,
              background:
                filterNote === f.key ? "rgba(201,169,110,0.08)" : "transparent",
              color: filterNote === f.key ? "var(--gold-dark)" : "var(--gray)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
        <span
          style={{
            marginLeft: "auto",
            fontSize: "13px",
            color: "var(--gray)",
            alignSelf: "center",
          }}
        >
          {filtered.length} avis
        </span>
      </div>

      {/* LISTE DES AVIS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.map((a) => (
          <div
            key={a.id}
            className="card"
            style={{
              borderLeft: a.reponse
                ? "3px solid #10B981"
                : a.note <= 3
                ? "3px solid #EF4444"
                : "3px solid rgba(0,0,0,0.07)",
            }}
          >
            {/* Header avis */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--gold-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    color: "var(--gold-dark)",
                    flexShrink: 0,
                  }}
                >
                  {a.client.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>
                    {a.client}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                    {a.produit} · {a.commande}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Stars note={a.note} size={15} />
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    marginTop: "3px",
                  }}
                >
                  {a.date}
                </div>
              </div>
            </div>

            {/* Commentaire */}
            <p
              style={{
                fontSize: "14px",
                color: "var(--noir)",
                lineHeight: 1.7,
                marginBottom: "14px",
                fontStyle: "italic",
              }}
            >
              « {a.commentaire} »
            </p>

            {/* Réponse existante */}
            {a.reponse && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(16,185,129,0.05)",
                  borderRadius: "10px",
                  border: "1px solid rgba(16,185,129,0.15)",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#10B981",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "6px",
                  }}
                >
                  ✓ Votre réponse
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--noir)",
                    lineHeight: 1.6,
                  }}
                >
                  {a.reponse}
                </p>
              </div>
            )}

            {/* Zone réponse */}
            {!a.reponse &&
              (repondreId === a.id ? (
                <div style={{ marginTop: "8px" }}>
                  <textarea
                    className="input-field"
                    placeholder="Répondez à cet avis de façon professionnelle et bienveillante…"
                    value={reponseText}
                    onChange={(e) => setReponseText(e.target.value)}
                    rows={3}
                    style={{ marginBottom: "8px", resize: "vertical" }}
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn-gold"
                      style={{ flex: 2 }}
                      onClick={() => envoyerReponse(a.id)}
                    >
                      Publier la réponse
                    </button>
                    <button
                      className="btn-outline"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setRepondreId(null);
                        setReponseText("");
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setRepondreId(a.id);
                    setReponseText("");
                  }}
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--gold)",
                    background: "none",
                    border: "1px solid rgba(201,169,110,0.3)",
                    padding: "7px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(201,169,110,0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  Répondre à cet avis
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
