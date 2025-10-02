// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, isAdmin as getIsAdmin, logout, AUTH_KEYS } from "../lib/auth";
import { USER_KEY } from "../lib/surveys";

export default function Navbar() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  // keep in sync on login/logout/user switch & tab focus
  useEffect(() => {
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === AUTH_KEYS?.AUTH_VERSION_KEY || e.key === USER_KEY) {
        setUser(getCurrentUser());
      }
    };
    const onFocus = () => setUser(getCurrentUser());

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const signedIn = !!user;
  const isAdmin = getIsAdmin?.(user) ?? getIsAdmin?.();

  const handleLogout = () => {
    logout();
    setUser(null);
    setOpen(false);
    // redirect away from protected routes
    if (loc.pathname.startsWith("/dashboard") || loc.pathname.startsWith("/admin")) {
      nav("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="h-9 w-9 grid place-items-center rounded-xl bg-indigo-600 text-white font-bold">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight">Survey Extra</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <NavLink to="/surveys" active={loc.pathname.startsWith("/surveys")}>
            Surveys
          </NavLink>

          {/* Renamed Success Stories -> Home */}
          <NavLink
            to="/success-stories"
            active={loc.pathname.startsWith("/success-stories")}
          >
            Home
          </NavLink>

          {signedIn && (
            <NavLink to="/dashboard" active={loc.pathname.startsWith("/dashboard")}>
              Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" active={loc.pathname.startsWith("/admin")}>
              Admin
            </NavLink>
          )}

          {!signedIn && (
            <>
              <NavLink to="/register" active={loc.pathname === "/register"}>
                Get Started
              </NavLink>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl border px-3 py-2 font-medium hover:bg-slate-50"
              >
                Log in
              </Link>
            </>
          )}

          {signedIn && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-xl border px-3 py-2 font-medium hover:bg-slate-50"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile burger */}
        <button
          className="sm:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2 text-sm">
            <MobileLink to="/surveys" onClick={() => setOpen(false)}>
              Surveys
            </MobileLink>

            {/* Renamed Success Stories -> Home */}
            <MobileLink to="/success-stories" onClick={() => setOpen(false)}>
              Home
            </MobileLink>

            {signedIn && (
              <MobileLink to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </MobileLink>
            )}

            {isAdmin && (
              <MobileLink to="/admin" onClick={() => setOpen(false)}>
                Admin
              </MobileLink>
            )}

            {!signedIn && (
              <>
                <MobileLink to="/register" onClick={() => setOpen(false)}>
                  Get Started
                </MobileLink>
                <MobileLink to="/login" onClick={() => setOpen(false)}>
                  Log in
                </MobileLink>
              </>
            )}

            {signedIn && (
              <button
                onClick={handleLogout}
                className="text-left rounded-lg border px-3 py-2 hover:bg-slate-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`rounded-lg px-3 py-1.5 transition-colors ${
        active ? "text-indigo-700 font-semibold" : "text-slate-700 hover:text-indigo-600"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="py-1.5 rounded-md px-2 hover:bg-slate-50">
      {children}
    </Link>
  );
}
