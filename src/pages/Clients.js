import React, { useState, useRef } from "react";

const INIT_CLIENTS = [
  {
    _id: "c1",
    name: "Sophie Martin",
    email: "sophie.m@email.com",
    phone: "+33 6 12 34 56 78",
    orders: 8,
    total: 3920,
    lastOrder: "Aujourd'hui",
    loyal: true,
    adresseLivraison: "42 Avenue Montaigne, 75008 Paris",
    adresseFacturation: "42 Avenue Montaigne, 75008 Paris",
  },
  {
    _id: "c2",
    name: "Camille Dupont",
    email: "camille.d@email.com",
    phone: "+33 6 98 76 54 32",
    orders: 5,
    total: 2450,
    lastOrder: "Il y a 3 jours",
    loyal: true,
    adresseLivraison: "18 Rue du Faubourg Saint-Honoré, 75008 Paris",
    adresseFacturation: "5 Boulevard Haussmann, 75009 Paris",
  },
  {
    _id: "c3",
    name: "Marie Laurent",
    email: "marie.l@email.com",
    phone: "+33 6 11 22 33 44",
    orders: 12,
    total: 6780,
    lastOrder: "Il y a 1 semaine",
    loyal: true,
    adresseLivraison: "12 Place Vendôme, 75001 Paris",
    adresseFacturation: "12 Place Vendôme, 75001 Paris",
  },
  {
    _id: "c4",
    name: "Julie Petit",
    email: "julie.p@email.com",
    phone: "+33 6 55 66 77 88",
    orders: 2,
    total: 890,
    lastOrder: "Il y a 2 semaines",
    loyal: false,
    adresseLivraison: "",
    adresseFacturation: "",
  },
  {
    _id: "c5",
    name: "Emma Bernard",
    email: "emma.b@email.com",
    phone: "+33 6 99 88 77 66",
    orders: 1,
    total: 650,
    lastOrder: "Il y a 1 mois",
    loyal: false,
    adresseLivraison: "",
    adresseFacturation: "",
  },
];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2)
    return { clients: [], errors: ["Fichier vide ou invalide"] };
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/"/g, ""));
  const clients = [],
    errors = [];
  lines.slice(1).forEach((line, i) => {
    if (!line.trim()) return;
    const vals = line.split(",").map((v) => v.trim().replace(/"/g, ""));
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = vals[idx] || "";
    });
    const name = obj["nom"] || obj["name"] || "";
    const email = obj["email"] || obj["e-mail"] || "";
    const phone = obj["téléphone"] || obj["telephone"] || obj["phone"] || "";
    const adresseLivraison =
      obj["adresse livraison"] || obj["livraison"] || obj["adresse"] || "";
    const adresseFacturation =
      obj["adresse facturation"] || obj["facturation"] || adresseLivraison;
    if (!name || !email) {
      errors.push(`Ligne ${i + 2} ignorée : nom ou email manquant`);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(`Ligne ${i + 2} : email invalide (${email})`);
      return;
    }
    clients.push({
      _id: `import_${Date.now()}_${i}`,
      name,
      email,
      phone,
      adresseLivraison,
      adresseFacturation,
      orders: 0,
      total: 0,
      lastOrder: "Jamais commandé",
      loyal: false,
      imported: true,
    });
  });
  return { clients, errors };
}

const EMPTY_CLIENT = {
  name: "",
  email: "",
  phone: "",
  adresseLivraison: "",
  adresseFacturation: "",
  memeAdresse: true,
};

