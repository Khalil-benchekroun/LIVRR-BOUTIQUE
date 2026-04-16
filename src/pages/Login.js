import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { RevealText, RippleButton } from "../components/LuxeAnimations";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ── SVG Icons réseaux sociaux ──────────────────────────────────────
const IconInstagram = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const IconFacebook = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTiktok = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12C6.79086 12 5 13.7909 5 16C5 18.2091 6.79086 20 9 20C11.2091 20 13 18.2091 13 16V4C13.6667 5.33333 15.2 8 19 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/livrr_officiel/",
    Icon: IconInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1BHZNBjNig/",
    Icon: IconFacebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@livrr.officiel?_r=1&_t=ZN-95aXSqovZXq",
    Icon: IconTiktok,
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return toast.error("Veuillez remplir tous les champs");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenue sur votre espace boutique", {
        style: {
          fontFamily: "DM Sans, sans-serif",
          background: "#0A0A0F",
          color: "#fff",
          border: "1px solid rgba(201,169,110,0.3)",
        },
        icon: "✦",
      });
      navigate("/");
    } catch (err) {
      toast.error("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "var(--font-body)",
        background: "#0A0A0F",
        overflow: "hidden",
      }}
    >
      {/* ── GAUCHE : formulaire ── */}
      <div
        style={{
          width: "480px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 56px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "56px" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
              fontSize: "28px",
              letterSpacing: "6px",
              fontWeight: "400",
              marginBottom: "6px",
            }}
          >
            LIVRR
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Espace Boutique
          </div>
        </div>

        {/* Titre */}
        <div style={{ marginBottom: "40px" }}>
          <RevealText
            text="Connexion"
            tag="h1"
            style={{
              fontSize: "40px",
              fontWeight: "300",
              color: "#fff",
              letterSpacing: "-0.01em",
              marginBottom: "10px",
            }}
            delay={100}
            stagger={150}
          />
          <p
            className="letter-fade"
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.6,
              animationDelay: "400ms",
            }}
          >
            Accédez à votre tableau de bord boutique LIVRR.
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="boutique@livrr.fr"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "8px",
                border: `1px solid ${
                  focused === "email"
                    ? "rgba(201,169,110,0.6)"
                    : "rgba(255,255,255,0.08)"
                }`,
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
                boxShadow:
                  focused === "email"
                    ? "0 0 0 3px rgba(201,169,110,0.08)"
                    : "none",
              }}
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 44px 14px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${
                    focused === "password"
                      ? "rgba(201,169,110,0.6)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s",
                  boxShadow:
                    focused === "password"
                      ? "0 0 0 3px rgba(201,169,110,0.08)"
                      : "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "13px",
                }}
              >
                {showPassword ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>

          {/* Mot de passe oublié */}
          <div style={{ textAlign: "right" }}>
            <button
              type="button"
              style={{
                fontSize: "12px",
                color: "rgba(201,169,110,0.6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit */}
          <RippleButton
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "8px",
              background: loading ? "rgba(201,169,110,0.5)" : "var(--gold)",
              color: "var(--noir)",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: loading ? "wait" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Connexion en cours…" : "Se connecter"}
          </RippleButton>
        </form>

        {/* Lien inscription */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
            Pas encore partenaire ?{" "}
          </span>
          <a
            href="/inscription"
            style={{
              fontSize: "13px",
              color: "var(--gold)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Rejoindre LIVRR →
          </a>
        </div>

        {/* ── RÉSEAUX SOCIAUX ── */}
        <div style={{ marginTop: "36px", textAlign: "center" }}>
          {/* Séparateur */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Suivez-nous
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.06)",
              }}
            />
          </div>

          {/* Icônes */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                onMouseEnter={() => setHoveredSocial(label)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  border: `1px solid ${
                    hoveredSocial === label
                      ? "rgba(201,169,110,0.5)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background:
                    hoveredSocial === label
                      ? "rgba(201,169,110,0.08)"
                      : "rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    hoveredSocial === label
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.3)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                  transform:
                    hoveredSocial === label ? "translateY(-2px)" : "none",
                  boxShadow:
                    hoveredSocial === label
                      ? "0 4px 16px rgba(201,169,110,0.12)"
                      : "none",
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "56px",
            right: "56px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.15)",
              lineHeight: 1.6,
            }}
          >
            Plateforme réservée aux boutiques partenaires LIVRR.
            <br />
            Livraison luxe en moins d'une heure à Paris.
          </p>
        </div>
      </div>

      {/* ── DROITE : visuel luxe ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Fond gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0F0F1A 0%, #1A1208 50%, #0A0A0F 100%)",
          }}
        />

        {/* Motif géométrique décoratif */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.06,
          }}
          viewBox="0 0 600 800"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#C9A96E"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="600" height="800" fill="url(#grid)" />
          <circle
            cx="300"
            cy="400"
            r="200"
            fill="none"
            stroke="#C9A96E"
            strokeWidth="0.5"
          />
          <circle
            cx="300"
            cy="400"
            r="300"
            fill="none"
            stroke="#C9A96E"
            strokeWidth="0.5"
          />
        </svg>

        {/* Halo doré central */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Contenu central */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "380px" }}>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(201,169,110,0.4)",
                margin: "0 auto 32px",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: "300",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                fontStyle: "italic",
                marginBottom: "24px",
              }}
            >
              « Le luxe, c'est la précision. Chaque minute compte. »
            </p>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(201,169,110,0.4)",
                margin: "0 auto 32px",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.5)",
              }}
            >
              LIVRR · Paris
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              position: "absolute",
              bottom: "52px",
              display: "flex",
              gap: "48px",
            }}
          >
            {[
              { value: "< 1h", label: "Délai de livraison" },
              { value: "20%", label: "Commission unique" },
              { value: "24/7", label: "Support boutique" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: "300",
                    color: "var(--gold)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "6px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Séparateur vertical */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "10%",
            bottom: "10%",
            width: "1px",
            background:
              "linear-gradient(180deg, transparent, rgba(201,169,110,0.2), transparent)",
          }}
        />
      </div>
    </div>
  );
}
