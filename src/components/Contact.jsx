import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaPaperPlane, FaEnvelopeOpenText } from "react-icons/fa";

const fieldVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 5000);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center px-4 sm:p-6 pt-[10vh] relative overflow-hidden">
      
      {/* Dynamic Liquid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-orange-500/10 blur-[150px] rounded-full"
        />
      </div>

      <motion.div 
        className="w-full max-w-2xl relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariant}
      >
        <motion.div 
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
          variants={fieldVariant}
        >
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex p-4 bg-orange-500/10 rounded-2xl text-orange-500 mb-6"
              variants={fieldVariant}
            >
              <FaEnvelopeOpenText size={32} />
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
              variants={fieldVariant}
            >
              {t('get_in_touch')}
            </motion.h2>
            <motion.p 
              className="text-neutral-400 text-lg font-light leading-relaxed"
              variants={fieldVariant}
            >
              {t('contact_subtext')}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div className="space-y-2" variants={fieldVariant}>
                <label className="text-xs uppercase tracking-widest font-bold text-orange-500/70 ml-1">{t('your_name')}</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20"
                  placeholder={t('name_placeholder')}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={fieldVariant}>
                <label className="text-xs uppercase tracking-widest font-bold text-orange-500/70 ml-1">{t('email_address')}</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20"
                  placeholder={t('email_placeholder')}
                />
              </motion.div>
            </div>

            <motion.div className="space-y-2" variants={fieldVariant}>
              <label className="text-xs uppercase tracking-widest font-bold text-orange-500/70 ml-1">{t('message_label')}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20 resize-none"
                placeholder={t('message_placeholder')}
              />
            </motion.div>

            <motion.div variants={fieldVariant}>
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : sent ? (
                  t('message_sent')
                ) : (
                  <>
                    {t('send_message')}
                    <FaPaperPlane className="text-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>

        <motion.p 
          className="text-center mt-8 text-neutral-500 text-sm tracking-widest uppercase font-bold"
          variants={fieldVariant}
        >
          {t('privacy_text')}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Contact;
