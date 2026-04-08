import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaFileAlt, FaMagic, FaChartLine, FaShieldAlt } from 'react-icons/fa'
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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
          end: "+=200%", // Increased distance to make it scroll slower
          scrub: 2,      // Added smoothing for a more premium feel
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
    <div className='w-full h-[100vh] bg-black text-white p-[3vw]'>
      <div className='flex flex-row'>
        <div className='mt-[20vh] w-[65vw]'>
          <h1 ref={head1} className='text-[10vh] w-full text-orange-600 font-black leading-tight'>{t("heading")}</h1>
          <p ref={sub1} className='text-2xl w-[75%] pt-[5vh] text-neutral-400 font-light'>{t("subheading")}<span className='text-4xl text-orange-500 font-bold ml-2'>AI</span>.</p>
        </div>
        <div className='w-[35vw] mt-[20vh] grid grid-cols-2 grid-rows-2 gap-2 p-1'>
          <div ref={box1} className='flex flex-col items-center p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaFileAlt size={40} className="mb-3" />
            <h3 className="font-semibold text-lg mb-1">Smart Resume Templates</h3>
            <p className="text-center text-sm">Choose from AI-optimized templates tailored to your industry.</p>
          </div>
          <div ref={box2} className='flex flex-col items-center p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaMagic size={40} className="mb-3" />
            <h3 className="font-semibold text-lg mb-1">AI-Powered Content Suggestions</h3>
            <p className="text-center text-sm">Get intelligent phrasing and keyword suggestions to stand out.</p>
          </div>
          <div ref={box3} className='flex flex-col items-center p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaChartLine size={40} className="mb-3" />
            <h3 className="font-semibold text-lg mb-1">Real-time Feedback</h3>
            <p className="text-center text-sm">Receive instant insights on resume strength and improvements.</p>
          </div>
          <div ref={box4} className='flex flex-col items-center p-4 border-2 border-orange-600 rounded-2xl bg-black text-white'>
            <FaShieldAlt size={40} className="mb-3" />
            <h3 className="font-semibold text-lg mb-1">Privacy & Security</h3>
            <p className="text-center text-sm">Your data is protected with industry-leading security measures.</p>
          </div>
        </div>
      </div>
    </div>

      {/* PAGE 2 */}
      <div className='page-2 w-full bg-black text-white'>
        <div className="scroll-section w-full h-[100vh] overflow-hidden flex items-center">
          <div className="scroll-text whitespace-nowrap text-[45vh] font-black text-white/90">
            BUILD SMARTER
          </div>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className='page-3 w-full min-h-screen bg-black text-white px-[10vw] flex flex-col items-center justify-center text-center relative overflow-hidden'>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,106,0,0.05),transparent_70%)]" />
        
        <h2 className="p3-text text-5xl md:text-8xl font-black mb-12 leading-[1.1] relative z-10">
          THE FUTURE OF <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
            CAREER EMPOWERMENT
          </span>
        </h2>
        
        <p className="p3-text text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto font-light leading-relaxed relative z-10">
          We are not just building resumes; we are building bridges to your next great opportunity. 
          By combining advanced LLMs with clean professional aesthetics, we ensure you 
          never have to struggle with formatting or phrasing again.
        </p>
        
        <div className="p3-text mt-20 flex gap-6 relative z-10">
          <div className="w-1 h-24 bg-gradient-to-b from-orange-500 to-transparent" />
          <p className="text-left text-orange-500 font-bold uppercase tracking-[0.3em] self-center">
            Elevating every <br/>professional journey
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