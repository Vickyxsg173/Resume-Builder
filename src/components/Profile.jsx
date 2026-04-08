import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUserEdit, FaSave, FaTrash, FaDownload, FaBriefcase } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user, isAuthenticated, loading, updateSkills } = useAuth();
    const { t } = useTranslation();
    const [newSkill, setNewSkill] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
    
    if (!isAuthenticated) return (
        <div className="h-screen flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-4xl font-bold mb-4">Protect Your Progress</h1>
            <p className="text-gray-400 mb-8 max-w-md text-center">Login with Google to save your skills, generated resumes, and get a customized performance experience.</p>
        </div>
    );

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim() || user.skills.includes(newSkill)) return;
        
        setIsSaving(true);
        try {
            await updateSkills([...user.skills, newSkill]);
            setNewSkill("");
        } catch (err) {
            console.error(err);
        }
        setIsSaving(false);
    };

    const handleRemoveSkill = async (skillToRemove) => {
        try {
            await updateSkills(user.skills.filter(s => s !== skillToRemove));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen pt-[12vh] bg-neutral-900 text-white px-[5vw] pb-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-neutral-800/50 p-8 rounded-3xl border border-neutral-700 backdrop-blur-sm mb-8">
                    <img 
                        src={user.image} 
                        alt={user.displayName} 
                        className="w-32 h-32 rounded-full border-4 border-orange-500 shadow-xl"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight">{user.displayName}</h1>
                        <p className="text-gray-400 mt-1">{user.email}</p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-orange-500/20 text-orange-500 px-4 py-1 rounded-full text-sm font-semibold border border-orange-500/30">
                                Pro Member
                            </span>
                            <span className="bg-blue-500/20 text-blue-500 px-4 py-1 rounded-full text-sm font-semibold border border-blue-500/30 text-nowrap">
                                {user.savedResumes.length} Resumes Saved
                            </span>
                        </div>
                    </div>
                    <button className="bg-neutral-700 hover:bg-neutral-600 p-4 rounded-2xl transition-all border border-neutral-600">
                        <FaUserEdit size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skills Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-neutral-800/30 p-6 rounded-3xl border border-neutral-700">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-orange-400">
                                <FaBriefcase /> {t("skills") || "Key Skills"}
                            </h2>
                            
                            <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                                <input 
                                    type="text" 
                                    placeholder="Add a skill..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-500"
                                />
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-orange-500 hover:bg-orange-600 p-3 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <FaSave />
                                </button>
                            </form>

                            <div className="flex flex-wrap gap-2">
                                {user.skills.length > 0 ? user.skills.map((skill, index) => (
                                    <motion.div 
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-lg flex items-center gap-2 group"
                                    >
                                        <span className="text-sm font-medium">{skill}</span>
                                        <button 
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </motion.div>
                                )) : <p className="text-gray-500 text-sm">No skills added yet.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Resumes Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-neutral-800/30 p-6 rounded-3xl border border-neutral-700 h-full">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-400">
                                <FaClipboardUser /> Saved Resumes
                            </h2>
                            
                            {user.savedResumes.length > 0 ? (
                                <div className="space-y-4">
                                    {user.savedResumes.map((resume, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-neutral-800 border border-neutral-700 rounded-2xl hover:border-blue-500 transition-all group">
                                            <div>
                                                <h3 className="font-bold text-lg">{resume.title || "Untitled Resume"}</h3>
                                                <p className="text-xs text-gray-500">{new Date(resume.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                                    <FaDownload size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                    <FaClipboardUser size={48} className="mb-4 opacity-20" />
                                    <p>You haven't saved any resumes yet.</p>
                                    <button className="mt-4 text-orange-500 hover:underline">Start building now</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;