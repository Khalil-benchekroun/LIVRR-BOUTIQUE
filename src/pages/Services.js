import React, { useState } from "react";
import toast from "react-hot-toast";

const SERVICE_ICONS = {
  "Stylisme Personnel": "👗",
  "Retouche Express": "✂️",
  "Emballage Cadeau": "🎁",
  "Livraison Prioritaire": "⚡",
  "Essayage à Domicile": "🏠",
  "Conseil Mode": "💬",
};

const INITIAL_SERVICES = [
  {
    id: "s1",
    name: "Stylisme Personnel",
    description: "Séance de conseil avec un styliste dédié en boutique.",
    duration: 60,
    price: 120,
    capacity: 3,
    active: true,
    reservations: 8,
  },
  {
    id: "s2",
    name: "Retouche Express",
    description: "Retouches simples réalisées en moins de 2 heures.",
    duration: 30,
    price: 45,
    capacity: 5,
    active: true,
    reservations: 14,
  },
  {
    id: "s3",
    name: "Emballage Cadeau",
    description: "Emballage luxe avec ruban et carte personnalisée.",
    duration: 15,
    price: 18,
    capacity: 10,
    active: true,
    reservations: 23,
  },
  {
    id: "s4",
    name: "Essayage à Domicile",
    description: "Sélection de pièces livrées pour essai à domicile.",
    duration: 90,
    price: 0,
    capacity: 2,
    active: false,
    reservations: 3,
  },
];

const INITIAL_RESERVATIONS = [
  {
    id: "r1",
    service: "Stylisme Personnel",
    client: "Isabelle Moreau",
    email: "i.moreau@email.fr",
    date: "2026-04-07",
    heure: "10:00",
    status: "confirmée",
    note: "Préfère les tons neutres",
  },
  {
    id: "r2",
    service: "Retouche Express",
    client: "Lucas Petit",
    email: "l.petit@email.fr",
    date: "2026-04-07",
    heure: "11:30",
    status: "en attente",
    note: "Raccourcir un pantalon Sandro",
  },
  {
    id: "r3",
    service: "Emballage Cadeau",
    client: "Nadia Benali",
    email: "n.benali@email.fr",
    date: "2026-04-08",
    heure: "14:00",
    status: "confirmée",
    note: "",
  },
  {
    id: "r4",
    service: "Stylisme Personnel",
    client: "Thomas Girard",
    email: "t.girard@email.fr",
    date: "2026-04-09",
    heure: "16:00",
    status: "annulée",
    note: "Client indisponible",
  },
  {
    id: "r5",
    service: "Retouche Express",
    client: "Sophie Lambert",
    email: "s.lambert@email.fr",
    date: "2026-04-10",
    heure: "09:30",
    status: "en attente",
    note: "Ourlet robe de soirée",
  },
];

const EMPTY_SERVICE = {
  name: "",
  description: "",
  duration: 30,
  price: "",
  capacity: 1,
  active: true,
};

