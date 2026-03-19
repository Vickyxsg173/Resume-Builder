import React, { useEffect,useRef } from "react";
import gsap from "gsap";
import { MdLogout } from "react-icons/md";
import { FaClipboardUser } from "react-icons/fa6";
import Build from "./components/Build.jsx";
import Navbar from "./components/Navbar.jsx";
import Contact from "./components/Contact.jsx";
import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import InterviewPrep from "./components/InterviewPrep.jsx";
import { BrowserRouter,Routes,Route,Link, useLocation } from "react-router-dom";

function App(){
  const itemsRef = useRef([]);
  itemsRef.current = [];
  const location = useLocation();

  const addtoref = (el)=>{
    if(el && !itemsRef.current.includes(el)){
      itemsRef.current.push(el);
    }
  }

  useEffect(()=>{
    if(location.pathname === "/"){
      let ctx = gsap.context(()=>{
        gsap.from(itemsRef.current,{
          y:-50,
          duration:0.5,
          opacity:0,
          stagger:0.25
        })
      })

      return ()=>ctx.revert();
    }
  },[location.pathname])

    return(
        <>
          <div className="">
            <nav className="w-full fixed h-[5vh] bg-black text-lg text-white flex flex-row justify-between items-center px-[3vw]">
              <div ref={addtoref} className="flex flex-row items-center">
                <span><FaClipboardUser size={20}/></span>
                <h1 className="text-lg">ResumeBuild</h1>
              </div>
              <div className="flex flex-row gap-[2vw]">
                <Link ref={addtoref} to="/">Home</Link>
                <Link ref={addtoref} to="/Build">Build</Link>
                <Link ref={addtoref} to="/InterviewPrep">InterviewPrep</Link>
                <Link ref={addtoref} to="/Profile">Profile</Link>
                <Link ref={addtoref} to="/Contact">Contact</Link>
                <Link ref={addtoref} to="/Profile">Profile</Link>
                <h1 ref={addtoref}><MdLogout size={25}/></h1>
              </div>
            </nav>
          </div>
          <div>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/Profile" element={<Profile/>}/>
              <Route path="/InterviewPrep" element={<InterviewPrep/>}/>
              <Route path="/Contact" element={<Contact/>}/>
              <Route path="/Build" element={<Build/>}/>
              <Route path="/About" element={<Home/>}/>
            </Routes>
          </div>
        </>
    )
}

export default App;