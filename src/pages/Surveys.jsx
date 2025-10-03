// src/pages/Surveys.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SurveyList from "../components/SurveyList";
import PremiumModal from "../components/PremiumModal";
import {
  getUser,
  listSurveysForUser,
  ensureNotCompleted,
  canStartSurvey,
  getRemainingSurveys,
  KEYS,
} from "../lib/surveys";

// Define package limits and benefits
const PACKAGE_DATA = {
  free: {
    limit: 1,
    nextTier: "silver",
    benefits: ["5 surveys/day", "Higher earnings", "Lower withdrawal limits"]
  },
  silver: {
    limit: 5,
    nextTier: "gold",
    benefits: ["10 surveys/day", "Even higher earnings", "Priority surveys"]
  },
  gold: {
    limit: 10,
    nextTier: "platinum",
    benefits: ["20 surveys/day", "Maximum earnings", "All premium surveys"]
  },
  platinum: {
    limit: 20,
    nextTier: null,
    benefits: ["Maximum benefits", "All features unlocked"]
  }
};

export default function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingSurvey, setPendingSurvey] = useState(null);
  const [remainingSurveys, setRemainingSurveys] = useState(0);

  const user = getUser();
  const currentTier = user?.tier || "free";
  const currentPackage = PACKAGE_DATA[currentTier];

  const isPremiumUser = useCallback(() => {
    return user?.plan === "premium" || ["gold", "silver", "platinum"].includes(user?.tier);
  }, [user]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const list = await listSurveysForUser();
      setSurveys(list);
      setRemainingSurveys(getRemainingSurveys(user.id));
      setErr("");
    } catch (e) {
      setErr(e?.message || "Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login", { replace: true });
      return;
    }
    load();
  }, [load, navigate, user?.id]);

  useEffect(() => {
    const onStorage = (e) => {
      if (Object.values(KEYS).includes(e?.key)) {
        load();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") load();
    });

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  const showDailyLimitAlert = useCallback(() => {
    const nextTier = currentPackage.nextTier;
    const benefitsList = currentPackage.benefits.map(benefit =>
      `<li style="margin-left: 20px; margin-bottom: 8px; font-size: 14px">${benefit}</li>`
    ).join('');

    Swal.fire({
      title: `Upgrade to ${nextTier ? nextTier.charAt(0).toUpperCase() + nextTier.slice(1) : 'Premium'}`,
      html: `
        <div style="text-align: left;">
          <p>You've completed all ${currentPackage.limit} surveys available for your ${currentTier} plan today.</p>
          ${nextTier ? `
            <p style="margin-top: 12px; font-weight: 600;">Upgrade to ${nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} for:</p>
            <ul style="margin-top: 8px; padding-left: 20px;">${benefitsList}</ul>
          ` : `
            <p style="margin-top: 12px; font-weight: 600;">You already have our highest plan!</p>
            <p style="font-size: 14px; color: #6b7280;">Check back tomorrow for more surveys</p>
          `}
        </div>
      `,
      icon: "info",
      showCancelButton: !!nextTier,
      confirmButtonText: nextTier ? 'Upgrade Now →' : "OK",
      cancelButtonText: "Stay on Current Plan",
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup',
        confirmButton: 'swal2-confirm bg-indigo-600 hover:bg-indigo-700',
        cancelButton: 'swal2-cancel bg-gray-200 hover:bg-gray-300',
      }
    }).then((result) => {
      if (result.isConfirmed && nextTier) {
        navigate("/packages");
      }
    });
  }, [navigate, currentTier, currentPackage]);

  const handleStart = useCallback((s) => {
    try {
      ensureNotCompleted(s.id);
    } catch (e) {
      Swal.fire({
        title: "Survey Already Completed",
        text: e.message || "This survey is already completed and cannot be taken again.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: 'swal2-confirm bg-amber-600 hover:bg-amber-700'
        }
      });
      return;
    }

    if (!canStartSurvey(s.id)) {
      showDailyLimitAlert();
      return;
    }

    if (s.premium && !isPremiumUser()) {
      setPendingSurvey(s);
      setShowPaywall(true);
      return;
    }

    navigate(`/surveys/${s.id}`);
  }, [navigate, isPremiumUser, showDailyLimitAlert]);

  const handleUpgrade = useCallback(() => {
    setShowPaywall(false);
    navigate("/packages");
  }, [navigate]);

  // Memoize the remaining surveys display
  const remainingDisplay = useMemo(() => {
    if (remainingSurveys > 0) {
      return (
        <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-800 ring-1 ring-blue-200">
          <span className="text-xs">✨</span>
          <span className="font-medium">{remainingSurveys} of {currentPackage.limit} left today</span>
        </div>
      );
    }
    return (
      <button
        onClick={showDailyLimitAlert}
        className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-rose-800 ring-1 ring-rose-200 hover:bg-rose-100 transition-colors"
      >
        <span className="text-xs">⚠️</span>
        <span className="font-medium">
          {currentPackage.nextTier ?
            `Upgrade to ${currentPackage.nextTier.charAt(0).toUpperCase() + currentPackage.nextTier.slice(1)}` :
            "Maximum plan reached"}
        </span>
      </button>
    );
  }, [remainingSurveys, currentPackage, showDailyLimitAlert]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Available Surveys</h3>
          <div className="text-sm">
            {remainingDisplay}
          </div>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-amber-50 ring-1 ring-amber-200">
          <div className="flex items-start gap-2 text-sm text-amber-800">
            <span className="text-base mt-0.5">🔒</span>
            <span>Surveys are filtered based on your location and plan type</span>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="text-sm text-slate-500">Loading surveys...</div>
          ) : err ? (
            <div className="text-sm text-rose-600">{err}</div>
          ) : surveys.length === 0 ? (
            <div className="text-sm text-slate-500 py-4 text-center">
              {remainingSurveys > 0 ?
                "No surveys available at this time. Check back later!" :
                `You've completed all ${currentPackage.limit} surveys available for your ${currentTier} plan today`}
            </div>
          ) : (
            <SurveyList
              surveys={surveys}
              onStart={handleStart}
              disabled={remainingSurveys <= 0}
            />
          )}
        </div>
      </div>

      <PremiumModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgrade}
        survey={pendingSurvey}
        message={
          <div>
            <p className="font-semibold">Premium Survey</p>
            <p className="mt-1 text-sm text-gray-600">
              This is a premium survey. Upgrade to access it and enjoy:
            </p>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
              <li>Higher payouts</li>
              <li>More survey opportunities</li>
              <li>Exclusive content</li>
            </ul>
          </div>
        }
      />
    </div>
  );
}
