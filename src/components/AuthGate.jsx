import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { MdAutoAwesome, MdHistory, MdSpeed } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const BENEFITS = [
  { icon: <MdAutoAwesome className="text-orange-400" size={20} />, label: "Daily AI-powered resume generation" },
  { icon: <MdHistory className="text-blue-400" size={20} />,      label: "Auto-save & access your resume history" },
  { icon: <MdSpeed className="text-emerald-400" size={20} />,     label: "Track your AI usage across sessions" },
  { icon: <RiShieldKeyholeLine className="text-purple-400" size={20} />, label: "Secure profile with daily credit refresh" },
];

/**
 * AuthGate – full-page overlay that blocks AI features when not authenticated.
 * Props:
 *   onClose – optional callback if the page wants to navigate away on close
 */
const AuthGate = ({ onClose }) => {
  const { login } = useAuth();
  const { t } = useTranslation();

  // Prevent body scroll while gate is visible
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #111 0%, #1a1a1a 100%)",
          border: "1px solid rgba(255,120,40,0.25)",
          boxShadow: "0 0 60px rgba(255,100,0,0.15), 0 25px 50px rgba(0,0,0,0.6)"
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ef4444, #a855f7)" }} />

        {/* Body */}
        <div className="p-8 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(249,115,22,0.3)" }}
          >
            <RiShieldKeyholeLine size={32} className="text-orange-400" />
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Sign in to Continue
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto">
              This AI feature requires a free account. Sign in with Google to unlock your personal profile, usage tracking, and history.
            </p>
          </div>

          {/* Benefits */}
          <ul className="w-full flex flex-col gap-3 text-left">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
                {b.icon}
                <span className="text-neutral-300 text-sm">{b.label}</span>
              </li>
            ))}
          </ul>

          {/* Google Sign-in Button */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold px-6 py-3 rounded-xl text-base hover:bg-gray-100 active:scale-95 transition-all duration-150 shadow-lg group"
          >
            <FcGoogle size={22} />
            <span>Continue with Google</span>
          </button>

          {/* Dismiss */}
          {onClose && (
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
