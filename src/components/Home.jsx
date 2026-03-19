import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FaFileAlt, FaMagic, FaChartLine, FaShieldAlt } from 'react-icons/fa'

const Home = () => {

  const head1 = useRef(null);
  const sub1 = useRef(null);
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const box4 = useRef(null);

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
    })
    return ()=>ctx.revert();
  },[])

  return (
    <div className='w-full h-[100vh] bg-black text-white p-[3vw]'>
      <div className='flex flex-row'>
        <div className='mt-[20vh] w-[65vw]'>
          <h1 ref={head1} className='text-[10vh] w-full text-orange-600'>Build Your Future with AI-Powered Tools</h1>
          <p ref={sub1} className='text-xl w-[75%] pt-[5vh]'>Transform your ideas into professional resumes and get insights instantly.
          Your career, accelerated by <span className='text-3xl text-orange-500'>AI</span>.</p>
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
  )
}

export default Home;