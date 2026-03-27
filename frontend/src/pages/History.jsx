import { useEffect, useState } from "react";
import { getHistory, clearHistory } from "../services/history.service";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, Clock, ArrowRight, History as HistoryIcon } from "lucide-react";

const History = () => {
  const [data, setData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ NEW
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      const history = res.data.data?.data || res.data.data || [];
      setData(history);
    } catch (err) {
      console.error("History fetch error", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ❌ OLD removed
  // window.confirm()

  // ✅ NEW FLOW
  const handleClear = () => {
    setShowConfirm(true);
  };

  const confirmClear = async () => {
    try {
      await clearHistory();
      setData([]);
    } catch (err) {
      console.error("Clear error", err);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleOpen = (item) => {
    navigate(`/news/${encodeURIComponent(item.url)}`, {
      state: { ...item },
    });
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-10 px-4 min-h-screen">

      {/* 🏛️ HEADING */}
      <div className="mb-10 text-center relative">
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-rose-500 font-bold text-xs uppercase tracking-[0.3em]"
        >
          Your Activity
        </motion.span>

        <motion.h1 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-serif font-bold text-slate-900 mt-2"
        >
          Reading <span className="italic text-slate-500 underline decoration-rose-200">History</span>
        </motion.h1>

        {/* 🧹 CLEAR BUTTON */}
        {data.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={handleClear}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors border border-slate-100 px-4 py-2 rounded-full hover:bg-red-50 hover:border-red-100"
            >
              <Trash2 size={12} /> Clear Journey
            </button>
          </motion.div>
        )}
      </div>

      {/* 📭 EMPTY STATE */}
      {data.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center mt-20 space-y-4"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <HistoryIcon size={24} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-serif italic text-lg">
            No footprints found. Start reading to build your history.
          </p>
        </motion.div>
      )}

      {/* 📖 HISTORY LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((item, idx) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
              className="group bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-rose-100 transition-all cursor-pointer flex items-center justify-between"
              onClick={() => handleOpen(item)}
            >
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500">
                    {item.source?.name || item.source || "News"}
                  </span>
                  <div className="h-[1px] w-4 bg-slate-100" />
                  <span className="flex items-center gap-1 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    <Clock size={10} /> Read recently
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-slate-800 leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>

              <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-all group-hover:rotate-[-8deg]">
                <ArrowRight size={16} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      {data.length > 0 && (
        <div className="mt-20 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-200">
            End of Activity
          </p>
        </div>
      )}

      {/* ✅ CUSTOM CONFIRM MODAL (UI SAME THEME) */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
            >
              <h2 className="text-lg font-serif font-bold text-slate-900 mb-2">
                Clear Reading History
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to wipe your reading history?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmClear}
                  className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;