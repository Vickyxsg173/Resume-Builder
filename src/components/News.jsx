import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const NewsSkeleton = () => (
  <div className="bg-zinc-800/50 p-5 rounded-xl animate-pulse border border-white/5">
    <div className="h-6 bg-zinc-700 rounded-md w-3/4 mb-4"></div>
    <div className="h-4 bg-zinc-700 rounded-md w-1/2 mb-6"></div>
    <div className="h-5 bg-zinc-700/50 rounded-md w-24"></div>
  </div>
);

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const getNews = async () => {
    try {
      setLoading(true); // Show skeleton on manual refresh too
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

  const showMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  return (
    <div className="pt-[10vh] sm:pt-[7vh] p-4 sm:p-6 bg-black w-full min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">
          {t("news_title")}<span className="px-3 text-neutral-500 text-xs font-light italic">{t("news_powered_by")}</span>
        </h1>
        <button
          onClick={getNews}
          className="bg-orange-600 text-white px-6 py-2.5 rounded-full hover:bg-zinc-700 transition-all font-bold text-sm border border-white/10"
        >
          {t("news_refresh")}
        </button>
      </div>

      {lastUpdated && !loading && (
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-6">
          {t("news_last_updated")}: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {error && <p className="text-red-500 text-center py-10">{error}</p>}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {loading ? (
          // ── Showing Skeletons ──
          Array.from({ length: 12 }).map((_, i) => (
            <NewsSkeleton key={i} />
          ))
        ) : (
          // ── Showing News Cards ──
          news.slice(0, visibleCount).map((item, index) => (
            <div
              key={index}
              className="bg-neutral-900 border border-white/5 p-6 rounded-2xl shadow-xl hover:border-orange-500/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <h2 className="font-bold text-lg mb-3 text-white leading-tight group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-6">
                  {t("news_by_author")} <span className="text-neutral-400">{item.author}</span>
                </p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 text-sm font-black hover:text-orange-400 flex items-center gap-2 transition-all w-fit group-hover:translate-x-1"
              >
                {t("news_read_more")}
              </a>
            </div>
          ))
        )}
      </div>

      {!loading && visibleCount < news.length && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={showMore}
            className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98]"
          >
            {t("show_more_news")}
          </button>
        </div>
      )}
    </div>
  );
};

export default News;