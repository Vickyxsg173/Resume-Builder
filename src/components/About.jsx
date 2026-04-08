import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaRobot,
  FaRegKeyboard,
  FaFilePdf,
  FaLightbulb,
  FaHistory,
  FaBullseye,
  FaMicrochip,
  FaUserTie
} from "react-icons/fa";

const revealVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-black text-white relative font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Full Viewport) */}
      <section className="h-screen flex flex-col items-center justify-center relative px-4 sm:px-6 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            {t("about_hero_heading_1")} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
              {t("about_hero_heading_2")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
            {t("about_hero_subtext")}
          </p>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-orange-500/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-orange-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 2. THE GENESIS (Story Section) */}
      <section className="py-32 px-6 md:px-[10vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
          >
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <FaHistory size={20} />
              <span className="uppercase tracking-[0.3em] font-bold text-sm">{t("about_origin_tag")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {t("about_origin_heading")}
            </h2>
            <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
              <p>{t("about_origin_p1")}</p>
              <p>{t("about_origin_p2")}</p>
              <p>{t("about_origin_p3")}</p>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
             <div className="aspect-square bg-zinc-900 rounded-3xl border border-orange-500/20 p-8 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] group-hover:bg-orange-500/10 transition-colors" />
                <h3 className="text-8xl font-black text-white/5 absolute -bottom-10 -right-5">STORY</h3>
                <blockquote className="text-2xl italic text-neutral-300 relative z-10">
                  {t("about_quote")}
                </blockquote>
                <p className="mt-6 text-orange-500 font-bold uppercase tracking-widest">{t("about_quote_attr")}</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 3. ENGINEERING PROFESSIONALISM (Text-Heavy Detail) */}
      <section className="py-32 bg-zinc-950 px-6 md:px-[10vw] border-y border-zinc-900">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariant}
        >
          <div className="flex justify-center mb-6 text-orange-500">
            <FaMicrochip size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">{t("about_eng_tag")}</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            {t("about_eng_subtext")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: t("about_eng_card1_title"),
              desc: t("about_eng_card1_desc")
            },
            {
              title: t("about_eng_card2_title"),
              desc: t("about_eng_card2_desc")
            },
            {
              title: t("about_eng_card3_title"),
              desc: t("about_eng_card3_desc")
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="p-10 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. THE MISSION (Bold Vision) */}
      <section className="py-32 px-6 md:px-[10vw]">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full mb-8">
              <FaBullseye size={14} />
              <span className="text-xs uppercase font-black tracking-widest">{t("about_mission_tag")}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-[1.1]">
              {t("about_mission_heading")}
            </h2>
            <div className="prose prose-invert prose-lg text-neutral-400 max-w-none space-y-8">
              <p className="text-2xl leading-relaxed text-neutral-300">
                {t("about_mission_p1")}
              </p>
              <p>{t("about_mission_p2")}</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
              {[
                { label: t("about_stat_users"), val: "50k+" },
                { label: t("about_stat_resumes"), val: "120k+" },
                { label: t("about_stat_interviews"), val: "15k+" },
                { label: t("about_stat_success"), val: "94%" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-orange-500 mb-1">{stat.val}</div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. MEET THE CONCEPT (Team/Philosophy) */}
      <section className="py-32 bg-orange-500 px-6 md:px-[10vw] text-black">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariant}
        >
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">{t("about_team_heading")}</h2>
            <p className="text-xl font-medium mb-10 opacity-80 leading-relaxed">
              {t("about_team_subtext")}
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition active:scale-95 shadow-2xl">
              {t("about_team_btn")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-32 sm:h-48 md:h-64 bg-black/10 rounded-2xl flex items-center justify-center border border-black/10">
                <FaUserTie size={48} className="opacity-20" />
             </div>
             <div className="h-32 sm:h-48 md:h-64 bg-white/20 rounded-2xl flex items-center justify-center border border-black/10 mt-4 sm:mt-8">
                <FaRobot size={48} className="opacity-20" />
             </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Decoration */}
      <footer className="py-20 text-center text-neutral-600 border-t border-zinc-900">
        <p className="text-sm tracking-widest uppercase">{t("about_footer")}</p>
      </footer>

    </div>
  );
};

export default About;
