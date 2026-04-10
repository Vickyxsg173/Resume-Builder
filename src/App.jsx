import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RiChatAiFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { FaClipboardUser, FaLock } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Build from "./components/Build.jsx";
import Navbar from "./components/Navbar.jsx";
import Contact from "./components/Contact.jsx";
import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import News from "./components/News.jsx";
import InterviewPrep from "./components/InterviewPrep.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { BrowserRouter,Routes,Route,Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "./context/AuthContext";

function App(){
  const itemsRef = useRef([]);
  const location = useLocation();
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello 👋 How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { t } = useTranslation();
  const { isAuthenticated, login } = useAuth();

  const addtoref = (el)=>{
    if(el && !itemsRef.current.includes(el)){
      itemsRef.current.push(el);
    }
  }

  const aichat = useRef(null);

  useEffect(()=>{
    if(location.pathname === "/"){
      let ctx = gsap.context(()=>{
        // 🎯 Animate the gathered refs
        if (itemsRef.current.length > 0) {
          gsap.from(itemsRef.current, {
            y: -50,
            duration: 0.5,
            opacity: 0,
            stagger: 0.15,
            ease: "back.out(1.7)",
            clearProps: "all"
          });
        }
        
        gsap.from(aichat.current,{
          x: 100,
          opacity:0,
          duration:0.8,
          ease: "power2.out"
        });
      });

      return () => ctx.revert();
    } else {
      // Clear refs when leaving home page to avoid stale references
      itemsRef.current = [];
    }
  }, [location.pathname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      const aiReply = data.choices?.[0]?.message?.content || "No response";

      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

    return(
        <>
      <Navbar addtoref={addtoref} />
          <div>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/Profile" element={<Profile/>}/>
              <Route path="/News" element={<News/>}/>
              <Route path="/InterviewPrep" element={
                <ProtectedRoute><InterviewPrep/></ProtectedRoute>
              }/>
              <Route path="/Contact" element={<Contact/>}/>
              <Route path="/Build" element={
                <ProtectedRoute><Build/></ProtectedRoute>
              }/>
              <Route path="/About" element={<About/>}/>
              <Route path="/reset-password/:token" element={<ResetPassword/>}/>

            </Routes>
          </div>
          {/* AI Chat FAB */}
          <div ref={aichat}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 cursor-pointer"
            onClick={() => setOpenChat(!openChat)}
          >
            <RiChatAiFill
              className="text-black bg-orange-500 p-3 rounded-full shadow-lg hover:bg-orange-600 hover:scale-110 transition-all duration-200"
              size={50}
            />
            {/* Lock badge for unauthenticated users */}
            {!isAuthenticated && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 border border-orange-500/50 rounded-full p-[3px]">
                <FaLock size={9} className="text-orange-400" />
              </span>
            )}
          </div>
          {openChat && (
            <div className="fixed bottom-20 right-0 sm:right-6 w-full sm:w-[320px] h-[70vh] sm:h-[400px] max-h-[500px] bg-white border-2 border-orange-500 sm:rounded-xl shadow-xl z-50 flex flex-col">
              
              {/* Header */}
              <div className="bg-orange-500 text-white p-3 sm:rounded-t-xl font-semibold flex items-center justify-between">
                <span>AI Chat</span>
                <button onClick={() => setOpenChat(false)} className="text-white/80 hover:text-white ml-auto text-xl leading-none">&times;</button>
              </div>

              {/* --- Unauthenticated: Login Prompt --- */}
              {!isAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 bg-neutral-950">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(249,115,22,0.3)" }}
                  >
                    <FaLock size={24} className="text-orange-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm mb-1">Sign in to use AI Chat</p>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Your chat history and usage limits are tied to your profile.
                    </p>
                  </div>
                  <button
                    onClick={login}
                    className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 active:scale-95 transition-all shadow-lg w-full justify-center"
                  >
                    <FcGoogle size={18} />
                    Continue with Google
                  </button>
                </div>
              ) : (
                <>
                  {/* Chat Body */}
                  <div className="flex-1 p-3 overflow-y-auto text-black text-sm space-y-2">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-xl max-w-[85%] shadow-sm ${
                          msg.role === "user"
                            ? "bg-orange-500 text-white ml-auto rounded-tr-none"
                            : "bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-tl-none text-sm"
                        }`}
                      >
                        <ReactMarkdown 
                          components={{
                            p: ({children}) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
                            strong: ({children}) => <span className="font-bold text-orange-600">{children}</span>,
                            ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                            li: ({children}) => <li className="mb-1">{children}</li>
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs">{t("ai_chat_typing")}</p>
                        <div className="flex flex-row gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
            
                  {/* Input */}
                  <div className="p-2 border-t flex">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={t("type_message")}
                      className="flex-1 border rounded-md px-2 py-1 text-black outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      className="ml-2 bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
                    >
                      {t("send")}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
    )
}

export default App;