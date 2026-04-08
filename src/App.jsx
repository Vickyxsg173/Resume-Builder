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
import News from "./components/News.jsx";
import InterviewPrep from "./components/InterviewPrep.jsx";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { BrowserRouter,Routes,Route,Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function App(){
  const itemsRef = useRef([]);
  itemsRef.current = [];
  const location = useLocation();
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello 👋 How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { t } = useTranslation();

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
          stagger:0.15,
          clearProps: "all"
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
              <Route path="/InterviewPrep" element={<InterviewPrep/>}/>
              <Route path="/Contact" element={<Contact/>}/>
              <Route path="/Build" element={<Build/>}/>
              <Route path="/About" element={<About/>}/>
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
                    <p className="text-xs">Typing</p>
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
        
            </div>
          )}
        </>
    )
}

export default App;