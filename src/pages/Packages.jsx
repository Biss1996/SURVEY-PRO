// src/pages/Packages.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const USERS_KEY = "app:users";
const USER_KEY  = "app:user";

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}

function setLocalUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

function updateUserLocal(id, partial) {
  const users = getLocalUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...partial, updatedAt: Date.now() };
    setLocalUsers(users);
  }
  const cur = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  if (cur && cur.id === id) {
    localStorage.setItem(USER_KEY, JSON.stringify({ ...cur, ...partial }));
  }
}

const TIER_META = {
  free:     { emoji: "🆓",  classes: "bg-green-100 text-green-800" },
  silver:   { emoji: "🥈",  classes: "bg-slate-100 text-slate-700 border border-slate-300" },
  gold:     { emoji: "🥇",  classes: "bg-amber-100 text-amber-800" },
  platinum: { emoji: "💎",  classes: "bg-violet-100 text-violet-800" },
};

function TierPill({ tier, label }) {
  const t = TIER_META[tier] ?? TIER_META.free;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full text-sm font-semibold px-3 py-1 ${t.classes}`}>
      <span aria-hidden="true">{t.emoji}</span>
      <span>{label}</span>
    </span>
  );
}

const PLANS = [
  {
    id: "free",
    name: <TierPill tier="free" label="Free" />,
    priceKsh: 0,
    tier: "free",
    badge: "Starter",
    features: [
      { k: "Surveys per day", v: "1" },
      { k: "Earnings per month", v: "Ksh 3000" },
      { k: "Daily income", v: "Ksh 130" },
      { k: "Minimum withdrawals", v: "Ksh 4500" },
      { k: "Earnings per survey", v: "Ksh 40 – 50" },
    ],
  },
  {
    id: "silver",
    name: <TierPill tier="silver" label="Silver" />,
    priceKsh: 200,
    tier: "silver",
    features: [
      { k: "Surveys per day", v: "5" },
      { k: "Earnings per month", v: "Ksh 8000" },
      { k: "Daily income", v: "Ksh 500" },
      { k: "Minimum withdrawals", v: "Ksh 3000" },
      { k: "Earnings per survey", v: "Ksh 50 – 100" },
    ],
  },
  {
    id: "gold",
    name: <TierPill tier="gold" label="Gold" />,
    priceKsh: 400,
    tier: "gold",
    badge: "Most Popular",
    features: [
      { k: "Surveys per day", v: "10" },
      { k: "Earnings per month", v: "Ksh 15000" },
      { k: "Daily income", v: "Ksh 1000" },
      { k: "Minimum withdrawals", v: "Ksh 2500" },
      { k: "Earnings per survey", v: "Ksh 50 – 100" },
    ],
  },
  {
    id: "platinum",
    name: <TierPill tier="platinum" label="Platinum" />,
    priceKsh: 800,
    tier: "platinum",
    features: [
      { k: "Surveys per day", v: "20" },
      { k: "Earnings per month", v: "Ksh 30000" },
      { k: "Daily income", v: "Ksh 2000" },
      { k: "Minimum withdrawals", v: "Ksh 2000" },
      { k: "Earnings per survey", v: "Ksh 50 – 100" },
    ],
  },
];

export default function Packages() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
  }, []);

function startPlan(plan) {
  if (!user) {
    navigate("/login", { state: { redirectTo: "/packages" } });
    return;
  }

  const planHierarchy = ["free", "silver", "gold", "platinum"];
  const currentPlanIndex = planHierarchy.indexOf(user.tier);
  const selectedPlanIndex = planHierarchy.indexOf(plan.id);

  if (plan.id === "free") {
    if (user.tier === "free") {
      Swal.fire({
        title: "Upgrade to a Paid Plan",
        text: "You are currently on the Free plan. Please choose a paid plan to unlock more surveys and benefits!",
        icon: "info",
        confirmButtonText: "Got it",
      });
      return;
    }
    Swal.fire({
      title: "Downgrade Not Allowed",
      text: "You cannot downgrade to the Free plan. Please choose another plan.",
      icon: "warning",
      confirmButtonText: "Okay",
    });
    return;
  }

  if (selectedPlanIndex > currentPlanIndex) {
    setSelected(plan);
    return;
  }

  Swal.fire({
    title: "Downgrade Not Allowed",
    text: "You cannot downgrade to a lower plan. Please choose a higher plan to upgrade.",
    icon: "warning",
    confirmButtonText: "Okay",
  });
}


  function closeModal() {
    setSelected(null);
  }

  function openValidationModal() {
    setShowValidationModal(true);
  }

  function closeValidationModal() {
    setShowValidationModal(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white p-6 sm:p-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Choose your plan
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base">
            Upgrade to unlock more daily surveys and higher earnings. You can start free and switch anytime.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => {
          const isPopular = p.badge === "Most Popular";
          return (
            <div
              key={p.id}
              className={[
                "group relative rounded-2xl border p-5 sm:p-6 bg-white",
                "shadow-sm hover:shadow-lg transition-shadow",
                isPopular ? "border-indigo-300 ring-1 ring-indigo-200" : "border-slate-200",
              ].join(" ")}
            >
              {p.badge && (
                <span
                  className={[
                    "absolute -top-2 left-4 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                    isPopular ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700",
                  ].join(" ")}
                >
                  {p.badge}
                </span>
              )}
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{p.name}</h3>
                <div className="text-right">
                  <div
                    className={[
                      "font-extrabold tracking-tight",
                      isPopular ? "text-indigo-700" : "text-slate-800",
                    ].join(" ")}
                  >
                    {formatKsh(p.priceKsh)}
                  </div>
                  <div className="text-xs text-slate-500">one-time</div>
                </div>
              </div>
              <div className="my-4 h-px bg-slate-200" />
              <ul className="space-y-2.5">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div className="text-sm">
                      <span className="text-slate-600">{f.k}</span>
                      <span className="px-1 text-slate-400">•</span>
                      <span className="font-semibold text-slate-800">{f.v}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startPlan(p)}
                className={[
                  "mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold",
                  "transition-transform active:translate-y-px",
                  isPopular
                    ? "bg-indigo-600 text-white shadow-[0_6px_18px_rgba(79,70,229,0.35)] hover:bg-indigo-700"
                    : "bg-slate-900 text-white hover:bg-slate-800",
                ].join(" ")}
              >
                Start now <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <MpesaModal
        open={!!selected}
        amount={selected?.priceKsh ?? 0}
        plan={selected}
        onClose={closeModal}
        onVerify={openValidationModal}
      />

      <ValidationModal
        open={showValidationModal}
        amount={selected?.priceKsh ?? 0}
        plan={selected}
        onClose={closeValidationModal}
        onSuccess={(parsed) => {
          try {
            const sub = {
              provider: "mpesa",
              amount: parsed.amount,
              code: parsed.code,
              business: parsed.business,
              paidAt: Date.now(),
            };
            updateUserLocal(user.id, { plan: selected.id, tier: selected.tier, subscription: sub });
            alert(`Subscription successful! You are now on ${selected.tier}.`);
            navigate("/surveys", { replace: true });
          } catch {
            alert("Failed to update your plan. Please try again.");
          }
        }}
      />
    </div>
  );
}

function MpesaModal({ open, amount, plan, onClose, onVerify }) {
  const [msisdn, setMsisdn] = useState("");
  const [code, setCode] = useState("");
  const dialogRef = useRef(null);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  useEffect(() => {
    if (open && dialogRef.current) { dialogRef.current.focus(); }
  }, [open]);
  if (!open) return null;
  const valid = /^0\d{9}$/.test(msisdn) || /^\+?254\d{9}$/.test(msisdn);
  const canPay = (plan?.priceKsh ?? 0) >= 0 && valid && code.trim().length >= 4;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="mpesa-title"
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full sm:max-w-4xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200
                   sm:mx-auto sm:my-12 max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 p-4 border rounded-lg bg-indigo-400">
            <h3 className="text-lg text-gray-950 font-semibold mb-4">Selected Plan</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span>
                  <strong className="text-lg text-gray-900 font-semibold">Plan Name:</strong> {plan?.name}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span>
                  <strong className="text-lg text-gray-900 font-semibold">Surveys:</strong> {plan?.features.find((f) => f.k === "Surveys per day")?.v}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span>
                  <strong className="text-lg text-gray-900 font-semibold">Withdraw Limit:</strong> {plan?.features.find((f) => f.k === "Minimum withdrawals")?.v}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span>
                  <strong className="text-lg text-gray-900 font-semibold">Monthly Income:</strong> {plan?.features.find((f) => f.k === "Earnings per month")?.v}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span>
                  <strong className="text-lg text-gray-900 font-semibold">Due Today:</strong> {formatKsh(plan?.priceKsh)}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg text-gray-900 font-semibold mb-4">How To Pay</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-lg text-gray-900 font-semibold">Go to M-PESA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-lg text-gray-900 font-semibold">Select: Lipa na M-PESA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-lg text-gray-900 font-semibold">Select: Buy Goods and Services</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-lg text-gray-900 font-semibold">
                  Select: Enter Till No: <span className="text-lg text-green-600 font-semibold">9294061</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("9294061").then(() => {
                      alert("Till number copied to clipboard!");
                    });
                  }}
                  className="px-2 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium"
                >
                  Copy
                </button>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-lg text-gray-900 font-semibold">Enter amount: {formatKsh(plan?.priceKsh)}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onVerify}
            className="rounded-xl bg-green-600 px-6 py-2.5 text-white font-semibold hover:bg-green-700"
          >
            Verify Payment
          </button>
        </div>
      </div>
    </div>
  );
}

function ValidationModal({ open, amount, plan, onClose, onSuccess }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  useEffect(() => {
    if (open && dialogRef.current) { dialogRef.current.focus(); }
  }, [open]);
  if (!open) return null;
  function normalizeName(s) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .replace(/[.,\s]+$/g, "")
      .trim()
      .toUpperCase();
  }
  function parseAmountKsh(s) {
    const m = String(s).match(/K(?:ES|sh)\s*([\d,]+(?:\.\d{1,2})?)/i);
    if (!m) return null;
    const num = Number(m[1].replace(/,/g, ""));
    return Number.isFinite(num) ? num : null;
  }
  function parseBusiness(s) {
    const m = String(s).match(
      /paid\s+to\s+([A-Za-z0-9 '&-]+?)(?=(?:\s*(?:[.,]| on\b| at\b|$)))/i
    );
    return m ? normalizeName(m[1]) : null;
  }
  function parseCode(s) {
    const m = String(s).match(/\b([A-Z0-9]{8,})\b\s+Confirmed/i);
    return m ? m[1].toUpperCase() : null;
  }
  function validateMessage() {
    const REQUIRED_NAME = "SMART VENTURES";
    const expectedAmount = Number(amount || 0);
    const code = parseCode(message);
    const amt  = parseAmountKsh(message);
    const biz  = parseBusiness(message);
    if (!code) {
      setError("Could not find a valid M-PESA transaction code (e.g., 'TIH9AQ1T8F').");
      return;
    }
    if (biz !== REQUIRED_NAME) {
      setError(`Business name mismatch. Expected “${REQUIRED_NAME}”, found “${biz || "—"}”.`);
      return;
    }
    if (amt == null) {
      setError("Could not find the paid amount (e.g., 'Ksh 400.00').");
      return;
    }
    const same = Math.abs(amt - expectedAmount) < 0.01;
    if (!same) {
      setError(`Amount mismatch. Expected Ksh ${expectedAmount}, found Ksh ${amt}.`);
      return;
    }
    setError("");
    onSuccess({ code, amount: amt, business: biz });
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="validation-title"
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full sm:max-w-md sm:rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200
                   sm:mx-auto sm:my-12 max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-6"
      >
        <h3 id="validation-title" className="text-xl font-semibold text-gray-900 mb-4">
          Validate Payments
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste the full M-PESA confirmation message below. We’ll verify the business name and the amount.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste your M-PESA message here."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={5}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2.5 text-gray-700 font-semibold hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={validateMessage}
            className="rounded-xl bg-green-600 px-6 py-2.5 text-white font-semibold hover:bg-green-700"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}

function formatKsh(n) {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Ksh ${n}`;
  }
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M8 12l2.5 2.5L16 9" strokeWidth="2" />
    </svg>
  );
}

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" />
    </svg>
  );
}
