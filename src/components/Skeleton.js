import React from "react";

/* ============================================================
   LIVRR — Skeleton Loading Components
   Usage: importer le composant voulu dans chaque page
   ============================================================ */

const pulse = {
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.06) 75%)",
  backgroundSize: "600px 100%",
  animation: "skeletonShimmer 1.6s infinite",
  borderRadius: "6px",
};

// ── Bloc générique ────────────────────────────────────────────────
export function SkeletonBlock({
  width = "100%",
  height = "16px",
  radius = "6px",
  style = {},
}) {
  return (
    <div
      style={{
        ...pulse,
        width,
        height,
        borderRadius: radius,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ── Skeleton Dashboard ────────────────────────────────────────────
export function SkeletonDashboard() {
  return (
    <div className="page">
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <SkeletonBlock
          width="120px"
          height="12px"
          style={{ marginBottom: "12px" }}
        />
        <SkeletonBlock
          width="280px"
          height="44px"
          radius="8px"
          style={{ marginBottom: "10px" }}
        />
        <SkeletonBlock width="200px" height="14px" />
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: "24px 28px" }}>
            <SkeletonBlock
              width="80px"
              height="10px"
              style={{ marginBottom: "16px" }}
            />
            <SkeletonBlock
              width="100px"
              height="36px"
              radius="8px"
              style={{ marginBottom: "10px" }}
            />
            <SkeletonBlock width="60px" height="11px" />
          </div>
        ))}
      </div>

      {/* Alertes */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[1, 2].map((i) => (
          <SkeletonBlock key={i} width="100%" height="46px" radius="12px" />
        ))}
      </div>

      {/* Grille */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "22px",
        }}
      >
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <SkeletonBlock width="180px" height="22px" radius="6px" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <SkeletonBlock width="80px" height="14px" />
              <SkeletonBlock width="100px" height="14px" />
              <SkeletonBlock width="120px" height="14px" />
              <SkeletonBlock width="60px" height="14px" />
              <SkeletonBlock width="80px" height="22px" radius="20px" />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {[1, 2].map((card) => (
            <div key={card} className="card">
              <SkeletonBlock
                width="140px"
                height="20px"
                radius="6px"
                style={{ marginBottom: "18px" }}
              />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  <SkeletonBlock
                    width="38px"
                    height="38px"
                    radius="10px"
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <SkeletonBlock
                      width="120px"
                      height="13px"
                      style={{ marginBottom: "6px" }}
                    />
                    <SkeletonBlock width="80px" height="11px" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton Commandes / liste table ─────────────────────────────
export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonBlock width="200px" height="24px" />
        <SkeletonBlock width="120px" height="36px" radius="8px" />
      </div>
      {/* Header table */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "12px 24px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(0,0,0,0.02)",
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} width={`${100 / cols}%`} height="10px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "16px",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            alignItems: "center",
          }}
        >
          <SkeletonBlock width="90px" height="16px" />
          <SkeletonBlock width="100px" height="14px" />
          <SkeletonBlock width="130px" height="14px" />
          <SkeletonBlock width="60px" height="14px" />
          <SkeletonBlock width="80px" height="22px" radius="20px" />
          <SkeletonBlock width="70px" height="12px" />
        </div>
      ))}
    </div>
  );
}

// ── Skeleton Cards grille ─────────────────────────────────────────
export function SkeletonCards({ count = 6, cols = 3 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols},1fr)`,
        gap: "18px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <SkeletonBlock
            width="100%"
            height="160px"
            radius="10px"
            style={{ marginBottom: "14px" }}
          />
          <SkeletonBlock
            width="70%"
            height="16px"
            style={{ marginBottom: "8px" }}
          />
          <SkeletonBlock
            width="40%"
            height="13px"
            style={{ marginBottom: "12px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SkeletonBlock width="60px" height="20px" radius="6px" />
            <SkeletonBlock width="80px" height="32px" radius="8px" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton Profile / détail ─────────────────────────────────────
export function SkeletonProfile() {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <SkeletonBlock
          width="64px"
          height="64px"
          radius="50%"
          style={{ flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <SkeletonBlock
            width="180px"
            height="20px"
            style={{ marginBottom: "8px" }}
          />
          <SkeletonBlock width="120px" height="14px" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div>
            <SkeletonBlock
              width="80px"
              height="10px"
              style={{ marginBottom: "6px" }}
            />
            <SkeletonBlock width="100%" height="40px" radius="8px" />
          </div>
          <div>
            <SkeletonBlock
              width="80px"
              height="10px"
              style={{ marginBottom: "6px" }}
            />
            <SkeletonBlock width="100%" height="40px" radius="8px" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton Stats / graphique ────────────────────────────────────
export function SkeletonChart() {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <SkeletonBlock width="200px" height="22px" />
        <SkeletonBlock width="160px" height="34px" radius="8px" />
      </div>
      {/* Barres graphique simulé */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          height: "180px",
          marginBottom: "12px",
        }}
      >
        {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65, 88, 50].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{ ...pulse, height: `${h}%`, borderRadius: "4px 4px 0 0" }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonBlock
            key={i}
            width="100%"
            height="10px"
            style={{ flex: 1 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hook useSkeleton ──────────────────────────────────────────────
// Usage: const { loading, startLoading } = useSkeleton(1500)
export function useSkeleton(delay = 1200) {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return { loading };
}
