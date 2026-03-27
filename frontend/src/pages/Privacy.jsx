import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, Lock, Share2, Settings, FileText, ChevronDown, Search } from "lucide-react";

function Privacy() {
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye size={18} />,
      content: "NewsNova collects only the information necessary to enhance your experience. This includes saved articles, reading history, and basic account details like email. We do not collect unnecessary personal data."
    },
    {
      title: "How We Use Your Data",
      icon: <Settings size={18} />,
      content: "Data is used to personalize your news feed, improve recommendations, and enhance platform performance. Your data helps us deliver a smarter and more relevant news experience."
    },
    {
      title: "Data Protection",
      icon: <Lock size={18} />,
      content: "We implement industry-standard security measures. All sensitive information is securely stored and protected against unauthorized access using modern encryption standards."
    },
    {
      title: "Third-Party Services",
      icon: <Share2 size={18} />,
      content: "We may use trusted third-party services for analytics. However, we do not sell, trade, or share your personal information with any third party for marketing purposes."
    }
  ];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FDFDFF] selection:bg-rose-100">
      {/* 🌫️ Home Theme Gradients */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-rose-50/40 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-50/30 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="relative z-10 max-w-2xl mx-auto px-6 py-20"
      >
        {/* Header & Search */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Privacy <span className="text-rose-600 italic">Protocol.</span>
          </h1>
          
          {/* 🔍 Dynamic Search Bar */}
          
        </div>

        {/* 📋 Dynamic Accordion List */}
        <div className="space-y-3">
          {filteredSections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`overflow-hidden border transition-all duration-300 rounded-[24px] ${
                activeSection === idx 
                ? "bg-white border-rose-100 shadow-xl shadow-rose-500/5" 
                : "bg-white/50 border-slate-100 hover:border-slate-200"
              }`}
            >
              <button 
                onClick={() => setActiveSection(activeSection === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                    activeSection === idx ? "bg-rose-600 text-white rotate-6" : "bg-slate-50 text-slate-400"
                  }`}>
                    {section.icon}
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em]">{section.id}</span>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800">{section.title}</h3>
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-300 transition-transform duration-500 ${activeSection === idx ? "rotate-180 text-rose-500" : ""}`} 
                />
              </button>

              <AnimatePresence>
                {activeSection === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-6 ml-14 border-t border-slate-50 pt-4 pr-10">
                      <p className="text-slate-500 leading-relaxed text-[13px] font-serif italic">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Final Statement */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
           <span>Updated 03.2026</span>
           <span className="flex items-center gap-2 group cursor-pointer hover:text-rose-600 transition-colors">
             <ShieldCheck size={12} className="group-hover:animate-bounce" /> Verified Secure
           </span>
        </div>
      </motion.div>
    </div>
  );
}

export default Privacy;