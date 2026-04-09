import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
