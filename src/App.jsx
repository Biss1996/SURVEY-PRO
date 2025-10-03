// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Surveys from "./pages/Surveys";
import SurveyFlow from "./pages/SurveyFlow";
import Register from "./pages/Register";
import Packages from "./pages/Packages";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddSurvey from "./pages/AddSurvey";
import SurveyManager from "./pages/SurveyManager";
import AdminLogin from "./pages/AdminLogin";
import { startWithdrawalToasts, stopWithdrawalToasts } from "./lib/withdrawalToast";

/* --- tiny guard so some routes require a signed-in user --- */
function isSignedIn() {
  try {
    const u = JSON.parse(localStorage.getItem("app:user") || "null");
    return !!(u && u.id);
  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {
  return isSignedIn() ? children : <Navigate to="/login" replace />;
}

/* --- API base: for Option A this reads static /db.json --- */
const API_BASE = import.meta.env.BASE_URL || "/";
const SURVEYS_URL = `${API_BASE.replace(/\/+$/, "")}/db.json`;

function App() {
  // Admin-facing surveys state (for manager page)
  const [surveysAdmin, setSurveysAdmin] = useState([]);
  const { isAdmin } = useAdmin();

  // Load surveys for the admin manager on initial mount
  useEffect(() => {
    fetch(SURVEYS_URL)
      .then((res) => res.json())
      .then((data) => {
        // db.json is an object: { surveys: [...] }
        const list = Array.isArray(data) ? data : Array.isArray(data?.surveys) ? data.surveys : [];
        setSurveysAdmin(list);
      })
      .catch(() => toast.error("Failed to fetch surveys"));
  }, []);

  /* ---------- GLOBAL random withdrawal toasts (every 45s, tab visible) ---------- */
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return; // prevent duplicate intervals in StrictMode dev
    startedRef.current = true;
    startWithdrawalToasts();
    return () => stopWithdrawalToasts();
  }, []);

  /* ---------- Admin actions (require a real API; Option A won't persist) ---------- */
  async function addSurvey(newSurvey) {
    try {
      const res = await fetch(SURVEYS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSurvey),
      });
      const data = await res.json();
      setSurveysAdmin((prev) => [data, ...prev]);
      toast.success("Survey added successfully");
    } catch {
      toast.error("Failed to add survey (needs a real backend/json-server).");
    }
  }

  async function updateSurvey(updatedSurvey) {
    try {
      const res = await fetch(`${SURVEYS_URL}/${updatedSurvey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSurvey),
      });
      const data = await res.json();
      setSurveysAdmin((prev) => prev.map((s) => (s.id === data.id ? data : s)));
      toast.success("Survey updated successfully");
    } catch {
      toast.error("Failed to update survey (needs a real backend/json-server).");
    }
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(800px_500px_at_90%_0%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom,#f8fafc,#eef2ff)]">
      <Navbar />
      {/* Fluid, responsive page wrapper */}
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Public survey browsing */}
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/home" element={<Surveys />} />
          {/* Taking a survey requires login — support BOTH paths */}
          <Route
            path="/survey/:id"
            element={
              <ProtectedRoute>
                <SurveyFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys/:id"
            element={
              <ProtectedRoute>
                <SurveyFlow />
              </ProtectedRoute>
            }
          />
          {/* User */}
          <Route path="/packages" element={<Packages />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Admin-only routes */}
          <Route
            path="/add-survey"
            element={isAdmin ? <AddSurvey addSurvey={addSurvey} /> : <Navigate to="/admin-login" replace />}
          />
          <Route
            path="/surveys/manage"
            element={
              isAdmin ? (
                <SurveyManager
                  surveys={surveysAdmin}
                  updateSurvey={updateSurvey}
                  setSurveys={setSurveysAdmin}
                />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {/* Global toast container (top-right) */}
      <ToastContainer position="top-right" autoClose={4500} hideProgressBar />
    </div>
  );
}

export default App;
