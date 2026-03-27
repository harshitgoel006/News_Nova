import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim().length === 0) {
        onSearch("");
      } 
      else if (input.trim().length >= 3) {
        onSearch(input);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  const premiumGradient = "from-orange-500 via-rose-500 to-red-600";

  return (
    <div className="mb-8 w-full max-w-2xl mx-auto px-4">
      <div className="relative group">
        
        {/* EXTERNAL GLOW EFFECT (Visible on focus) */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`absolute -inset-1 bg-gradient-to-r ${premiumGradient} rounded-[2rem] blur-xl opacity-20 z-0`}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex items-center">
          {/* SEARCH ICON */}
          <div className="absolute left-5 transition-colors duration-300">
            <svg 
              width="18" height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`${isFocused ? "stroke-rose-500" : "stroke-slate-400"} transition-colors duration-300`}
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          {/* INPUT FIELD */}
          <input
            type="text"
            placeholder="Search premium news..."
            value={input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full pl-14 pr-16 py-4 bg-white/80 backdrop-blur-xl border rounded-[2rem] 
                       text-slate-800 placeholder:text-slate-400 font-medium tracking-wide
                       transition-all duration-500 outline-none
                       ${isFocused 
                         ? "border-rose-200 shadow-[0_10px_30px_-10px_rgba(244,63,94,0.15)] ring-1 ring-rose-100" 
                         : "border-slate-100 shadow-sm hover:border-slate-200"}`}
          />

          {/* KEYBOARD SHORTCUT (Premium Aesthetic) */}
          <div className="absolute right-5 hidden md:flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-500">
              ⌘
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-500">
              K
            </span>
          </div>

          {/* ACTIVE INDICATOR LINE */}
          <motion.div 
            className={`absolute bottom-0 left-10 right-10 h-[2px] bg-gradient-to-r ${premiumGradient} rounded-full`}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;