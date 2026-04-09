import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaSave, FaDownload } from "react-icons/fa";

const Build = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    links: "",
    summary: "",
    skills: "",
    experience: "",
    projects: "",
    education: "",
  });

  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingToProfile, setSavingToProfile] = useState(false);
  const { user, isAuthenticated, saveResume } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.skills?.length > 0 && !formData.skills) {
      setFormData(prev => ({
        ...prev,
        skills: user.skills.join(", ")
      }));
    }
  }, [isAuthenticated, user]);

  // 📂 Handle loading saved resume from profile
  useEffect(() => {
    if (location.state?.resumeData) {
      const { title, content } = location.state.resumeData;
      setResume(content);
      setFormData(prev => ({
        ...prev,
        name: title.split(' - ')[0] // Extract name from title if it follows "Name - Date" pattern
      }));
      
      // Smooth scroll to resume output
      setTimeout(() => {
        const output = document.getElementById("resume-output");
        if (output) {
          output.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.state]);

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
      const response = await fetch("/generate-resume", {
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
        // 🔖 Auto-save to profile if logged in
        if (isAuthenticated && saveResume) {
          const versionNumber = (user?.savedResumes?.length || 0) + 1;
          const title = `${formData.name || 'Resume'} - Version ${versionNumber}`;
          saveResume(title, data.resume).catch(() => {});
        }
        // 📜 Auto-scroll to resume
        setTimeout(() => {
          document.getElementById("resume-output")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setResume(t("build_error_invalid"));
      }
    } catch (error) {
      console.error("Error:", error);
      setResume(t("build_error_generating"));
    }

    setLoading(false);
  };

  const downloadPDF = () => {
    const element = document.getElementById("resume-output");
    const opt = {
      margin:       0.5,
      filename:     `${formData.name.replace(/\s+/g, '_') || 'Resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleSaveToProfile = async () => {
    if (!resume || !isAuthenticated) return;
    setSavingToProfile(true);
    try {
      const title = `${formData.name || 'Resume'} - ${new Date().toLocaleDateString()}`;
      await saveResume(title, resume);
      alert(t("build_save_success"));
    } catch (err) {
      console.error(err);
      alert(t("build_save_fail"));
    }
    setSavingToProfile(false);
  };

  return (
    <div className="p-4 sm:p-6 w-full min-h-[100vh] pt-[10vh] sm:pt-[12vh] bg-black">
      <h2 className="text-3xl font-semibold mb-8 text-center text-white">{t("build_page_title")}</h2>

      <form onSubmit={handleSubmit} className="flex border-2 border-gray-400 flex-col gap-6 bg-black p-8 rounded-lg max-w-3xl mx-auto shadow-lg">
        <input
          name="name"
          placeholder={t("build_name_placeholder")}
          onChange={handleChange}
          required
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          name="contact"
          placeholder={t("build_contact_placeholder")}
          onChange={handleChange}
          required
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          name="links"
          placeholder={t("build_links_placeholder")}
          onChange={handleChange}
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <textarea
          name="summary"
          placeholder={t("build_summary_placeholder")}
          onChange={handleChange}
          required
          rows={4}
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          name="skills"
          placeholder={t("build_skills_placeholder")}
          onChange={handleChange}
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <textarea
          name="experience"
          placeholder={t("build_experience_placeholder")}
          onChange={handleChange}
          rows={4}
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <textarea
          name="projects"
          placeholder={t("build_projects_placeholder")}
          onChange={handleChange}
          rows={3}
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <input
          name="education"
          placeholder={t("build_education_placeholder")}
          onChange={handleChange}
          className="border border-green-300 bg-black text-white rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <button
          type="submit"
          className="w-40 self-center py-2 rounded-md text-white font-semibold bg-gradient-to-r from-green-400 to-green-600 shadow-md hover:from-green-500 hover:to-green-700 transition"
        >
          {loading ? t("build_generating") : t("build_generate_btn")}
        </button>
      </form>

      {/* Output */}
      {resume && (
        <div className="mt-12 flex flex-col items-center pb-20 w-full overflow-x-auto">
          <div className="w-full max-w-[21cm] flex justify-end gap-3 mb-4 min-w-[320px] px-2">
            <button
              onClick={downloadPDF}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <FaDownload /> {t("build_download_pdf")}
            </button>
          </div>
          
          <div
            id="resume-output"
            className="w-full max-w-[21cm] min-h-[29.7cm] bg-white text-black p-10 shadow-2xl rounded-sm"
            style={{
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            {typeof resume === "string" ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-wider border-b-2 border-black pb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-2 border-b border-gray-400 pb-1 uppercase">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-1">{children}</h3>,
                  p: ({ children }) => <p className="mb-2 leading-relaxed text-[15px] text-gray-800 break-words whitespace-pre-wrap">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
                  li: ({ children }) => <li className="mb-1 text-[15px] text-gray-800 leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>
                }}
              >
                {resume}
              </ReactMarkdown>
            ) : (
              <p>{t("build_error_generating")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Build;