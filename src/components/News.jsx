import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const getNews = async () => {
    try {
      setError("");
      const res = await axios.get("/api/hn-news");
      const data = res.data;

      if (data.success) {
        setNews(data.news);
        setLastUpdated(new Date());
      } else {
        setError(t("news_error_fetch"));
      }
    } catch (err) {
      setError(t("news_error_server"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
    const interval = setInterval(getNews, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-[9vh] sm:pt-[7vh] p-4 sm:p-6 bg-black w-full min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
          {t("news_title")}<span className="px-2 text-white text-xs italic">{t("news_powered_by")}</span>
        </h1>
        <button
          onClick={getNews}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition w-fit"
        >
          {t("news_refresh")}
        </button>
      </div>
      {lastUpdated && (
        <p className="text-sm text-gray-300 mb-4">
          {t("news_last_updated")}: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {loading && <p className="text-gray-300">{t("news_loading")}</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {news.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-400 p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-black mb-3">
              {t("news_by_author")} {item.author}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium inline-block transform hover:scale-110 transition duration-200"
            >
              {t("news_read_more")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;