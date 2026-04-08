import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaClipboardUser } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ addtoref }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="z-30 w-full fixed bg-black text-lg text-white flex flex-row justify-between items-center px-[3vw] py-2 shadow-lg backdrop-blur-md bg-opacity-90">
      <div ref={addtoref} className="flex flex-row items-center gap-2">
        <FaClipboardUser size={24} className="text-orange-500" />
        <h1 className="text-xl font-bold tracking-tighter">ResumeBuild</h1>
      </div>

      <div className="flex flex-row gap-[2vw] items-center">
        <Link className="hover:text-orange-500 transition-colors" to="/">{t("home")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/Build">{t("build")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/InterviewPrep">{t("interview")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/News">{t("news")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/About">{t("about")}</Link>
        <Link className="hover:text-orange-500 transition-colors" to="/Contact">{t("contact")}</Link>
        
        {isAuthenticated && (
          <Link className="hover:text-orange-500 transition-colors" to="/Profile">{t("profile")}</Link>
        )}

        <div className="flex items-center gap-1 text-sm bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => {
              i18n.changeLanguage("en");
              localStorage.setItem("lang", "en");
            }}
            className={`px-2 py-[2px] rounded transition leading-none ${i18n.language === 'en' ? 'bg-orange-500 text-white' : 'hover:bg-neutral-700'}`}
          >
            EN
          </button>
          <button
            onClick={() => {
              i18n.changeLanguage("hi");
              localStorage.setItem("hi", "hi");
            }}
            className={`px-2 py-[2px] rounded transition leading-none ${i18n.language === 'hi' ? 'bg-orange-500 text-white' : 'hover:bg-neutral-700'}`}
          >
            HI
          </button>
        </div>

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
    </nav>
  );
};

export default Navbar;