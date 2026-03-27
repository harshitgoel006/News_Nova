import { useEffect, useState } from "react";
import { getBookmarks, removeBookmark } from "../services/bookmark.service";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, Clock, Globe } from "lucide-react";

const Bookmarks = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const res = await getBookmarks();
      const bookmarks = res.data.data?.data || res.data.data || [];
      setData(bookmarks);
    } catch (err) {
      console.error("Bookmark fetch error", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await removeBookmark(id);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    // mt-32/pt-32 for Navbar spacing as per Home.jsx
    <div className="max-w-4xl mx-auto pt-32 pb-10 px-4 min-h-screen">
      
      {/* 🏛️ ROYAL HEADING (Home.jsx Style) */}
      <div className="mb-10 text-center">
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-rose-500 font-bold text-xs uppercase tracking-[0.3em]"
        >
          Your Library
        </motion.span>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-serif font-bold text-slate-900 mt-2"
        >
          Saved <span className="italic text-slate-500 underline decoration-rose-200">Stories</span>
        </motion.h1>
      </div>

      {/* 📭 EMPTY STATE */}
      {data.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-slate-400 font-serif italic text-lg">
            Your library is currently empty.
          </p>
        </div>
      )}

      {/* 📰 EDITORIAL LIST */}
      <div className="space-y-6">
        <AnimatePresence>
          {data.map((item, idx) => (
            <motion.div
              key={item._id}
              layout
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/news/${encodeURIComponent(item.url)}`, { state: { ...item } })}
              className="group relative flex flex-col md:flex-row gap-6 p-5 bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all cursor-pointer overflow-hidden"
            >
              {/* IMAGE SECTION */}
              <div className="w-full md:w-48 h-40 shrink-0 rounded-[20px] overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-rose-50 flex items-center justify-center font-serif italic text-rose-200 text-2xl font-black">N</div>
                )}
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                         <Globe size={10} /> {item.source?.name || item.source || "NewsNova"}
                      </span>
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                         <Clock size={10} /> {item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => handleDelete(e, item._id)}
                      className="p-1.5 rounded-full hover:bg-rose-50 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-1">
                    Full Story <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Bookmarks;