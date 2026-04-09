import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const InterviewPrep = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Commit the transcript to the main answer when listening stops
  useEffect(() => {
    if (!listening && transcript) {
      setAnswer((prev) => prev + (prev.trim() && transcript.trim() ? " " : "") + transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try Google Chrome.");
      return;
    }
    
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/interview/start");
      setQuestion(res.data.question);
      setAnswer("");
      setFeedback("");
      setIsReviewing(false);
      resetTranscript();
    } catch (error) {
      console.error(error);
      alert(t("interview_failed_start"));
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    setLoading(true);
    let currentFinalAnswer = answer;
    
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript) {
        currentFinalAnswer += (answer.trim() ? " " : "") + transcript.trim();
        resetTranscript();
      }
    }
    
    setAnswer(currentFinalAnswer);

    try {
      const res = await axios.post("/api/interview/answer", {
        answer: currentFinalAnswer,
        question,
      });

      setFeedback(res.data.feedback);
      setIsReviewing(true); // Switch to review phase
    } catch (e) {
      console.error(e);
      alert(t("interview_failed_submit"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 pt-[10vh] sm:pt-[12vh] bg-neutral-950 text-white w-full min-h-[100vh] font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          {t("interview_page_title")}
        </h1>

        {!question && (
          <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-xl text-center shadow-lg shadow-black/50">
            <h2 className="text-xl font-semibold mb-3 text-neutral-200">{t("interview_ready_heading")}</h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              {t("interview_ready_desc")}
            </p>
            <button 
              onClick={fetchNextQuestion} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white px-8 py-3 font-semibold transition shadow-lg shadow-blue-500/20 flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaPlay />
              )}
              {loading ? t("interview_warming_up") : t("interview_start_btn")}
            </button>
          </div>
        )}

        {question && (
          <div className="space-y-6">
            
            {/* Question Card */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg shadow-black/50 transition-all">
              <h2 className="text-sm uppercase tracking-wider text-orange-500 font-bold mb-3">{t("interview_question_label")}</h2>
              <p className="text-lg text-neutral-200 leading-relaxed font-medium">{question}</p>
            </div>

            {/* Answer Card */}
            <div className={`bg-neutral-900 border transition-colors ${isReviewing ? 'border-neutral-800 opacity-80' : 'border-neutral-700'} p-6 rounded-xl shadow-lg shadow-black/50`}>
              <h2 className="text-sm uppercase tracking-wider text-emerald-400 font-bold mb-4">{t("interview_answer_label")}</h2>
              
              {isMicrophoneAvailable === false && !isReviewing && (
                 <div className="text-red-400 bg-red-950/50 border border-red-900 p-3 text-sm rounded-lg mb-4">
                   {t("interview_mic_blocked")}
                 </div>
              )}
              
              <div className="relative">
                <textarea
                  className="w-full min-h-[22vh] bg-neutral-950 border border-neutral-800 text-neutral-200 p-4 rounded-lg focus:ring-2 focus:ring-emerald-500 transition resize-y outline-none leading-relaxed"
                  value={answer + (listening && transcript ? (answer.trim() ? " " : "") + transcript : "")}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={isReviewing ? t("interview_submitted_placeholder") : t("interview_answer_placeholder")}
                  disabled={listening || isReviewing || loading}
                />
                
                {!isReviewing && (
                  <button
                    onClick={toggleListening}
                    disabled={loading}
                    className={`absolute bottom-4 right-4 p-4 rounded-full flex items-center justify-center transition-all ${
                      listening 
                        ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40" 
                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white cursor-pointer"
                    }`}
                    title={listening ? t("interview_listening") : t("interview_answer_placeholder")}
                  >
                    {listening ? <FaMicrophoneSlash size={22} /> : <FaMicrophone size={22} />}
                  </button>
                )}
              </div>

              {!isReviewing && (
                <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="text-neutral-500 italic text-sm min-h-[1.5rem]">
                    {listening && (transcript ? <span className="text-emerald-400 not-italic">{t("interview_processing_voice")}</span> : <span>{t("interview_listening")}</span>)}
                  </div>
                  
                  <button
                    onClick={submitAnswer}
                    className="bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white px-8 py-3 font-semibold transition shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
                    disabled={loading || (!answer.trim() && !transcript.trim())}
                  >
                    {loading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         {t("interview_evaluating")}
                       </>
                    ) : t("interview_submit_btn")}
                  </button>
                </div>
              )}
            </div>

            {/* Feedback Card */}
            {isReviewing && feedback && (
              <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-xl shadow-lg shadow-emerald-900/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-sm uppercase tracking-wider text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <FaCheckCircle size={16} /> {t("interview_feedback_label")}
                </h2>
                
                <div className="bg-neutral-950/50 p-5 rounded-lg border border-neutral-900/50 mb-6">
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{feedback}</p>
                </div>
                
                <div className="pt-2 border-t border-emerald-900/30 flex justify-end mt-4">
                  <button 
                    onClick={fetchNextQuestion}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 rounded-lg text-white px-8 py-3 font-semibold transition shadow-lg shadow-blue-500/20 flex items-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? t("interview_wrapping") : t("interview_next_btn")} <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
};

export default InterviewPrep;