import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import {
  FaUserEdit, FaSave, FaTrash, FaBriefcase,
  FaFileAlt, FaCrown, FaSignInAlt, FaChartBar,
  FaCalendarAlt, FaCheckCircle, FaInbox,
  FaTimes, FaDownload, FaSearch, FaUserCog
} from 'react-icons/fa';

const StatCard = ({ icon, label, value, max, color, remainingText }) => {
  const pct = max && max !== Infinity ? Math.min((value / max) * 100, 100) : 100;
  const isUnlimited = max === Infinity || max === null;

  return (
    <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`text-${color}-400 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider`}>
          {icon} {label}
        </div>
        {isUnlimited && (
          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <FaCrown size={10} /> Admin
          </span>
        )}
      </div>
      <div className="text-3xl font-black mb-2">
        {value}
        <span className="text-lg font-normal text-neutral-500 ml-1">
          / {isUnlimited ? '∞' : max}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-${color}-500 rounded-full`}
          />
        </div>
      )}
      {!isUnlimited && (
        <p className="text-xs text-neutral-500 mt-1.5">
          {max - value} {remainingText}
        </p>
      )}
    </div>
  );
};

const AdminUserCard = ({ user, onUpdate, isUpdating, t }) => {
  const [tier, setTier] = useState(user.premiumType || 'none');
  const [genLimit, setGenLimit] = useState(user.generationLimit || 5);
  const [intLimit, setIntLimit] = useState(user.interviewLimit || 15);

  const hasChanges = tier !== user.premiumType || 
                     Number(genLimit) !== user.generationLimit || 
                     Number(intLimit) !== user.interviewLimit;

  return (
    <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-white">{user.displayName}</div>
          <div className="text-xs text-neutral-500">{user.email}</div>
        </div>
        <div className="text-[10px] text-neutral-600 bg-neutral-900 px-2 py-1 rounded-md">
          ID: {user._id.slice(-6)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase text-neutral-500 font-bold">{t("admin_user_tier")}</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-orange-500 text-neutral-300"
          >
            <option value="none">{t("profile_free")}</option>
            <option value="monthly">Monthly Premium</option>
            <option value="yearly">Yearly Premium</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase text-neutral-500 font-bold">{t("admin_user_limits")}</label>
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-xl px-2 py-1.5">
            <input
              type="number"
              value={genLimit}
              onChange={(e) => setGenLimit(e.target.value)}
              className="w-full bg-transparent text-sm text-center text-orange-400 font-mono focus:outline-none"
            />
            <span className="text-neutral-700">|</span>
            <input
              type="number"
              value={intLimit}
              onChange={(e) => setIntLimit(e.target.value)}
              className="w-full bg-transparent text-sm text-center text-blue-400 font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {hasChanges && (
        <button
          onClick={() => onUpdate(user._id, { premiumType: tier, generationLimit: genLimit, interviewLimit: intLimit })}
          disabled={isUpdating}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs uppercase tracking-wider font-black py-2.5 rounded-xl transition-all shadow-lg shadow-orange-600/20"
        >
          {isUpdating ? '...' : t("admin_save_btn")}
        </button>
      )}
    </div>
  );
};

const AdminUserRow = ({ user, onUpdate, isUpdating, t }) => {
  const [tier, setTier] = useState(user.premiumType || 'none');
  const [genLimit, setGenLimit] = useState(user.generationLimit || 5);
  const [intLimit, setIntLimit] = useState(user.interviewLimit || 15);

  const hasChanges = tier !== user.premiumType || 
                     Number(genLimit) !== user.generationLimit || 
                     Number(intLimit) !== user.interviewLimit;

  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-sm text-neutral-200">{user.displayName}</div>
        <div className="text-[10px] text-neutral-500">{user.email}</div>
      </td>
      <td className="px-4 py-4">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange-500 text-neutral-300"
        >
          <option value="none">{t("profile_free")}</option>
          <option value="monthly">Monthly Premium</option>
          <option value="yearly">Yearly Premium</option>
        </select>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={genLimit}
            onChange={(e) => setGenLimit(e.target.value)}
            className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-center text-orange-400 font-mono"
            title="Resume Limit"
          />
          <span className="text-neutral-600 text-[10px]">/</span>
          <input
            type="number"
            value={intLimit}
            onChange={(e) => setIntLimit(e.target.value)}
            className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-center text-blue-400 font-mono"
            title="Interview Limit"
          />
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        {hasChanges && (
          <button
            onClick={() => onUpdate(user._id, { premiumType: tier, generationLimit: genLimit, interviewLimit: intLimit })}
            disabled={isUpdating}
            className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] uppercase tracking-tighter font-black px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            {isUpdating ? '...' : t("admin_save_btn")}
          </button>
        )}
      </td>
    </tr>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading, updateSkills, checkAuth } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [credits, setCredits] = useState(null);
  const [messages, setMessages] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [isUpdatingUser, setIsUpdatingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const fetchMessages = async () => {
    if (!user?.isAdmin) return;
    setLoadingMessages(true);
    try {
      const { data } = await axios.get('/api/admin/messages');
      setMessages(data);
    } catch (err) { console.error(err); }
    setLoadingMessages(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/profile/credits').then(r => setCredits(r.data)).catch(() => {});
      if (user?.isAdmin) fetchMessages();
    }
  }, [isAuthenticated, user?.isAdmin]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return (
    <div className="h-screen flex flex-col items-center justify-center bg-neutral-950 text-white px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl shadow-orange-500/30">
          👤
        </div>
        <h1 className="text-4xl font-extrabold mb-3">{t("profile_sign_in_heading")}</h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          {t("profile_sign_in_desc")}
        </p>
        <button
          onClick={() => window.location.href = '/auth/google'}
          className="flex items-center gap-3 bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl mx-auto"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {t("profile_sign_in_btn")}
        </button>
      </motion.div>
    </div>
  );

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim() || user?.skills?.includes(newSkill)) return;
    setIsSaving(true);
    try {
      await updateSkills([...(user.skills || []), newSkill.trim()]);
      setNewSkill('');
    } catch (err) { console.error(err); }
    setIsSaving(false);
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      await updateSkills((user.skills || []).filter(s => s !== skillToRemove));
    } catch (err) { console.error(err); }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await axios.delete(`/api/admin/messages/${msgId}`);
      setMessages(messages.filter(m => m._id !== msgId));
    } catch (err) { console.error(err); }
  };

  const handleUpgrade = async (plan) => {
    try {
      // 1. Create order on server
      const { data: order } = await axios.post('/payment/create-order', { plan });


      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ResumeBuild Premium",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify payment on server
            const { data: verifyData } = await axios.post('/payment/verify', {
              ...response,
              plan
            });


            if (verifyData.success) {
              alert("Congratulations! You are now a Premium user.");
              await checkAuth(); // Refresh user data
              const { data: creditData } = await axios.get('/api/profile/credits');
              setCredits(creditData);
            }
          } catch (err) {
            console.error("Verification error:", err);
            const msg = err.response?.data?.message || err.message || "Payment verification failed";
            const debug = err.response?.data?.debug ? ` (Debug: ${JSON.stringify(err.response.data.debug)})` : "";
            alert(`${msg}${debug}. Please contact support.`);
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
        },
        theme: {
          color: "#10b981", // Emerald-500
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to initiate payment";
      const details = err.response?.data?.details ? ` (${err.response.data.details})` : "";
      alert(`${errorMsg}${details}. Please try again.`);
    }
  };

  
  const handleViewResume = (resume) => {
    setSelectedResume(resume);
  };

  const downloadPDFFromModal = () => {
    if (!selectedResume) return;
    const element = document.getElementById("resume-content-modal");
    const opt = {
      margin:       0.5,
      filename:     `${selectedResume.title.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleDeleteResume = async (resumeId) => {
    setDeletingId(resumeId);
    try {
      await axios.delete(`/api/profile/resumes/${resumeId}`);
      await checkAuth(); // Refresh user data to update the list
    } catch (err) {
      console.error(err);
      alert(t("profile_delete_fail") || "Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdminUpdateUser = async (userId, updateData) => {
    setIsUpdatingUser(userId);
    try {
      await axios.patch(`/api/admin/users/${userId}`, updateData);
      alert(t("admin_update_success"));
      fetchAdminUsers(); 
    } catch (err) {
      console.error(err);
      alert(t("admin_update_fail"));
    } finally {
      setIsUpdatingUser(null);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setAdminUsers(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'admin' && user?.isAdmin) {
      fetchAdminUsers();
    }
  }, [activeTab, user?.isAdmin]);

  const tabs = [
    { id: 'overview', label: t("profile_tab_overview"), icon: <FaChartBar /> },
    { id: 'resumes', label: `${t("profile_tab_resumes")} (${user?.savedResumes?.length || 0})`, icon: <FaFileAlt /> },
    { id: 'skills', label: t("profile_tab_skills"), icon: <FaBriefcase /> },
    ...(user?.isAdmin ? [
      { id: 'inbox', label: `Inbox (${messages.length})`, icon: <FaInbox /> },
      { id: 'admin', label: t("admin_panel_title"), icon: <FaUserCog /> }
    ] : [])
  ];

  return (
    <div className="min-h-screen pt-[11vh] bg-neutral-950 text-white px-4 md:px-[5vw] pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* ── Header Card ── */}
        <div className="relative bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 backdrop-blur border border-neutral-700/60 rounded-3xl p-6 md:p-8 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.image}
                alt={user.displayName}
                className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-xl shadow-orange-500/20"
                referrerPolicy="no-referrer"
              />
              {user.isAdmin && (
                <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FaCrown size={10} /> Admin
                </span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold">{user.displayName}</h1>
              <p className="text-neutral-400 mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  {user.isAdmin ? `👑 ${t("profile_admin_badge")}` : (
                    user.isPremium ? (
                      user.premiumType === 'yearly' ? `💎 ${t("premium_yearly_tier")}` : `✨ ${t("premium_monthly_tier")}`
                    ) : t("profile_free_tier")
                  )}
                </span>
                <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaCalendarAlt className="inline mr-1" />
                  {t("profile_joined")} {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaCheckCircle className="inline mr-1" />
                  {t("profile_verified")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-1 mb-6 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <StatCard
                  icon={<FaFileAlt />}
                  label={t("profile_stat_resume_gen")}
                  value={credits?.generationsUsed ?? user.generationsUsed ?? 0}
                  max={credits?.generationLimit ?? (credits?.isAdmin ? Infinity : 5)}
                  color="orange"
                  remainingText={t("profile_stat_remaining")}
                />
                <StatCard
                  icon={<FaBriefcase />}
                  label={t("profile_stat_interviews")}
                  value={credits?.interviewsUsed ?? user.interviewsUsed ?? 0}
                  max={credits?.interviewLimit ?? (credits?.isAdmin ? Infinity : 15)}
                  color="blue"
                  remainingText={t("profile_stat_remaining")}
                />
              </div>

              {/* Quick Summary */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-neutral-200">{t("profile_account_summary")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { label: t("profile_stat_resumes_saved"), value: user?.savedResumes?.length || 0 },
                    { label: t("profile_stat_skills_listed"), value: user?.skills?.length || 0 },
                    { label: t("profile_stat_gen_used"), value: credits?.generationsUsed ?? 0 },
                    { 
                      label: t("profile_stat_account_type"), 
                      value: user?.isAdmin ? t("profile_admin") : (
                        user?.isPremium ? (
                          user?.premiumType === 'yearly' ? t("premium_yearly_tier") : t("premium_monthly_tier")
                        ) : t("profile_free")
                      )
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-neutral-800/50 rounded-xl p-4">
                      <div className="text-2xl font-black text-orange-400">{item.value}</div>
                      <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>

                {!user?.isAdmin && !user?.isPremium && (
                  <div className="mt-4 bg-gradient-to-r from-emerald-900/40 to-emerald-800/10 border border-emerald-500/40 rounded-xl p-5 flex flex-col lg:flex-row items-center justify-between gap-5 transition-all hover:border-emerald-500/70 shadow-lg shadow-emerald-900/20">
                    <div className="text-center lg:text-left">
                      <h4 className="text-emerald-400 font-bold text-lg mb-1">{t("premium_title")}</h4>
                      <p className="text-neutral-400 text-sm max-w-sm">{t("premium_profile_desc")}</p>
                    </div>
                    <div className="flex flex-col items-center lg:items-end gap-3 shrink-0 w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleUpgrade('monthly')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex-1 sm:flex-none"
                        >
                          {t("premium_upgrade_btn")} (Monthly)
                        </button>
                        <button 
                          onClick={() => handleUpgrade('yearly')}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex-1 sm:flex-none"
                        >
                          {t("premium_upgrade_btn")} (Yearly)
                        </button>
                      </div>
                      <span className="text-xs text-emerald-400/80 font-medium tracking-wide text-center lg:text-right">
                        {t("premium_monthly")} {t("premium_monthly_sub")} • {t("premium_yearly").replace("or ", "")}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* ── Inbox Tab (Admin Only) ── */}
          {activeTab === 'inbox' && user?.isAdmin && (
            <motion.div key="inbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-orange-400">
                    <FaInbox /> Admin Inbox
                  </h2>
                  <button 
                    onClick={fetchMessages}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {loadingMessages ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg._id} className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-5 hover:border-orange-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                            <p className="text-sm text-orange-400 font-medium">{msg.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                            <button 
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="p-2 text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl p-4 text-neutral-300 text-sm leading-relaxed border border-neutral-700/30">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <FaInbox size={48} className="mx-auto mb-4 opacity-10 text-orange-500" />
                    <p className="text-neutral-500">No messages yet. They'll appear here when users contact you.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Resumes Tab ── */}
          {activeTab === 'resumes' && (
            <motion.div key="resumes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-blue-400">
                  <FaFileAlt /> {t("profile_saved_resumes_heading")}
                </h2>
                {user?.savedResumes?.length > 0 ? (
                  <div className="space-y-3">
                    {[...user.savedResumes].reverse().map((resume, index) => (
                      <motion.div
                        key={resume._id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleViewResume(resume)}
                        className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl hover:border-blue-500/40 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center text-blue-400">
                            <FaFileAlt />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold group-hover:text-blue-400 transition-colors">
                                {resume.title.split(' - Version ')[0] || t("profile_untitled")}
                              </h3>
                              {resume.title.includes(' - Version ') && (
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-semibold tracking-wider">
                                  v{resume.title.split(' - Version ')[1]}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wider font-medium">
                              {new Date(resume.createdAt).toLocaleString('en-US', {
                                day: 'numeric', month: 'short', year: 'numeric',
                                hour: 'numeric', minute: '2-digit', hour12: true
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume._id);
                          }}
                          disabled={deletingId === resume._id}
                          className="p-2 text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {deletingId === resume._id
                            ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                            : <FaTrash size={15} />}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-neutral-600">
                    <FaFileAlt size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-semibold mb-2">{t("profile_no_resumes")}</p>
                    <p className="text-sm">{t("profile_no_resumes_desc")}</p>
                    <a href="/build" className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all text-sm">
                      {t("profile_start_building")}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Skills Tab ── */}
          {activeTab === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-orange-400">
                  <FaBriefcase /> {t("profile_skills_heading")}
                </h2>
                <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder={t("profile_skill_placeholder")}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSaving || !newSkill.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <FaSave /> {isSaving ? t("profile_saving_skill") : t("profile_add_skill")}
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {user?.skills?.length > 0 ? user.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg flex items-center gap-2 group hover:border-orange-500/40 transition-colors"
                    >
                      <span className="text-sm font-medium">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FaTrash size={11} />
                      </button>
                    </motion.div>
                  )) : (
                    <p className="text-neutral-500 text-sm">{t("profile_no_skills")}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && user?.isAdmin && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FaUserCog className="text-orange-500" /> {t("admin_panel_title")}
                  </h3>
                  <div className="relative max-w-sm w-full">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder={t("admin_search_placeholder")}
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                {/* 💻 Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 pb-4 font-semibold">{t("admin_user_name")}</th>
                        <th className="px-4 py-3 pb-4 font-semibold">{t("admin_user_tier")}</th>
                        <th className="px-4 py-3 pb-4 font-semibold">{t("admin_user_limits")}</th>
                        <th className="px-4 py-3 pb-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                      {adminUsers
                        .filter(u => 
                          u.displayName.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(adminSearch.toLowerCase())
                        )
                        .map(u => (
                          <AdminUserRow 
                            key={u._id} 
                            user={u} 
                            onUpdate={handleAdminUpdateUser} 
                            isUpdating={isUpdatingUser === u._id}
                            t={t}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* 📱 Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                  {adminUsers
                    .filter(u => 
                      u.displayName.toLowerCase().includes(adminSearch.toLowerCase()) || 
                      u.email.toLowerCase().includes(adminSearch.toLowerCase())
                    )
                    .map(u => (
                      <AdminUserCard 
                        key={u._id} 
                        user={u} 
                        onUpdate={handleAdminUpdateUser} 
                        isUpdating={isUpdatingUser === u._id}
                        t={t}
                      />
                    ))}
                </div>

                {adminUsers.filter(u => 
                  u.displayName.toLowerCase().includes(adminSearch.toLowerCase()) || 
                  u.email.toLowerCase().includes(adminSearch.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-12 text-neutral-500 text-sm">
                    {t("admin_no_users")}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Resume View Modal ── */}
      <AnimatePresence>
        {selectedResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResume(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-700/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                    <FaFileAlt />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedResume.title.split(' - Version ')[0]}</h2>
                      {selectedResume.title.includes(' - Version ') && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold tracking-wider border border-blue-500/30">
                          v{selectedResume.title.split(' - Version ')[1]}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                      {new Date(selectedResume.createdAt).toLocaleString(undefined, {
                        dateStyle: 'long', timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadPDFFromModal}
                    className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all flex items-center gap-2 text-sm font-semibold"
                    title="Download PDF"
                  >
                    <FaDownload /> <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={() => setSelectedResume(null)}
                    className="p-2.5 bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-500 rounded-xl transition-all"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-neutral-950/30">
                <div id="resume-content-modal" className="bg-white text-black p-6 sm:p-8 md:p-12 shadow-inner rounded-sm mx-auto max-w-full md:max-w-[21cm] min-h-[29.7cm]">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wider border-b-2 border-black pb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-2 border-b border-gray-400 pb-1 uppercase">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="mb-2 leading-relaxed text-[15px] text-gray-800 break-words whitespace-pre-wrap">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
                      li: ({ children }) => <li className="mb-1 text-[15px] text-gray-800 leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>
                    }}
                  >
                    {selectedResume.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;