export default function Services() {
  const [tab, setTab] = useState("services");
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [showResaModal, setShowResaModal] = useState(false);
  const [resaForm, setResaForm] = useState({
    service: INITIAL_SERVICES[0].name,
    client: "",
    email: "",
    date: "",
    heure: "",
    status: "en attente",
    note: "",
  });

  const totalResas = reservations.length;
  const confirmedResas = reservations.filter(
    (r) => r.status === "confirmée"
  ).length;
  const pendingResas = reservations.filter(
    (r) => r.status === "en attente"
  ).length;
  const activeServices = services.filter((s) => s.active).length;

  const handleServiceSave = () => {
    if (!serviceForm.name || !serviceForm.duration)
      return toast.error("Nom et durée obligatoires");
    if (editService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editService.id
            ? {
                ...serviceForm,
                id: editService.id,
                reservations: editService.reservations,
              }
            : s
        )
      );
      toast.success("Service mis à jour");
    } else {
      setServices((prev) => [
        { ...serviceForm, id: "s" + Date.now(), reservations: 0 },
        ...prev,
      ]);
      toast.success("Service ajouté");
    }
    setShowServiceModal(false);
  };

  const toggleService = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    toast.success("Statut du service mis à jour");
  };

  const handleResaSave = () => {
    if (
      !resaForm.client ||
      !resaForm.date ||
      !resaForm.heure ||
      !resaForm.service
    )
      return toast.error("Tous les champs obligatoires manquants");
    setReservations((prev) => [{ ...resaForm, id: "r" + Date.now() }, ...prev]);
    toast.success("Réservation enregistrée");
    setShowResaModal(false);
    setResaForm({
      service: services[0]?.name || "",
      client: "",
      email: "",
      date: "",
      heure: "",
      status: "en attente",
      note: "",
    });
  };

  const updateResaStatus = (id, status) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast.success("Statut mis à jour");
  };

  const deleteResa = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    toast.success("Réservation supprimée");
  };

  const filteredResas = reservations
    .filter((r) => filterService === "all" || r.service === filterService)
    .filter((r) => filterStatus === "all" || r.status === filterStatus)
    .filter(
      (r) =>
        !search ||
        r.client.toLowerCase().includes(search.toLowerCase()) ||
        r.service.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>
            Services Annexes
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>
            Gestion des prestations & réservations
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {tab === "reservations" && (
            <button
              className="btn-outline"
              style={{ fontSize: "13px" }}
              onClick={() => setShowResaModal(true)}
            >
              + Nouvelle réservation
            </button>
          )}
          {tab === "services" && (
            <button
              className="btn-gold"
              onClick={() => {
                setServiceForm(EMPTY_SERVICE);
                setEditService(null);
                setShowServiceModal(true);
              }}
            >
              + Nouveau service
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Services actifs",
            value: activeServices,
            color: "var(--success)",
            bg: "var(--success-bg)",
            icon: "✦",
          },
          {
            label: "Réservations totales",
            value: totalResas,
            color: "var(--info)",
            bg: "var(--info-bg)",
            icon: "📋",
          },
          {
            label: "Confirmées",
            value: confirmedResas,
            color: "var(--success)",
            bg: "var(--success-bg)",
            icon: "✓",
          },
          {
            label: "En attente",
            value: pendingResas,
            color: "var(--warning)",
            bg: "var(--warning-bg)",
            icon: "⏳",
          },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--gray)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  color: stat.color,
                }}
              >
                {stat.icon}
              </span>
            </div>
            <div
              style={{
                fontSize: "32px",
                fontFamily: "var(--font-display)",
                fontWeight: "400",
                color: "var(--noir)",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "var(--white)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          width: "fit-content",
        }}
      >
        {[
          { key: "services", label: "Catalogue des services" },
          { key: "reservations", label: "Réservations" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 20px",
              borderRadius: "9px",
              border: "none",
              background: tab === t.key ? "var(--noir)" : "transparent",
              color: tab === t.key ? "#fff" : "var(--gray)",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== CATALOGUE SERVICES ===== */}
      {tab === "services" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="card"
              style={{
                opacity: service.active ? 1 : 0.6,
                transition: "var(--transition)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: service.active
                    ? "linear-gradient(90deg, var(--gold), var(--gold-light))"
                    : "#ddd",
                  borderRadius: "18px 18px 0 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "14px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: service.active
                        ? "var(--gold-light)"
                        : "#F0EDE6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {SERVICE_ICONS[service.name] || "🔧"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>
                      {service.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                      {service.reservations} résa. enregistrées
                    </div>
                  </div>
                </div>
                <span
                  className={`badge ${
                    service.active ? "badge-success" : "badge-gray"
                  }`}
                >
                  {service.active ? "Actif" : "Inactif"}
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--gray)",
                  marginBottom: "16px",
                  lineHeight: "1.5",
                }}
              >
                {service.description}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                {[
                  { label: "Durée", value: `${service.duration} min` },
                  {
                    label: "Prix",
                    value:
                      service.price === 0 ? "Gratuit" : `${service.price} €`,
                  },
                  {
                    label: "Capacité / jour",
                    value: `${service.capacity} pl.`,
                  },
                ].map((info) => (
                  <div
                    key={info.label}
                    style={{
                      background: "#F8F7F4",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--gray)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {info.label}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "var(--noir)",
                        marginTop: "2px",
                      }}
                    >
                      {info.value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn-outline"
                  style={{ flex: 1, fontSize: "12px" }}
                  onClick={() => {
                    setEditService(service);
                    setServiceForm({
                      name: service.name,
                      description: service.description,
                      duration: service.duration,
                      price: service.price,
                      capacity: service.capacity,
                      active: service.active,
                    });
                    setShowServiceModal(true);
                  }}
                >
                  Modifier
                </button>
                <button
                  className={service.active ? "btn-danger" : "btn-outline"}
                  style={{ flex: 1, fontSize: "12px" }}
                  onClick={() => toggleService(service.id)}
                >
                  {service.active ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== RÉSERVATIONS ===== */}
      {tab === "reservations" && (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <input
              className="input-field"
              placeholder="Rechercher un client, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "260px", marginBottom: 0 }}
            />
            <select
              className="input-field"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              style={{ maxWidth: "200px", marginBottom: 0 }}
            >
              <option value="all">Tous les services</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ maxWidth: "160px", marginBottom: 0 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmée">Confirmée</option>
              <option value="en attente">En attente</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>CLIENT</th>
                  <th>SERVICE</th>
                  <th>DATE & HEURE</th>
                  <th>NOTE</th>
                  <th>STATUT</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredResas.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--gray)",
                      }}
                    >
                      Aucune réservation trouvée
                    </td>
                  </tr>
                )}
                {filteredResas.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {r.client}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--gray)" }}>
                        {r.email}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>
                          {SERVICE_ICONS[r.service] || "🔧"}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>
                          {r.service}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", fontSize: "13px" }}>
                        {new Date(r.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--gold)",
                          fontWeight: "700",
                        }}
                      >
                        {r.heure}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--gray)",
                          fontStyle: r.note ? "normal" : "italic",
                          maxWidth: "180px",
                        }}
                      >
                        {r.note || "—"}
                      </div>
                    </td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => updateResaStatus(r.id, e.target.value)}
                        style={{
                          border: "none",
                          background: "transparent",
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          color:
                            r.status === "confirmée"
                              ? "var(--success)"
                              : r.status === "en attente"
                              ? "var(--warning)"
                              : "var(--error)",
                          outline: "none",
                        }}
                      >
                        <option value="en attente">⏳ En attente</option>
                        <option value="confirmée">✓ Confirmée</option>
                        <option value="annulée">✕ Annulée</option>
                      </select>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-danger"
                        style={{ fontSize: "12px", padding: "7px 14px" }}
                        onClick={() => deleteResa(r.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL SERVICE */}
      {showServiceModal && (
        <div style={overlayStyle} onClick={() => setShowServiceModal(false)}>
          <div
            className="card"
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              {editService ? "Modifier le service" : "Nouveau service"}
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label className="label">Nom du service</label>
                <input
                  className="input-field"
                  placeholder="Ex: Stylisme Personnel"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input-field"
                  placeholder="Décrivez le service proposé..."
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  style={{ minHeight: "80px", resize: "vertical" }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Durée (min)</label>
                  <input
                    className="input-field"
                    type="number"
                    min="5"
                    placeholder="30"
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Prix (€)</label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    placeholder="0 = Gratuit"
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Capacité / jour</label>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={serviceForm.capacity}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        capacity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px",
                  background: "#F8F7F4",
                  borderRadius: "10px",
                }}
              >
                <div
                  onClick={() =>
                    setServiceForm({
                      ...serviceForm,
                      active: !serviceForm.active,
                    })
                  }
                  style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    background: serviceForm.active ? "var(--success)" : "#ccc",
                    position: "relative",
                    transition: "var(--transition)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: serviceForm.active ? "21px" : "3px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "var(--transition)",
                    }}
                  />
                </div>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Service {serviceForm.active ? "actif" : "inactif"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  className="btn-gold"
                  style={{ flex: 2 }}
                  onClick={handleServiceSave}
                >
                  Sauvegarder
                </button>
                <button
                  className="btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowServiceModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RÉSERVATION */}
      {showResaModal && (
        <div style={overlayStyle} onClick={() => setShowResaModal(false)}>
          <div
            className="card"
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              Nouvelle réservation
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label className="label">Service</label>
                <select
                  className="input-field"
                  value={resaForm.service}
                  onChange={(e) =>
                    setResaForm({ ...resaForm, service: e.target.value })
                  }
                >
                  {services
                    .filter((s) => s.active)
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Nom du client</label>
                  <input
                    className="input-field"
                    placeholder="Prénom Nom"
                    value={resaForm.client}
                    onChange={(e) =>
                      setResaForm({ ...resaForm, client: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="email@domaine.fr"
                    value={resaForm.email}
                    onChange={(e) =>
                      setResaForm({ ...resaForm, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label className="label">Date</label>
                  <input
                    className="input-field"
                    type="date"
                    value={resaForm.date}
                    onChange={(e) =>
                      setResaForm({ ...resaForm, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Heure</label>
                  <input
                    className="input-field"
                    type="time"
                    value={resaForm.heure}
                    onChange={(e) =>
                      setResaForm({ ...resaForm, heure: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label">Note (optionnel)</label>
                <textarea
                  className="input-field"
                  placeholder="Informations complémentaires..."
                  value={resaForm.note}
                  onChange={(e) =>
                    setResaForm({ ...resaForm, note: e.target.value })
                  }
                  style={{ minHeight: "70px", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  className="btn-gold"
                  style={{ flex: 2 }}
                  onClick={handleResaSave}
                >
                  Enregistrer
                </button>
                <button
                  className="btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowResaModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const modalStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "30px",
  width: "100%",
  maxWidth: "520px",
  maxHeight: "90vh",
  overflowY: "auto",
};
