import React, { useEffect, useRef, useState } from "react";

/* ============================================================
   LIVRR — Composants d'animations luxe
   
   Exports :
   - RevealText    : titre qui se révèle mot par mot
   - RippleButton  : bouton gold avec ondulation au clic
   - LuxeCard      : card avec hover doré animé
   ============================================================ */

/* ── 1. REVEAL TEXT ──────────────────────────────────────────
   Affiche un titre Cormorant Garamond mot par mot avec fade
   
   Usage :
   <RevealText
     text="Bienvenue sur LIVRR"
     tag="h1"
     style={{ fontSize:"48px", fontWeight:"300" }}
     delay={0}        // délai avant le début (ms)
     stagger={120}    // délai entre chaque mot (ms)
   />
   ──────────────────────────────────────────────────────────── */
export function RevealText({
  text,
  tag = "h1",
  style = {},
  className = "",
  delay = 0,
  stagger = 110,
}) {
  const words = text.split(" ");
  const Tag = tag;

  return (
    <Tag
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        lineHeight: 1.15,
        ...style,
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="word-reveal"
          style={{
            animationDelay: `${delay + i * stagger}ms`,
            marginRight: "0.3em",
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}

/* ── 2. RIPPLE BUTTON ────────────────────────────────────────
   Bouton gold avec ondulation dorée au clic
   
   Usage :
   <RippleButton onClick={handleSubmit} style={{ padding:"14px 32px" }}>
     Se connecter
   </RippleButton>
   
   Props : onClick, style, className, disabled, type, children
   ──────────────────────────────────────────────────────────── */
export function RippleButton({
  children,
  onClick,
  style = {},
  className = "btn-gold",
  disabled = false,
  type = "button",
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;

    // Supprimer anciens ripples
    const existing = btn.querySelectorAll(".ripple-gold");
    existing.forEach((r) => r.remove());

    // Créer le ripple
    const ripple = document.createElement("span");
    ripple.className = "ripple-gold";

    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    btn.appendChild(ripple);

    // Nettoyage après l'animation
    setTimeout(() => ripple.remove(), 650);

    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      className={className}
      disabled={disabled}
      onClick={handleClick}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}
    </button>
  );
}

/* ── 3. LUXE CARD ────────────────────────────────────────────
   Card avec bordure dorée animée au hover
   
   Usage :
   <LuxeCard style={{ padding:"24px" }} onClick={...}>
     Contenu de la card
   </LuxeCard>
   ──────────────────────────────────────────────────────────── */
export function LuxeCard({ children, style = {}, className = "", onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition:
          "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.35s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 40px rgba(201,169,110,0.18), 0 4px 12px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        borderColor: hovered ? "rgba(201,169,110,0.45)" : "rgba(0,0,0,0.07)",
        ...style,
      }}
    >
      {/* Bordure dorée animée */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 1,
          transition: "opacity 0.4s ease",
          opacity: hovered ? 1 : 0,
          background:
            "linear-gradient(135deg, transparent 20%, rgba(201,169,110,0.12) 50%, transparent 80%)",
        }}
      />
      {/* Trait doré en haut */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "1.5px",
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(201,169,110,0.8), transparent)",
          transition: "width 0.45s ease, opacity 0.3s ease",
          width: hovered ? "100%" : "0%",
          opacity: hovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}

/* ── 4. SHIMMER LOGO — hook ──────────────────────────────────
   À utiliser dans Sidebar.js pour le logo LIVRR
   
   Usage : ajouter simplement className="livrr-logo" sur le h1
   (défini dans animations.css)
   ──────────────────────────────────────────────────────────── */
export function LivrrLogo({ style = {} }) {
  return (
    <h1
      className="livrr-logo"
      style={{
        letterSpacing: "6px",
        fontWeight: "400",
        margin: 0,
        fontSize: "22px",
        ...style,
      }}
    >
      LIVRR
    </h1>
  );
}

/* ── 5. REVEAL SECTION ───────────────────────────────────────
   Révèle le contenu quand il entre dans le viewport
   
   Usage :
   <RevealSection delay={200}>
     <div>Contenu qui apparaît au scroll</div>
   </RevealSection>
   ──────────────────────────────────────────────────────────── */
export function RevealSection({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
