import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { addBookmark, removeBookmark, getBookmarks } from "../../services/bookmark.service";
import { addHistory } from "../../services/history.service";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

function NewsCard({ title, description, image, source, time, url }) {
  const normalizeUrl = (url) => url?.split("?")[0];
  const {isAuthenticated} = useAuthStore();
  const navigate = useNavigate();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);

  const premiumGradient = "bg-gradient-to-r from-orange-500 via-rose-500 to-red-600";

  // 🔥 FIX 1: SAFE + SINGLE FORMAT HANDLING
 useEffect(() => {
  const checkBookmarkStatus = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await getBookmarks();

      const savedArticles = extractBookmarks(res);

      const cleanUrl = url?.split("?")[0];

      const found = savedArticles.find(
        (item) => item.articleId?.split("?")[0] === cleanUrl
      );

      if (found) {
        setIsBookmarked(true);
        setBookmarkId(found._id);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }

    } catch (err) {
      console.error(err);
    }
  };

  checkBookmarkStatus();
}, [url, isAuthenticated]);

const extractBookmarks = (res) => {
  return (
    res?.data?.data?.data ||
    res?.data?.data ||
    res?.data ||
    []
  );
};
  const handleHistory = async () => {
    try {
      await addHistory({
  articleId: url?.split("?")[0],
  title: title || "News Article",
  url,
  source: source || "News",
  image: image && image.startsWith("http") ? image : undefined,
});
    } catch (err) {
      console.error("History error", err);
    }
  };

  // 🔥 FIX 2: SAFE TOGGLE
const handleBookmark = async (e) => {
  e.stopPropagation();
  if (loading) return;

  setLoading(true);

  try {
    const cleanUrl = normalizeUrl(url);

    if (isBookmarked && bookmarkId) {
      await removeBookmark(bookmarkId);
      setIsBookmarked(false);
      setBookmarkId(null);
    } else {
      const res = await addBookmark({
        articleId: cleanUrl,
        title,
        url: cleanUrl,
        source,
        image,
        publishedAt: new Date().toISOString(),
      });

      const newId = res?.data?.data?._id;
      if (newId) setBookmarkId(newId);

      setIsBookmarked(true);
    }

  } catch (err) {
    console.error("Bookmark toggle error", err);
  } finally {
    setLoading(false);
  }
};

  const handleRead = async () => {
    await handleHistory();

    navigate(`/news/${encodeURIComponent(url)}`, {
      state: { title, description, image, source, time, url },
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-[28px] mb-8 overflow-hidden transition-all duration-500 border-[1.5px] border-slate-100 hover:border-rose-400/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)]"
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden cursor-pointer" onClick={handleRead}>
        {image ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${premiumGradient} opacity-10 flex items-center justify-center`}>
             <span className="text-rose-500/30 font-serif italic text-3xl font-bold">Nova</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
            {source || "Global News"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[2px] bg-rose-500 rounded-full" />
          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-[0.2em]">
            {time || "Just Now"}
          </span>
        </div>

        <h2 
          className="text-xl font-serif font-bold text-slate-900 leading-tight mb-3 group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-2"
          onClick={handleRead}
        >
          {title}
        </h2>

        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-5">
          {description || "Click to read the full story..."}
        </p>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          {isAuthenticated && (
          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
              isBookmarked ? "text-rose-600" : "text-slate-400 hover:text-rose-600"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2.5">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            {isBookmarked ? "Saved" : "Save"}
          </button>
        )}

          <button
            onClick={handleRead}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-rose-600 transition-all"
          >
            Full Story
            <span className="text-rose-500 group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default NewsCard;