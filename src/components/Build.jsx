import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const Build = () => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    skills: "",
    experience: "",
    projects: "",
    education: "",
  });

  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResume("");

    try {
      const response = await fetch("http://localhost:5000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(","),
          projects: formData.projects.split(","),
        }),
      });

      const data = await response.json();
      if (data && data.resume) {
        setResume(data.resume);
      } else {
        setResume("Error: Invalid response from server");
      }
    } catch (error) {
      console.error("Error:", error);
      setResume("Error generating resume");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">AI Resume Builder</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-lg">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <textarea
          name="summary"
          placeholder="Summary"
          onChange={handleChange}
          required
          rows={4}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <textarea
          name="experience"
          placeholder="Experience"
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <textarea
          name="projects"
          placeholder="Projects (comma separated)"
          onChange={handleChange}
          rows={3}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          name="education"
          placeholder="Education"
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <button
          type="submit"
          className="w-40 self-center py-2 rounded-md text-white font-semibold bg-gradient-to-r from-green-400 to-green-600 shadow-md hover:from-green-500 hover:to-green-700 transition"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {/* Output */}
      {resume && (
        <div
          style={{
            marginTop: "30px",
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere"
          }}
        >
          <h3>Generated Resume</h3>
          {typeof resume === "string" ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: "10px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: "5px", lineHeight: "1.6" }}>
                    {children}
                  </li>
                ),
                h1: ({ children }) => <h1 style={{ marginBottom: "10px" }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ marginBottom: "10px" }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ marginBottom: "10px" }}>{children}</h3>,
              }}
            >
              {resume}
            </ReactMarkdown>
          ) : (
            <p>Error displaying resume</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Build;