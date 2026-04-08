import React from "react";
import { motion } from "framer-motion";
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
  return (
    <div className="bg-black text-white relative font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Full Viewport) */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            WE ARE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
              RESUMEBUILD
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
            Pioneering the intersection of Generative AI and professional career development 
            to redefine how the world builds their professional identities.
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
              <span className="uppercase tracking-[0.3em] font-bold text-sm">Our Origin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              From a Simple Idea to an <br/> AI Powerhouse.
            </h2>
            <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
              <p>
                ResumeBuild was born out of a single observation: the gap between human potential and 
                documentary representation was widening. Traditional resume builders were static, 
                uninspiring, and failed to capture the dynamic essence of a modern career.
              </p>
              <p>
                In 2026, we saw an opportunity to bridge this gap using Large Language Models. We didn't 
                just want to build another text editor; we wanted to build an intelligent collaborator—a 
                system that understands industry nuances, technical keywords, and the psychology of 
                the hiring manager.
              </p>
              <p>
                What started as a weekend script has evolved into a comprehensive suite for career acceleration, 
                integrating advanced PDF engines, real-time feedback loops, and an AI-driven interview 
                simulator that prepares our users for the high-stakes world of modern tech hiring.
              </p>
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
                  "The resume should not just be a list of what you did; it should be a manifesto of what you can do."
                </blockquote>
                <p className="mt-6 text-orange-500 font-bold uppercase tracking-widest">— The Founder's Vision</p>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">Engineering Professionalism</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            A deep-dive into the proprietary logic and AI orchestration that drives every document generated on our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Contextual Awareness",
              desc: "Our AI doesn't just swap synonyms. It uses deep contextual understanding to rewrite your experiences, ensuring that technical accomplishments are framed with the exact terminology expected by industry leaders."
            },
            {
              title: "ATS Optimization",
              desc: "We've spent thousands of hours analyzing Applicant Tracking Systems. Every resume generated follows the invisible rules of parser logic—ensuring your profile never gets discarded due to formatting errors."
            },
            {
              title: "The Human Element",
              desc: "While AI does the heavy lifting, we preserve the human spark. Our system is designed to amplify your unique voice, not replace it with generic 'copypasta' templates."
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
              <span className="text-xs uppercase font-black tracking-widest">Our Mission</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-[1.1]">
              Democratizing Elite <br/> Carrier Opportunities.
            </h2>
            <div className="prose prose-invert prose-lg text-neutral-400 max-w-none space-y-8">
              <p className="text-2xl leading-relaxed text-neutral-300">
                Our vision is a world where talent is the only barrier to entry. We believe that 
                knowing how to "play the game" of hiring shouldn't be reserved for those who can afford 
                expensive consultants.
              </p>
              <p>
                By providing world-class AI tools for resume building and interview preparation, we level 
                the playing field for everyone—from first-generation college students to veteran software 
                engineers. We are committed to building a platform that doesn't just create files, but 
                builds confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
              {[
                { label: "Active Users", val: "50k+" },
                { label: "Resumes Built", val: "120k+" },
                { label: "Interviews Prep", val: "15k+" },
                { label: "Success Rate", val: "94%" },
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
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">Built by Humans, <br/> Powered by AI.</h2>
            <p className="text-xl font-medium mb-10 opacity-80 leading-relaxed">
              Our team consists of former recruiters, seasoned engineers, and AI researchers 
              who collective goal is to make your professional life easier.
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition active:scale-95 shadow-2xl">
              Join our Journey
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-64 bg-black/10 rounded-2xl flex items-center justify-center border border-black/10">
                <FaUserTie size={48} className="opacity-20" />
             </div>
             <div className="h-64 bg-white/20 rounded-2xl flex items-center justify-center border border-black/10 mt-8">
                <FaRobot size={48} className="opacity-20" />
             </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Decoration */}
      <footer className="py-20 text-center text-neutral-600 border-t border-zinc-900">
        <p className="text-sm tracking-widest uppercase">© 2026 RESUMEBUILD AI SYSTEMS — ALL RIGHTS RESERVED</p>
      </footer>

    </div>
  );
};

export default About;