export default function Clients() {
  const [clients, setClients] = useState(INIT_CLIENTS);
  const [search, setSearch] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [newClient, setNewClient] = useState(EMPTY_CLIENT);
  const fileRef = useRef();

  const filtered = clients.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setImportResult({
        clients: [],
        errors: ["Format invalide. Veuillez importer un fichier .CSV"],
      });
      return;
    }
    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImportResult(parseCSV(e.target.result));
      setImporting(false);
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    const newOnes = importResult.clients.filter(
      (ic) => !clients.some((c) => c.email === ic.email)
    );
    const dupes = importResult.clients.length - newOnes.length;
    setClients((prev) => [...prev, ...newOnes]);
    setImportResult(null);
    setShowImport(false);
    alert(
      `✓ ${newOnes.length} client(s) importé(s)${
        dupes > 0 ? ` · ${dupes} doublon(s) ignoré(s)` : ""
      }`
    );
  };

  const addManual = () => {
    if (!newClient.name || !newClient.email) return;
    const adresseFacturation = newClient.memeAdresse
      ? newClient.adresseLivraison
      : newClient.adresseFacturation;
    setClients((prev) => [
      ...prev,
      {
        _id: `manual_${Date.now()}`,
        ...newClient,
        adresseFacturation,
        orders: 0,
        total: 0,
        lastOrder: "Jamais commandé",
        loyal: false,
      },
    ]);
    setNewClient(EMPTY_CLIENT);
    setShowAdd(false);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "nom",
      "email",
      "téléphone",
      "adresse livraison",
      "adresse facturation",
      "commandes",
      "total dépensé",
      "dernière commande",
      "fidèle",
    ];
    const rows = clients.map((c) => [
      c.name,
      c.email,
      c.phone || "",
      c.adresseLivraison || "",
      c.adresseFacturation || "",
      c.orders,
      c.total,
      c.lastOrder,
      c.loyal ? "Oui" : "Non",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `clients_livrr_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const downloadTemplate = () => {
    const csv =
      "nom,email,téléphone,adresse livraison,adresse facturation\nSophie Martin,sophie@email.com,+33 6 12 34 56 78,42 Avenue Montaigne 75008 Paris,42 Avenue Montaigne 75008 Paris";
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "modele_clients_livrr.csv";
    a.click();
  };

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
            Clientèle
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "44px",
              fontWeight: "300",
              lineHeight: 1.1,
            }}
          >
            Clients
          </h1>
          <p
            style={{ color: "var(--gray)", fontSize: "14px", marginTop: "4px" }}
          >
            {clients.length} clients · {clients.filter((c) => c.loyal).length}{" "}
            fidèles
            {clients.filter((c) => c.imported).length > 0 && (
              <span
                style={{
                  marginLeft: "8px",
                  color: "var(--gold)",
                  fontWeight: "600",
                }}
              >
                · {clients.filter((c) => c.imported).length} importés
              </span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-outline" onClick={exportCSV}>
            ↓ Exporter
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              setShowAdd(!showAdd);
              setShowImport(false);
            }}
          >
            + Ajouter
          </button>
          <button
            className="btn-gold"
            onClick={() => {
              setShowImport(!showImport);
              setShowAdd(false);
              setImportResult(null);
            }}
          >
            ↑ Importer
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Clients actifs",
            value: clients.length.toString(),
            sub: "Total base",
          },
          {
            label: "Panier moyen",
            value:
              "€" +
              Math.round(
                clients.reduce((s, c) => s + c.total, 0) /
                  Math.max(clients.filter((c) => c.orders > 0).length, 1)
              ).toLocaleString("fr-FR"),
            sub: "Par client actif",
          },
          {
            label: "Taux de fidélisation",
            value:
              Math.round(
                (clients.filter((c) => c.loyal).length /
                  Math.max(clients.length, 1)) *
                  100
              ) + "%",
            sub: "Clients fidèles",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: "28px" }}>
              {s.value}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* PANEL AJOUT */}
      {showAdd && (
        <div
          className="card"
          style={{
            marginBottom: "24px",
            border: "1.5px solid rgba(201,169,110,0.3)",
            animation: "scaleIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "400",
              }}
            >
              Ajouter un client
            </h3>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "var(--gray)",
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label className="label">Nom complet *</label>
              <input
                className="input-field"
                placeholder="Sophie Martin"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label className="label">Email *</label>
              <input
                className="input-field"
                placeholder="sophie@email.com"
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input
                className="input-field"
                placeholder="+33 6 12 34 56 78"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>

          {/* Adresses */}
          <div style={{ marginBottom: "16px" }}>
            <label className="label">Adresse de livraison</label>
            <input
              className="input-field"
              placeholder="42 Avenue Montaigne, 75008 Paris"
              value={newClient.adresseLivraison}
              onChange={(e) =>
                setNewClient({ ...newClient, adresseLivraison: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />

            {/* Toggle même adresse */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={() =>
                setNewClient((n) => ({ ...n, memeAdresse: !n.memeAdresse }))
              }
            >
              <div
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "10px",
                  background: newClient.memeAdresse
                    ? "var(--success)"
                    : "#E5E7EB",
                  position: "relative",
                  transition: "0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: "3px",
                    left: newClient.memeAdresse ? "19px" : "3px",
                    transition: "0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <span style={{ fontSize: "13px", color: "var(--gray)" }}>
                Adresse de facturation identique à la livraison
              </span>
            </div>

            {!newClient.memeAdresse && (
              <>
                <label className="label">Adresse de facturation</label>
                <input
                  className="input-field"
                  placeholder="5 Boulevard Haussmann, 75009 Paris"
                  value={newClient.adresseFacturation}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      adresseFacturation: e.target.value,
                    })
                  }
                  style={{ marginBottom: 0 }}
                />
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn-gold"
              onClick={addManual}
              disabled={!newClient.name || !newClient.email}
            >
              Ajouter le client
            </button>
            <button className="btn-outline" onClick={() => setShowAdd(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* PANEL IMPORT */}
      {showImport && (
        <div
          className="card"
          style={{
            marginBottom: "24px",
            border: "1.5px solid rgba(201,169,110,0.3)",
            animation: "scaleIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--gold)",
                  marginBottom: "4px",
                }}
              >
                Importation CSV
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: "400",
                }}
              >
                Importer une liste clients
              </h3>
            </div>
            <button
              onClick={() => {
                setShowImport(false);
                setImportResult(null);
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "var(--gray)",
              }}
            >
              ✕
            </button>
          </div>
          {!importResult ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${
                    dragOver ? "var(--gold)" : "rgba(0,0,0,0.15)"
                  }`,
                  borderRadius: "14px",
                  padding: "48px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver
                    ? "rgba(201,169,110,0.04)"
                    : "rgba(0,0,0,0.01)",
                  transition: "all 0.2s",
                  marginBottom: "16px",
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {importing ? (
                  <div>
                    <div
                      className="spinner"
                      style={{ margin: "0 auto 12px" }}
                    />
                    <p style={{ color: "var(--gray)" }}>Analyse en cours…</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: "40px", marginBottom: "14px" }}>
                      📂
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "15px",
                        marginBottom: "6px",
                      }}
                    >
                      Glissez votre fichier CSV ici
                    </div>
                    <div
                      style={{
                        color: "var(--gray)",
                        fontSize: "13px",
                        marginBottom: "16px",
                      }}
                    >
                      ou cliquez pour sélectionner
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        background: "var(--gray-bg)",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        color: "var(--gray)",
                      }}
                    >
                      Format accepté : .CSV
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  background: "var(--gray-bg)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      marginBottom: "4px",
                    }}
                  >
                    Format attendu
                  </div>
                  <code style={{ fontSize: "12px", color: "var(--gray)" }}>
                    nom, email, téléphone, adresse livraison, adresse
                    facturation
                  </code>
                </div>
                <button
                  className="btn-outline"
                  style={{ fontSize: "12px", padding: "8px 14px" }}
                  onClick={downloadTemplate}
                >
                  ↓ Modèle
                </button>
              </div>
            </>
          ) : (
            <div>
              {importResult.clients.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      marginBottom: "10px",
                      color: "var(--success)",
                    }}
                  >
                    ✓ {importResult.clients.length} client(s) détecté(s)
                  </div>
                  <div
                    style={{
                      border: "1px solid rgba(0,0,0,0.07)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Tél.</th>
                          <th>Livraison</th>
                          <th>Facturation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.clients.slice(0, 10).map((c, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: "600" }}>{c.name}</td>
                            <td
                              style={{ color: "var(--gray)", fontSize: "13px" }}
                            >
                              {c.email}
                            </td>
                            <td
                              style={{ color: "var(--gray)", fontSize: "13px" }}
                            >
                              {c.phone || "—"}
                            </td>
                            <td
                              style={{ color: "var(--gray)", fontSize: "12px" }}
                            >
                              {c.adresseLivraison || "—"}
                            </td>
                            <td
                              style={{ color: "var(--gray)", fontSize: "12px" }}
                            >
                              {c.adresseFacturation || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importResult.clients.length > 10 && (
                      <div
                        style={{
                          padding: "8px 18px",
                          fontSize: "12px",
                          color: "var(--gray)",
                          borderTop: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        + {importResult.clients.length - 10} autres…
                      </div>
                    )}
                  </div>
                </div>
              )}
              {importResult.errors.length > 0 && (
                <div
                  style={{
                    background: "var(--error-bg)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "var(--error)",
                      marginBottom: "6px",
                    }}
                  >
                    ⚠️ {importResult.errors.length} avertissement(s)
                  </div>
                  {importResult.errors.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: "var(--error)",
                        opacity: 0.8,
                      }}
                    >
                      {e}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                {importResult.clients.length > 0 && (
                  <button
                    className="btn-gold"
                    style={{ flex: 1 }}
                    onClick={confirmImport}
                  >
                    Importer {importResult.clients.length} client(s)
                  </button>
                )}
                <button
                  className="btn-outline"
                  onClick={() => setImportResult(null)}
                >
                  ← Autre fichier
                </button>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportResult(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--gray)",
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input
            className="input-field"
            placeholder="🔍 Rechercher un client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "300px", marginBottom: 0 }}
          />
          <span style={{ fontSize: "13px", color: "var(--gray)" }}>
            {filtered.length} résultat(s)
          </span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse livraison</th>
              <th>Adresse facturation</th>
              <th>Commandes</th>
              <th>Total</th>
              <th>Profil</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c._id}
                style={{ cursor: "pointer" }}
                onClick={() => setShowDetail(c)}
              >
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: c.imported
                          ? "rgba(201,169,110,0.15)"
                          : "var(--gold-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: "14px",
                        color: "var(--gold-dark)",
                        flexShrink: 0,
                      }}
                    >
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        {c.name}
                      </div>
                      {c.imported && (
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--gold)",
                            fontWeight: "600",
                          }}
                        >
                          IMPORTÉ
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--gray)", fontSize: "13px" }}>
                  {c.email}
                </td>
                <td style={{ color: "var(--gray)", fontSize: "13px" }}>
                  {c.phone || "—"}
                </td>
                <td
                  style={{
                    color: "var(--gray)",
                    fontSize: "12px",
                    maxWidth: "160px",
                  }}
                >
                  {c.adresseLivraison ? (
                    <span title={c.adresseLivraison}>
                      📦{" "}
                      {c.adresseLivraison.length > 25
                        ? c.adresseLivraison.slice(0, 25) + "…"
                        : c.adresseLivraison}
                    </span>
                  ) : (
                    <span style={{ opacity: 0.4 }}>—</span>
                  )}
                </td>
                <td
                  style={{
                    color: "var(--gray)",
                    fontSize: "12px",
                    maxWidth: "160px",
                  }}
                >
                  {c.adresseFacturation ? (
                    c.adresseFacturation === c.adresseLivraison ? (
                      <span
                        style={{ color: "var(--gray-light)", fontSize: "11px" }}
                      >
                        = Livraison
                      </span>
                    ) : (
                      <span title={c.adresseFacturation}>
                        🧾{" "}
                        {c.adresseFacturation.length > 25
                          ? c.adresseFacturation.slice(0, 25) + "…"
                          : c.adresseFacturation}
                      </span>
                    )
                  ) : (
                    <span style={{ opacity: 0.4 }}>—</span>
                  )}
                </td>
                <td style={{ fontWeight: "500" }}>{c.orders}</td>
                <td style={{ fontWeight: "600" }}>
                  {c.total > 0 ? "€" + c.total.toLocaleString("fr-FR") : "—"}
                </td>
                <td>
                  <span
                    className={`badge ${c.loyal ? "badge-gold" : "badge-gray"}`}
                  >
                    {c.loyal ? "⭐ Fidèle" : "Nouveau"}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "var(--gray)",
                  }}
                >
                  Aucun client trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL CLIENT */}
      {showDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowDetail(null)}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "var(--gold-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "var(--gold-dark)",
                  flexShrink: 0,
                }}
              >
                {showDetail.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: "400",
                  }}
                >
                  {showDetail.name}
                </h3>
                <div style={{ fontSize: "13px", color: "var(--gray)" }}>
                  {showDetail.email} · {showDetail.phone || "—"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {[
                { label: "Commandes", value: showDetail.orders },
                {
                  label: "Total dépensé",
                  value:
                    showDetail.total > 0
                      ? "€" + showDetail.total.toLocaleString("fr-FR")
                      : "—",
                },
                { label: "Dernière commande", value: showDetail.lastOrder },
                {
                  label: "Profil",
                  value: showDetail.loyal ? "⭐ Fidèle" : "Nouveau",
                },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    background: "#F8F7F4",
                    borderRadius: "10px",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--gray)",
                      textTransform: "uppercase",
                      fontWeight: "700",
                      marginBottom: "4px",
                    }}
                  >
                    {info.label}
                  </div>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>
                    {info.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Adresses */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--gray)",
                  marginBottom: "12px",
                }}
              >
                Adresses
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background: "rgba(201,169,110,0.06)",
                    border: "1px solid rgba(201,169,110,0.2)",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "var(--gold-dark)",
                      marginBottom: "6px",
                    }}
                  >
                    📦 LIVRAISON
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
                    {showDetail.adresseLivraison || (
                      <span style={{ color: "var(--gray)" }}>
                        Non renseignée
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.07)",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "var(--gray)",
                      marginBottom: "6px",
                    }}
                  >
                    🧾 FACTURATION
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
                    {showDetail.adresseFacturation ? (
                      showDetail.adresseFacturation ===
                      showDetail.adresseLivraison ? (
                        <span
                          style={{ color: "var(--gray)", fontStyle: "italic" }}
                        >
                          Identique à la livraison
                        </span>
                      ) : (
                        showDetail.adresseFacturation
                      )
                    ) : (
                      <span style={{ color: "var(--gray)" }}>
                        Non renseignée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => setShowDetail(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
