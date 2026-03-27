import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { addBookmark, removeBookmark, getBookmarks } from "../services/bookmark.service";

function NewsDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!state) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-[#FCFCFC]">
        <h2 className="text-xl font-serif font-black text-slate-900 uppercase tracking-tighter">Story Not Found</h2>
        <button 
          onClick={() => navigate("/")} 
          className="mt-6 px-8 py-3 bg-rose-600 text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-rose-700 shadow-lg active:scale-95"
        >
          BACK TO NEWSNOVA
        </button>
      </div>
    );
  }

  const { title, description, image, source, time, url } = state;
const normalizeUrl = (url) => url?.split("?")[0];

const extractBookmarks = (res) => {
  return (
    res?.data?.data?.data ||
    res?.data?.data ||
    res?.data ||
    []
  );
};
  
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

 useEffect(() => {
  const checkBookmarkStatus = async () => {
    if (!isAuthenticated || !url) return;

    try {
      const res = await getBookmarks();

      const list = extractBookmarks(res);
      const cleanUrl = normalizeUrl(url);

      const found = list.find(
        (item) => normalizeUrl(item.articleId) === cleanUrl
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

  const handleBookmarkToggle = async () => {
  if (!isAuthenticated) return navigate("/login");
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
        publishedAt:
          time && !isNaN(new Date(time))
            ? new Date(time).toISOString()
            : new Date().toISOString(),
      });

      if (res?.data?.data?._id) {
        setBookmarkId(res.data.data._id);
      }

      setIsBookmarked(true);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Success! Link copied to clipboard. ✨");
      }
    } catch (err) { console.error(err); }
  };

  const controlBtnClass = "flex items-center justify-between px-5 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-transparent active:scale-95";
  const idleClass = "bg-slate-50 text-slate-500 hover:bg-rose-600 hover:text-white";
  const activeClass = "bg-rose-50 text-rose-600 border-rose-100 shadow-sm";

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-rose-100 pb-16">
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-rose-600 z-[110] origin-left" style={{ scaleX }} />

      {/* 🖼️ Enhanced Image Visibility Container */}
      <div className="relative w-full h-[45vh] lg:h-[65vh] overflow-hidden bg-slate-200">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          src={image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"} 
          className="w-full h-full object-cover object-center" 
          alt="NewsNova Daily" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFF] via-transparent to-black/10" />
        <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center mix-blend-difference">
          <button onClick={() => navigate(-1)} className="text-[10px] font-black tracking-[0.2em] text-white hover:opacity-60 transition-opacity">← BACK</button>
          <p className="text-[10px] font-black tracking-[0.2em] text-white uppercase opacity-70">{source}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 lg:px-10 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          
          <motion.article initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 md:p-12 rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-rose-600 text-white px-2.5 py-1 text-[7px] font-black uppercase rounded-full tracking-wider">NewsNova Exclusive</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(time).toLocaleDateString() || 'Recently'}</span>
            </div>

            <h1 className="text-2xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.2] mb-8 tracking-tight">{title}</h1>

            <div className="space-y-6">
              <p className="text-lg md:text-xl text-slate-800 font-serif leading-relaxed border-l-4 border-rose-500 pl-5 py-0.5">
                {description}
              </p>
              
              <div className="text-[14px] md:text-[17px] text-slate-600 leading-[1.7] space-y-5 italic font-medium">
                <p>Stay ahead with NewsNova. Our platform ensures you receive verified information directly from global news hubs in real-time.</p>
              </div>

              {/* 📱 MOBILE CONTROLS */}
              <div className="lg:hidden grid grid-cols-2 gap-3 pt-8 border-t border-slate-50">
                <button onClick={handleShare} className={`${controlBtnClass} ${idleClass} justify-center gap-2`}>
                  <span className="text-lg">🚀</span> Share
                </button>
                <button onClick={handleBookmarkToggle} className={`${controlBtnClass} ${isBookmarked ? activeClass : idleClass} justify-center gap-2`}>
                  <span className="text-lg">{isBookmarked ? '💖' : '✨'}</span> {isBookmarked ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* 📱 MOBILE INSIGHT (Now Visible) */}
              <div className="lg:hidden p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 border border-slate-100 mt-6">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2">NewsNova Context</p>
                <p className="text-xs font-serif text-slate-600 leading-relaxed italic">
                  Curated by <strong>NewsNova AI</strong> to match your reading preferences.
                </p>
              </div>

              {/* ACTION CTA */}
              <div className="mt-12 bg-slate-900 rounded-[24px] p-7 text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-serif font-bold mb-0.5 tracking-wide">Read Full Coverage</h3>
                    <p className="text-slate-400 text-[9px] uppercase tracking-widest opacity-80">Verified by {source}</p>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center bg-white text-slate-900 px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.15em] hover:bg-rose-500 hover:text-white transition-all shadow-md">Visit Source ↗</a>
                </div>
                <div className="absolute -right-5 -top-5 w-32 h-32 bg-rose-600/10 blur-2xl rounded-full" />
              </div>
            </div>
          </motion.article>

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white/90 backdrop-blur-md p-7 rounded-[32px] border border-slate-100 shadow-sm">
                <h4 className="text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em] text-center border-b border-slate-50 pb-3">Actions</h4>
                <div className="space-y-3">
                  <button onClick={handleBookmarkToggle} className={`${controlBtnClass} ${isBookmarked ? activeClass : idleClass} w-full`}>
                    {isBookmarked ? "In Library" : "Bookmark"} 
                    <span className="text-lg">{isBookmarked ? "💖" : "✨"}</span>
                  </button>
                  <button onClick={handleShare} className={`${controlBtnClass} ${idleClass} w-full`}>
                    Share Story <span className="text-lg">🚀</span>
                  </button>
                </div>
              </div>

              <div className="p-7 rounded-[32px] bg-gradient-to-br from-rose-50 to-orange-50 border border-white/60 shadow-sm">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3">NewsNova Analysis</p>
                <p className="text-[13px] font-serif italic text-slate-600 leading-relaxed">
                  This story is trending on <strong>NewsNova</strong>. We’ve analyzed multiple sources to bring you this summary.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;