import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RiChatAiFill } from "react-icons/ri";
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
  const [openChat, setOpenChat] = useState(false);

  const addtoref = (el)=>{
    if(el && !itemsRef.current.includes(el)){
      itemsRef.current.push(el);
    }
  }

  const aichat = useRef(null);

  useEffect(()=>{
    if(location.pathname === "/"){
      let ctx = gsap.context(()=>{
        gsap.from(itemsRef.current,{
          y:-50,
          duration:0.5,
          opacity:0,
          stagger:0.25
        })
        gsap.from(aichat.current,{
          x:1000,
          opacity:0,
          duration:0.8
        })
      })

      return ()=>ctx.revert();
    }
  },[location.pathname])

    return(
        <>
          <div className="">
            <nav className="z-30 w-full fixed h-[5vh] bg-black text-lg text-white flex flex-row justify-between items-center px-[3vw]">
              <div ref={addtoref} className="flex flex-row items-center">
                <span><FaClipboardUser size={20}/></span>
                <h1 className="text-lg">ResumeBuild</h1>
              </div>
              <div className="flex flex-row gap-[2vw]">
                <Link className="hover:text-orange-600" ref={addtoref} to="/">Home</Link>
                <Link className="hover:text-orange-600" ref={addtoref} to="/Build">Build</Link>
                <Link className="hover:text-orange-600" ref={addtoref} to="/InterviewPrep">InterviewPrep</Link>
                <Link className="hover:text-orange-600" ref={addtoref} to="/About">About</Link>
                <Link className="hover:text-orange-600" ref={addtoref} to="/Contact">Contact</Link>
                <Link className="hover:text-orange-600" ref={addtoref} to="/Profile">Profile</Link>
                <h1 ref={addtoref} className="cursor-pointer">
                  <MdLogout
                    className="hover:text-red-500 hover:scale-110 transition-all duration-200"
                    size={25}
                  />
                </h1>
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
          <div ref={aichat}
            className="fixed bottom-6 right-6 z-50 cursor-pointer"
            onClick={() => setOpenChat(!openChat)}
          >
            <RiChatAiFill
              className="text-black bg-orange-500 p-3 rounded-full shadow-lg hover:bg-orange-600 hover:scale-110 transition-all duration-200"
              size={50}
            />
          </div>
          {openChat && (
            <div className="fixed bottom-20 right-6 w-[300px] h-[400px] bg-white border-2 border-orange-500 rounded-xl shadow-xl z-50 flex flex-col">
              
              {/* Header */}
              <div className="bg-orange-500 text-white p-3 rounded-t-xl font-semibold">
                AI Chat
              </div>
        
              {/* Chat Body */}
              <div className="flex-1 p-3 overflow-y-auto text-black text-sm">
                <p>Hello 👋 How can I help you?</p>
              </div>
        
              {/* Input */}
              <div className="p-2 border-t flex">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 border rounded-md px-2 py-1 text-black outline-none"
                />
                <button className="ml-2 bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600">
                  Send
                </button>
              </div>
        
            </div>
          )}
        </>
    )
}

export default App;