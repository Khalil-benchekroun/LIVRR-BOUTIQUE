import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    navigate("/");
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes loginBg {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes loginCardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
        @keyframes logoIn {
          from { opacity: 0; transform: translateY(-20px) letterSpacing: 20px; }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldLine {
          from { width: 0; opacity: 0; }
          to   { width: 60px; opacity: 1; }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50%       { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
        }
        .login-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 15px;
          color: #fff;
          outline: none;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          letter-spacing: 0.02em;
        }
        .login-input:focus {
          border-color: var(--gold);
          background: rgba(201,169,110,0.08);
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12), 0 8px 32px rgba(0,0,0,0.3);
        }
        .login-input::placeholder { color: rgba(255,255,255,0.25); }
        .login-input:autofill,
        .login-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(15,15,26,0.9) inset;
          -webkit-text-fill-color: #fff;
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: var(--noir);
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(201,169,110,0.4);
        }
        .submit-btn:hover:not(:disabled)::before { left: 100%; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0A0A0F 0%, #0F0F1A 40%, #12121A 60%, #0A0A0F 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Particules décoratives */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              borderRadius: "50%",
              background: "var(--gold)",
              opacity: 0.15,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              animation: `particleFloat ${3 + i * 0.8}s ease-in-out ${
                i * 0.4
              }s infinite`,
            }}
          />
        ))}

        {/* Ligne horizontale décorative */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(201,169,110,0.08), transparent)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            animation: mounted
              ? "loginCardIn 0.7s cubic-bezier(0.34,1.2,0.64,1) forwards"
              : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          {/* LOGO */}
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "48px",
                fontWeight: "400",
                color: "var(--white)",
                letterSpacing: "10px",
                marginBottom: "6px",
                textShadow: "0 0 60px rgba(201,169,110,0.25)",
              }}
            >
              LIVRR
            </div>
            {/* Ligne dorée sous le logo */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, var(--gold), transparent)",
                margin: "12px auto",
                animation: mounted ? "goldLine 1s 0.4s ease forwards" : "none",
                width: mounted ? "80px" : "0",
                opacity: mounted ? 1 : 0,
                transition: "width 1s ease, opacity 1s ease",
              }}
            />
            <div
              style={{
                fontSize: "10px",
                color: "rgba(201,169,110,0.6)",
                textTransform: "uppercase",
                letterSpacing: "4px",
                fontWeight: "500",
              }}
            >
              Espace Boutique
            </div>
          </div>

          {/* CARTE */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "24px",
              padding: "44px",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Reflet haut de carte */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)",
              }}
            />

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "30px",
                color: "var(--white)",
                fontWeight: "300",
                marginBottom: "32px",
                letterSpacing: "0.02em",
              }}
            >
              Connexion
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Email */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    color:
                      focused === "email"
                        ? "var(--gold)"
                        : "rgba(255,255,255,0.35)",
                    display: "block",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: "600",
                    transition: "color 0.2s ease",
                  }}
                >
                  Email
                </label>
                <input
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="votre@boutique.fr"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    color:
                      focused === "password"
                        ? "var(--gold)"
                        : "rgba(255,255,255,0.35)",
                    display: "block",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: "600",
                    transition: "color 0.2s ease",
                  }}
                >
                  Mot de passe
                </label>
                <input
                  className="login-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  placeholder="••••••••••"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{ marginTop: "8px" }}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(0,0,0,0.2)",
                        borderTopColor: "var(--noir)",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Connexion en cours…
                  </span>
                ) : (
                  "Se connecter →"
                )}
              </button>
            </form>

            {/* Lien inscription */}
            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "rgba(255,255,255,0.28)",
                marginTop: "28px",
                lineHeight: "1.5",
              }}
            >
              Pas encore partenaire ?{" "}
              <Link
                to="/inscription"
                style={{
                  color: "var(--gold)",
                  fontWeight: "500",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Rejoindre LIVRR
              </Link>
            </p>
          </div>

          {/* Note démo */}
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "rgba(255,255,255,0.15)",
              marginTop: "24px",
              letterSpacing: "0.03em",
            }}
          >
            💡 Mode démo — entrez n'importe quel email / mot de passe
          </p>
        </div>
      </div>
    </>
  );
}
