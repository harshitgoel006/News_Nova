import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0F172A] text-white border-t border-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* 🚀 NewsNova Compact Branding */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="text-xl font-serif font-bold tracking-tight">
              News<span className="text-rose-500 italic">Nova</span>
            </Link>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">
              Pulse of the Globe
            </p>
          </div>

          {/* 🔗 Minimal Links (Connected to Pages) */}
          <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/about" className="hover:text-rose-500 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-rose-500 transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-rose-500 transition-colors">Privacy</Link>
          </nav>

          {/* 📱 Social Icons (Clean Styles) */}
          

        </div>

        {/* ⚖️ Compact Bottom Line */}
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            © {currentYear} NewsNova Media
          </p>
          <p className="text-[9px] text-slate-600 italic">
            Designed for the modern reader.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;