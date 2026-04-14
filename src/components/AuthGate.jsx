import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiShieldKeyholeLine, RiMailLine, RiLockPasswordLine, RiUserLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MdAutoAwesome, MdHistory, MdSpeed, MdArrowBack } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const BENEFITS = [
  { icon: <MdAutoAwesome className="text-orange-400" size={20} />, label: "Daily AI-powered resume generation" },
  { icon: <MdHistory className="text-blue-400" size={20} />,      label: "Auto-save & access your resume history" },
  { icon: <MdSpeed className="text-emerald-400" size={20} />,     label: "Track your AI usage across sessions" },
  { icon: <RiShieldKeyholeLine className="text-purple-400" size={20} />, label: "Secure profile with daily credit refresh" },
];

// Auth overlay
const AuthGate = ({ onClose, initialMode = "google" }) => {
  const { login, loginEmail, signupEmail, forgotPassword } = useAuth();
  const { t } = useTranslation();
  const [view, setView] = useState(initialMode); // 'google', 'login-email', 'signup-email', 'forgot-password'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginEmail(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("Login failed. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signupEmail(email, password, displayName);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("Signup failed. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderGoogleAuth = () => (
    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={login}
        className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold px-6 py-3 rounded-xl text-base hover:bg-gray-100 active:scale-95 transition-all duration-150 shadow-lg group"
      >
        <FcGoogle size={22} />
        <span>Continue with Google</span>
      </button>

      <div className="flex items-center gap-4 my-2">
        <div className="h-[1px] flex-1 bg-white/10"></div>
        <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">or</span>
        <div className="h-[1px] flex-1 bg-white/10"></div>
      </div>

      <button
        onClick={() => setView("login-email")}
        className="w-full flex items-center justify-center gap-3 bg-white/5 text-white border border-white/10 font-medium px-6 py-3 rounded-xl text-base hover:bg-white/10 active:scale-95 transition-all duration-150"
      >
        <RiMailLine size={20} className="text-orange-400" />
        <span>Continue with Email</span>
      </button>
    </div>
  );

  const renderEmailForm = (isSignup) => (
    <form onSubmit={isSignup ? handleEmailSignup : handleEmailLogin} className="flex flex-col gap-4 w-full">
      <div className="relative">
        <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
      </div>

      {isSignup && (
        <div className="relative">
          <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Full Name (Optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
      )}

      <div className="relative">
        <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
        >
          {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
        </button>
      </div>

      {!isSignup && (
        <button
          type="button"
          onClick={() => { setView("forgot-password"); setError(""); }}
          className="text-xs text-orange-400 hover:text-orange-300 text-right transition-colors"
        >
          Forgot Password?
        </button>
      )}

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? "Please wait..." : (isSignup ? "Create Account" : "Sign In")}
      </button>

      <div className="flex flex-col gap-2 mt-2">
        <button
          type="button"
          onClick={() => { setView(isSignup ? "login-email" : "signup-email"); setError(""); setSuccessMessage(""); }}
          className="text-neutral-400 hover:text-white text-sm transition-colors"
        >
          {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => { setView("google"); setError(""); setSuccessMessage(""); }}
          className="flex items-center justify-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
        >
          <MdArrowBack /> Back to Google
        </button>
      </div>
    </form>
  );

  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 w-full">
      <div className="relative">
        <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
      </div>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      {successMessage && <p className="text-emerald-400 text-xs text-center">{successMessage}</p>}

      <button
        type="submit"
        disabled={loading || successMessage}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? "Please wait..." : "Send Reset Link"}
      </button>

      <button
        type="button"
        onClick={() => { setView("login-email"); setError(""); setSuccessMessage(""); }}
        className="flex items-center justify-center gap-1 text-neutral-400 hover:text-white text-sm transition-colors"
      >
        <MdArrowBack /> Back to Sign In
      </button>
    </form>
  );


  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: "linear-gradient(145deg, #111 0%, #1a1a1a 100%)",
          border: "1px solid rgba(255,120,40,0.25)",
          boxShadow: "0 0 60px rgba(255,100,0,0.15), 0 25px 50px rgba(0,0,0,0.6)"
        }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ef4444, #a855f7)" }} />

        <div className="p-8 flex flex-col items-center gap-6 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(249,115,22,0.3)" }}
            >
              <RiShieldKeyholeLine size={28} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                {view === 'signup-email' ? 'Create Your Account' : 
                 view === 'forgot-password' ? 'Reset Password' : 'Welcome Back'}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto">
                Join ResumeBuild to unlock professional resume generation and career guidance.
              </p>
            </div>
          </div>

          {/* Dynamic Content */}
          {view === 'google' && (
            <>
              <ul className="w-full flex flex-col gap-3 text-left">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                    {b.icon}
                    <span className="text-neutral-300 text-sm font-medium">{b.label}</span>
                  </li>
                ))}
              </ul>
              {renderGoogleAuth()}
            </>
          )}

          {view === 'login-email' && renderEmailForm(false)}
          {view === 'signup-email' && renderEmailForm(true)}
          {view === 'forgot-password' && renderForgotPassword()}

          {/* Dismiss */}
          {onClose && (
            <button
              onClick={onClose}
              className="mt-2 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
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

