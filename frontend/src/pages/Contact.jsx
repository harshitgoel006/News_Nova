import { motion } from "framer-motion";
import { Mail, Twitter, Instagram, Linkedin, ArrowUpRight, MessageSquare } from "lucide-react";

function Contact() {
  const channels = [
    { label: "Email", value: "support@newsnova.com", link: "mailto:support@newsnova.com", icon: <Mail size={18} />, action: "Write" },
    { label: "Twitter", value: "@NewsNova_HQ", link: "https://twitter.com", icon: <Twitter size={18} />, action: "Follow" },
    { label: "Instagram", value: "@newsnova_daily", link: "https://instagram.com", icon: <Instagram size={18} />, action: "View" },
    { label: "LinkedIn", value: "NewsNova Media", link: "https://linkedin.com", icon: <Linkedin size={18} />, action: "Connect" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FDFDFF]">
      {/* ✨ Subtle Light Gradient Overlays (Home Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/30 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="relative z-10 min-h-screen py-24 px-6 flex flex-col items-center justify-center"
      >
        <div className="max-w-2xl w-full text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-6"
          >
            <MessageSquare size={10} className="text-rose-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">Newsroom Access</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            Let's <span className="text-rose-600 italic underline decoration-rose-200 underline-offset-8">Connect.</span>
          </h2>
          <p className="text-slate-500 font-serif italic text-lg max-w-lg mx-auto leading-relaxed">
            Direct access to our editorial desk and support teams. We value transparency and your feedback.
          </p>
        </div>

        {/* 📰 Premium Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
          {channels.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.link}
              target={item.label !== "Email" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white/70 backdrop-blur-md p-6 rounded-[28px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(225,29,72,0.06)] hover:border-rose-200 transition-all duration-500"
            >
              <div className="flex items-center gap-5 relative z-10">
                {/* Modern Icon Box */}
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 group-hover:rotate-[-8deg]">
                  {item.icon}
                </div>

                <div className="flex-1 space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-rose-600 transition-colors">
                    {item.label}
                  </span>
                  <p className="text-sm font-bold text-slate-800 tracking-tight group-hover:translate-x-1 transition-transform">
                    {item.value}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight size={16} className="text-rose-500" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
            NewsNova Media Group — Global Desk
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Contact;