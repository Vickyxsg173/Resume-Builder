import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaFileAlt, FaMagic, FaChartLine, FaShieldAlt } from 'react-icons/fa'
import { useTranslation } from "react-i18next";

const Home = () => {

  gsap.registerPlugin(ScrollTrigger);
  const head1 = useRef(null);
  const sub1 = useRef(null);
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const box4 = useRef(null);

  const { t } = useTranslation();

  useEffect(()=>{
    let ctx = gsap.context(()=>{
      gsap.from(head1.current,{
        y:-1000,
        duration:1.5,
        opacity:0
      })
      gsap.from(sub1.current,{
        x:-1000,
        duration:1.7,
        opacity:0
      })
      gsap.from(box1.current,{
        x:-1000,
        opacity:0,
        duration:1.5
      })
      gsap.from(box2.current,{
        y:-1000,
        opacity:0,
        duration:1.5
      })
      gsap.from(box3.current,{
        y:2000,
        opacity:0,
        duration:1.5
      })
      gsap.from(box4.current,{
        x:2000,
        opacity:0,
        duration:1.5
      })
      gsap.to(".scroll-text", {
        x: "-55%",
        scrollTrigger: {
          trigger: ".scroll-section",
          start: "top top",
          end: "+=200%",
          scrub: 2,
          pin: true,
        }
      });

      // PAGE 3 REVEAL
      gsap.from(".p3-text", {
        y: 100,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        scrollTrigger: {
          trigger: ".page-3",
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        }
      });
    })
    return ()=>ctx.revert();
  },[])

  return (
    <div className="bg-black">
      {/* PAGE 1 */}
    <div className='w-full min-h-[100vh] bg-black text-white px-4 sm:px-[3vw] pt-[12vh] pb-8'>
      <div className='flex flex-col lg:flex-row gap-8 lg:gap-0'>
        <div className='mt-4 lg:mt-[10vh] w-full lg:w-[65vw]'>
          <h1 ref={head1} className='text-5xl sm:text-6xl md:text-7xl lg:text-[8vh] xl:text-[10vh] w-full text-orange-600 font-black leading-tight'>{t("heading")}</h1>
          <p ref={sub1} className='text-lg sm:text-xl md:text-2xl w-full sm:w-[85%] lg:w-[75%] pt-4 lg:pt-[5vh] text-neutral-400 font-light'>{t("subheading")}<span className='text-2xl sm:text-3xl md:text-4xl text-orange-500 font-bold ml-2'>AI</span>.</p>
        </div>
        <div className='w-full lg:w-[35vw] mt-4 lg:mt-[10vh] grid grid-cols-2 gap-2 p-1'>
          <div ref={box1} className='flex flex-col items-center p-3 sm:p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaFileAlt size={32} className="mb-2 sm:mb-3" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 text-center">{t("feature_resume_title")}</h3>
            <p className="text-center text-xs sm:text-sm hidden sm:block">{t("feature_resume_desc")}</p>
          </div>
          <div ref={box2} className='flex flex-col items-center p-3 sm:p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaMagic size={32} className="mb-2 sm:mb-3" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 text-center">{t("feature_ai_title")}</h3>
            <p className="text-center text-xs sm:text-sm hidden sm:block">{t("feature_ai_desc")}</p>
          </div>
          <div ref={box3} className='flex flex-col items-center p-3 sm:p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaChartLine size={32} className="mb-2 sm:mb-3" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 text-center">{t("feature_feedback_title")}</h3>
            <p className="text-center text-xs sm:text-sm hidden sm:block">{t("feature_feedback_desc")}</p>
          </div>
          <div ref={box4} className='flex flex-col items-center p-3 sm:p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaShieldAlt size={32} className="mb-2 sm:mb-3" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 text-center">{t("feature_privacy_title")}</h3>
            <p className="text-center text-xs sm:text-sm hidden sm:block">{t("feature_privacy_desc")}</p>
          </div>
        </div>
      </div>
    </div>

      {/* PAGE 2 */}
      <div className='page-2 w-full bg-black text-white'>
        <div className="scroll-section w-full h-[100vh] overflow-hidden flex items-center">
          <div className="scroll-text whitespace-nowrap text-[20vw] sm:text-[30vw] md:text-[40vh] lg:text-[45vh] font-black text-white/90">
            {t("home_page2_text")}
          </div>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className='page-3 w-full min-h-screen bg-black text-white px-6 sm:px-[8vw] md:px-[10vw] flex flex-col items-center justify-center text-center relative overflow-hidden'>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,106,0,0.05),transparent_70%)]" />
        
        <h2 className="p3-text text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-8 md:mb-12 leading-[1.1] relative z-10">
          {t("home_page3_heading_1")} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
            {t("home_page3_heading_2")}
          </span>
        </h2>
        
        <p className="p3-text text-base sm:text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto font-light leading-relaxed relative z-10">
          {t("home_page3_subtext")}
        </p>
        
        <div className="p3-text mt-12 md:mt-20 flex gap-6 relative z-10">
          <div className="w-1 h-16 md:h-24 bg-gradient-to-b from-orange-500 to-transparent" />
          <p className="text-left text-orange-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] self-center text-sm md:text-base">
            {t("home_page3_tagline")}
          </p>
        </div>
      </div>

      {/* FOOTER DECO */}
      <footer className="py-20 bg-black text-center text-neutral-700 border-t border-zinc-900">
          <p className="text-xs tracking-widest uppercase">RESUMEBUILD — EST. 2026</p>
      </footer>
    </div>
  );
};

export default Home;