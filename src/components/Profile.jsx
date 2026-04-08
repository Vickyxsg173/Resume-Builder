import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FaUserEdit, FaSave, FaTrash, FaBriefcase,
  FaFileAlt, FaCrown, FaSignInAlt, FaChartBar,
  FaCalendarAlt, FaCheckCircle
} from 'react-icons/fa';

const StatCard = ({ icon, label, value, max, color }) => {
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
          {max - value} remaining
        </p>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, isAuthenticated, loading, updateSkills, checkAuth } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [credits, setCredits] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/profile/credits').then(r => setCredits(r.data)).catch(() => {});
    }
  }, [isAuthenticated]);

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
        <h1 className="text-4xl font-extrabold mb-3">Your Profile</h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          Sign in with Google to track your resume history, manage skills, and see your remaining credits.
        </p>
        <button
          onClick={() => window.location.href = '/auth/google'}
          className="flex items-center gap-3 bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl mx-auto"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
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

  const handleDeleteResume = async (resumeId) => {
    setDeletingId(resumeId);
    try {
      await axios.delete(`/api/profile/resumes/${resumeId}`);
      await checkAuth(); // Refresh user data
    } catch (err) { console.error(err); }
    setDeletingId(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'resumes', label: `Resumes (${user?.savedResumes?.length || 0})`, icon: <FaFileAlt /> },
    { id: 'skills', label: 'Skills', icon: <FaBriefcase /> },
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
                  {user.isAdmin ? '👑 Admin Account' : 'Free Tier'}
                </span>
                <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaCalendarAlt className="inline mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaCheckCircle className="inline mr-1" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
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
                  label="Resume Generations"
                  value={credits?.generationsUsed ?? user.generationsUsed ?? 0}
                  max={credits?.isAdmin ? Infinity : (credits?.generationLimit ?? 10)}
                  color="orange"
                />
                <StatCard
                  icon={<FaBriefcase />}
                  label="Interview Sessions"
                  value={credits?.interviewsUsed ?? user.interviewsUsed ?? 0}
                  max={credits?.isAdmin ? Infinity : (credits?.interviewLimit ?? 20)}
                  color="blue"
                />
              </div>

              {/* Quick Summary */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-neutral-200">Account Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Resumes Saved', value: user?.savedResumes?.length || 0 },
                    { label: 'Skills Listed', value: user?.skills?.length || 0 },
                    { label: 'Generations Used', value: credits?.generationsUsed ?? 0 },
                    { label: 'Account Type', value: user?.isAdmin ? 'Admin' : 'Free' },
                  ].map((item, i) => (
                    <div key={i} className="bg-neutral-800/50 rounded-xl p-4">
                      <div className="text-2xl font-black text-orange-400">{item.value}</div>
                      <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Resumes Tab ── */}
          {activeTab === 'resumes' && (
            <motion.div key="resumes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-blue-400">
                  <FaFileAlt /> Saved Resumes
                </h2>
                {user?.savedResumes?.length > 0 ? (
                  <div className="space-y-3">
                    {[...user.savedResumes].reverse().map((resume, index) => (
                      <motion.div
                        key={resume._id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl hover:border-blue-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center text-blue-400">
                            <FaFileAlt />
                          </div>
                          <div>
                            <h3 className="font-semibold">{resume.title || 'Untitled Resume'}</h3>
                            <p className="text-xs text-neutral-500">
                              {new Date(resume.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteResume(resume._id)}
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
                    <p className="text-lg font-semibold mb-2">No resumes saved yet</p>
                    <p className="text-sm">Generate a resume on the Build page and save it here.</p>
                    <a href="/build" className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all text-sm">
                      Start Building →
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
                  <FaBriefcase /> My Skills
                </h2>
                <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. React, Python...)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSaving || !newSkill.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <FaSave /> {isSaving ? 'Saving...' : 'Add'}
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
                    <p className="text-neutral-500 text-sm">No skills added yet. Add your first skill above!</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;