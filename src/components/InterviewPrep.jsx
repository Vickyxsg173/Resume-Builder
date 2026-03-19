import React, { useState } from "react";
import axios from "axios";

const InterviewPrep = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    const res = await axios.get("http://localhost:5000/api/interview/start");
    setQuestion(res.data.question);
  };

  const submitAnswer = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/interview/answer", {
      answer,
      question,
    });

    setFeedback(res.data.feedback);
    setQuestion(res.data.nextQuestion);
    setAnswer("");
    setLoading(false);
  };

  return (
    <div className="p-5 pt-[7vh] bg-black text-white w-full h-[100vh]">
      <h1 className="text-2xl font-bold">AI Interview Simulator</h1>

      <button onClick={startInterview} className="bg-blue-500 rounded-md text-white p-2 mt-3">
        Start Interview
      </button>

      {question && (
        <div className="mt-5">
          <h2 className="font-semibold">Question:</h2>
          <p>{question}</p>

          <textarea
            className="w-full h-[25vh] border text-black p-2 mt-3"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />

          <button
            onClick={submitAnswer}
            className="bg-green-500 rounded-md text-white p-2 mt-3"
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="mt-5 text-white bg-black border-2 border-green-300 rounded-xl p-3">
          <h3 className="font-semibold">Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;