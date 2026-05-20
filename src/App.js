import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Messages from "./pages/Messages";
import Marketing from "./pages/Marketing";
import Clients from "./pages/Clients";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import POS from "./pages/POS";
import Returns from "./pages/Returns";
import Vendors from "./pages/Vendors";
import Categories from "./pages/Categories";
import QRCodePage from "./pages/QRCode";
import Services from "./pages/Services";
import Finance from "./pages/Finance";
import Support from "./pages/Support";
import Tutorial from "./pages/Tutorial";
import GlobalSearch from "./components/GlobalSearch";
import Livraisons from "./pages/Livraisons";
import Avis from "./pages/Avis";
import Calendrier from "./pages/Calendrier";

// ── Theme Context ──
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("livrr_theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("livrr_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Transition entre pages ────────────────────────────────────────
function PageTransition({ children }) {
  const location = useLocation();
  const [displayed, setDisplayed] = React.useState(children);
  const [phase, setPhase] = React.useState("in"); // "in" | "out"

  React.useEffect(() => {
    setPhase("out");
    const t = setTimeout(() => {
      setDisplayed(children);
      setPhase("in");
    }, 180);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div
      style={{
        opacity: phase === "in" ? 1 : 0,
        transform: phase === "in" ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {displayed}
    </div>
  );
}

function PrivateRoute({ children }) {
  const { boutique, loading } = useAuth();
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }
  return boutique ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F2EE" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          width: "calc(100% - 240px)",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {children}
      </main>
    </div>
  );
}

function AppLayoutFixed({ children }) {
  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#F4F2EE" }}>
      <Sidebar />
      <main
        style={{
          marginLeft: "260px",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
                borderRadius: "12px",
                zIndex: 9999,
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/inscription" element={<Onboarding />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/statistiques"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Stats />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/commandes"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Orders />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/commandes-pos"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <POS />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/retours"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Returns />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/produits"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Products />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Categories />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/qrcode"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <QRCodePage />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/marketing"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Marketing />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/vendeurs"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Vendors />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Clients />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Services />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Messages />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/parametres"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Finance />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/support"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Support />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/livraisons"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Livraisons />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/avis"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Avis />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/calendrier"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Calendrier />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tutorial"
              element={
                <PrivateRoute>
                  <Tutorial />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
