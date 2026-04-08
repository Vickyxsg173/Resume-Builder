import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaClipboardUser } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ addtoref }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="z-30 w-full fixed bg-black text-lg text-white flex flex-row justify-between items-center px-[3vw] py-2 shadow-lg backdrop-blur-md bg-opacity-90">
      {/* Logo */}
      <div ref={addtoref} className="flex flex-row items-center gap-2">
        <FaClipboardUser size={24} className="text-orange-500" />
        <h1 className="text-xl font-bold tracking-tighter">ResumeBuild</h1>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex flex-row gap-[2vw] items-center">
        <Link className="hover:text-orange-500 transition-colors" to="/" onClick={closeMenu}>{t("home")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/Build" onClick={closeMenu}>{t("build")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/InterviewPrep" onClick={closeMenu}>{t("interview")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/News" onClick={closeMenu}>{t("news")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/About" onClick={closeMenu}>{t("about")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/Contact" onClick={closeMenu}>{t("contact")}</Link>

        {isAuthenticated && (
          <Link className="hover:text-orange-500 transition-colors" to="/Profile" onClick={closeMenu}>{t("profile")}</Link>
        )}

        {/* Language Switcher */}
        <div className="flex items-center gap-1 text-sm bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("lang", "en"); }}
            className={`px-2 py-[2px] rounded transition leading-none ${i18n.language === 'en' ? 'bg-orange-500 text-white' : 'hover:bg-neutral-700'}`}
          >
            EN
          </button>
          <button
            onClick={() => { i18n.changeLanguage("hi"); localStorage.setItem("hi", "hi"); }}
            className={`px-2 py-[2px] rounded transition leading-none ${i18n.language === 'hi' ? 'bg-orange-500 text-white' : 'hover:bg-neutral-700'}`}
          >
            HI
          </button>
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <img
              src={user.image}
              alt={user.displayName}
              className="w-8 h-8 rounded-full border-2 border-orange-500"
            />
            <button
              onClick={logout}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-all font-medium"
            >
              {t("logout") || "Logout"}
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="flex items-center gap-2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all shadow-md group"
          >
            <FcGoogle size={18} />
            <span>Login</span>
          </button>
        )}
      </div>

      {/* Mobile: Right side (auth avatar + hamburger) */}
      <div className="flex lg:hidden items-center gap-3">
        {isAuthenticated && (
          <img
            src={user.image}
            alt={user.displayName}
            className="w-8 h-8 rounded-full border-2 border-orange-500"
          />
        )}
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-neutral-800 flex flex-col px-6 py-4 gap-4 shadow-xl text-base">
          <Link className="hover:text-orange-500 transition-colors py-1" to="/" onClick={closeMenu}>{t("home")}</Link>
          <Link className="hover:text-orange-500 transition-colors py-1" to="/Build" onClick={closeMenu}>{t("build")}</Link>
          <Link className="hover:text-orange-500 transition-colors py-1" to="/InterviewPrep" onClick={closeMenu}>{t("interview")}</Link>
          <Link className="hover:text-orange-500 transition-colors py-1" to="/News" onClick={closeMenu}>{t("news")}</Link>
          <Link className="hover:text-orange-500 transition-colors py-1" to="/About" onClick={closeMenu}>{t("about")}</Link>
          <Link className="hover:text-orange-500 transition-colors py-1" to="/Contact" onClick={closeMenu}>{t("contact")}</Link>
          {isAuthenticated && (
            <Link className="hover:text-orange-500 transition-colors py-1" to="/Profile" onClick={closeMenu}>{t("profile")}</Link>
          )}

          {/* Language Switcher Mobile */}
          <div className="flex items-center gap-1 text-sm bg-neutral-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("lang", "en"); }}
              className={`px-3 py-1 rounded transition ${i18n.language === 'en' ? 'bg-orange-500 text-white' : 'hover:bg-neutral-700'}`}
            >
              EN
            </button>
            <button
              onClick={() => { i18n.changeLanguage("hi"); localStorage.setItem("hi", "hi"); }}
              className={`px-3 py-1 rounded transition ${i18n.language === 'hi' ? 'bg-orange-500 text-white' : 'hover:bg-neutral-700'}`}
            >
              HI
            </button>
          </div>

          {/* Auth Mobile */}
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); closeMenu(); }}
              className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-all font-medium w-fit"
            >
              {t("logout") || "Logout"}
            </button>
          ) : (
            <button
              onClick={() => { login(); closeMenu(); }}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all shadow-md w-fit"
            >
              <FcGoogle size={18} />
              <span>Login</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;