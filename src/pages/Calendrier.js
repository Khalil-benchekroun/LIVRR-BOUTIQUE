import React, { useState } from "react";
import toast from "react-hot-toast";

const MOIS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const TYPES_BLOCAGE = [
  { key: "ferme", label: "Fermé", color: "#EF4444", bg: "#FEF2F2" },
  {
    key: "indisponible",
    label: "Momentanément indisponible",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  { key: "rush", label: "Mode Rush", color: "#3B82F6", bg: "#EFF6FF" },
  { key: "ferie", label: "Jour férié", color: "#8B5CF6", bg: "#F5F3FF" },
];

const INIT_EVENTS = {
  "2026-04-11": { type: "ferie", note: "Samedi — horaires réduits" },
  "2026-04-13": { type: "ferme", note: "Inventaire annuel" },
  "2026-04-14": { type: "ferme", note: "Inventaire annuel" },
  "2026-04-18": { type: "rush", note: "Vente privée partenaire" },
  "2026-04-25": { type: "ferme", note: "Fermeture exceptionnelle" },
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Lundi = 0
}

export default function Calendrier() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState(INIT_EVENTS);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ type: "ferme", note: "" });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const dateKey = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const handleDayClick = (day) => {
    const key = dateKey(day);
    setSelected(key);
    if (events[key]) {
      // Déjà un événement — proposer suppression
    } else {
      setModalForm({ type: "ferme", note: "" });
      setShowModal(true);
    }
  };

  const addEvent = () => {
    if (!selected) return;
    setEvents((prev) => ({
      ...prev,
      [selected]: { type: modalForm.type, note: modalForm.note },
    }));
    setShowModal(false);
    const typeCfg = TYPES_BLOCAGE.find((t) => t.key === modalForm.type);
    toast.success(`Créneau "${typeCfg.label}" ajouté`, { icon: "📅" });
  };

  const removeEvent = (key) => {
    setEvents((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
    setSelected(null);
    toast("Créneau supprimé", { icon: "🗑️" });
  };

  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Résumé du mois
  const monthEvents = Object.entries(events).filter(([k]) =>
    k.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`)
  );
  const fermes = monthEvents.filter(([, v]) => v.type === "ferme").length;
  const indispos = monthEvents.filter(
    ([, v]) => v.type === "indisponible"
  ).length;

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
            Calendrier des disponibilités
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            Bloquez des créneaux, gérez vos fermetures et jours spéciaux
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {fermes > 0 && (
            <div
              style={{
                padding: "8px 14px",
                background: "var(--error-bg)",
                border: "1px solid var(--error)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--error)",
                fontWeight: "600",
              }}
            >
              {fermes} jour{fermes > 1 ? "s" : ""} fermé{fermes > 1 ? "s" : ""}
            </div>
          )}
          {indispos > 0 && (
            <div
              style={{
                padding: "8px 14px",
                background: "var(--warning-bg)",
                border: "1px solid var(--warning)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--warning)",
                fontWeight: "600",
              }}
            >
              {indispos} indisponible{indispos > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "24px",
        }}
      >
        {/* CALENDRIER */}
        <div className="card">
          {/* Navigation mois */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "none",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(201,169,110,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              ‹
            </button>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
              }}
            >
              {MOIS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "none",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(201,169,110,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              ›
            </button>
          </div>

          {/* Jours de la semaine */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: "4px",
              marginBottom: "8px",
            }}
          >
            {JOURS.map((j) => (
              <div
                key={j}
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  color: "var(--gray)",
                  padding: "6px 0",
                  textTransform: "uppercase",
                }}
              >
                {j}
              </div>
            ))}
          </div>

          {/* Grille jours */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: "4px",
            }}
          >
            {/* Cases vides avant le 1er */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Jours du mois */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const key = dateKey(day);
              const event = events[key];
              const isToday = key === todayKey;
              const isSelected = key === selected;
              const typeCfg = event
                ? TYPES_BLOCAGE.find((t) => t.key === event.type)
                : null;
              const isPast = new Date(key) < new Date(todayKey);

              return (
                <div
                  key={day}
                  onClick={() => !isPast && handleDayClick(day)}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isPast ? "default" : "pointer",
                    transition: "all 0.15s",
                    background: event
                      ? typeCfg.bg
                      : isToday
                      ? "var(--noir)"
                      : isSelected
                      ? "rgba(201,169,110,0.1)"
                      : "transparent",
                    border: isToday
                      ? "none"
                      : isSelected
                      ? "1.5px solid var(--gold)"
                      : event
                      ? `1.5px solid ${typeCfg.color}33`
                      : "1.5px solid transparent",
                    opacity: isPast ? 0.35 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isPast && !event && !isToday)
                      e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isPast && !event && !isToday)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: isToday ? "700" : "500",
                      color: isToday
                        ? "#fff"
                        : event
                        ? typeCfg.color
                        : "var(--noir)",
                    }}
                  >
                    {day}
                  </span>
                  {event && (
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: typeCfg.color,
                        marginTop: "2px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              flexWrap: "wrap",
            }}
          >
            {TYPES_BLOCAGE.map((t) => (
              <div
                key={t.key}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--gray)",
                    fontWeight: "600",
                  }}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Événement sélectionné */}
          {selected && events[selected] && (
            <div
              className="card"
              style={{
                border: `1.5px solid ${
                  TYPES_BLOCAGE.find((t) => t.key === events[selected].type)
                    ?.color
                }33`,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--gold)",
                  marginBottom: "10px",
                }}
              >
                Créneau sélectionné
              </div>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                {selected.split("-").reverse().slice(0, 2).join("/")}{" "}
                {MOIS[currentMonth]}
              </div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  background: TYPES_BLOCAGE.find(
                    (t) => t.key === events[selected].type
                  )?.bg,
                  color: TYPES_BLOCAGE.find(
                    (t) => t.key === events[selected].type
                  )?.color,
                  marginBottom: "10px",
                }}
              >
                {
                  TYPES_BLOCAGE.find((t) => t.key === events[selected].type)
                    ?.label
                }
              </span>
              {events[selected].note && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--gray)",
                    marginBottom: "14px",
                  }}
                >
                  {events[selected].note}
                </p>
              )}
              <button
                onClick={() => removeEvent(selected)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid var(--error)",
                  background: "var(--error-bg)",
                  color: "var(--error)",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                Supprimer ce créneau
              </button>
            </div>
          )}

          {/* Événements du mois */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: "400",
                marginBottom: "14px",
              }}
            >
              {MOIS[currentMonth]} — Récapitulatif
            </h3>
            {monthEvents.length === 0 ? (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--gray)",
                  textAlign: "center",
                  padding: "16px 0",
                }}
              >
                Aucun créneau bloqué ce mois-ci
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {monthEvents
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([key, ev]) => {
                    const typeCfg = TYPES_BLOCAGE.find(
                      (t) => t.key === ev.type
                    );
                    const day = key.split("-")[2];
                    return (
                      <div
                        key={key}
                        onClick={() => setSelected(key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: typeCfg.bg,
                          cursor: "pointer",
                          border: `1px solid ${typeCfg.color}22`,
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: typeCfg.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          {day}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              color: typeCfg.color,
                            }}
                          >
                            {typeCfg.label}
                          </div>
                          {ev.note && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--gray)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ev.note}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Aide */}
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(201,169,110,0.06)",
              border: "1px solid rgba(201,169,110,0.2)",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--gold-dark)",
                marginBottom: "6px",
              }}
            >
              💡 Comment utiliser
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--gray)",
                lineHeight: 1.6,
              }}
            >
              Cliquez sur un jour pour ajouter un créneau. Les clients et LIVRR
              seront automatiquement notifiés de vos indisponibilités.
            </div>
          </div>
        </div>
      </div>

      {/* MODAL AJOUT CRÉNEAU */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "420px",
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
              Nouveau créneau
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "24px",
              }}
            >
              {selected?.split("-").reverse().slice(0, 2).join("/")}{" "}
              {MOIS[currentMonth]} {currentYear}
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label className="label">Type de blocage</label>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {TYPES_BLOCAGE.map((t) => (
                  <div
                    key={t.key}
                    onClick={() => setModalForm((f) => ({ ...f, type: t.key }))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: `1.5px solid ${
                        modalForm.type === t.key ? t.color : "rgba(0,0,0,0.08)"
                      }`,
                      background:
                        modalForm.type === t.key ? t.bg : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: t.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color:
                          modalForm.type === t.key ? t.color : "var(--noir)",
                      }}
                    >
                      {t.label}
                    </span>
                    {modalForm.type === t.key && (
                      <span
                        style={{
                          marginLeft: "auto",
                          color: t.color,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="label">Note (optionnel)</label>
              <input
                className="input-field"
                placeholder="Ex: Inventaire, Vente privée…"
                value={modalForm.note}
                onChange={(e) =>
                  setModalForm((f) => ({ ...f, note: e.target.value }))
                }
                style={{ marginBottom: 0 }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-gold"
                style={{ flex: 2 }}
                onClick={addEvent}
              >
                Ajouter le créneau
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowModal(false)}
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
