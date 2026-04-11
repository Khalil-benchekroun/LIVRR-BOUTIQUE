import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { RevealText, RippleButton } from "../components/LuxeAnimations";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

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
          {/* Citation */}
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

          {/* Stats en bas */}
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
