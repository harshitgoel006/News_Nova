
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";

function Navbar() {
  const { isAuthenticated, logoutUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // ✅ FIXED active route logic
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    ...(isAuthenticated
      ? [
          { name: "Bookmarks", path: "/bookmarks" },
          { name: "History", path: "/history" },
          { name: "Profile", path: "/profile" },
        ]
      : []),
  ];

  const premiumGradient = "bg-gradient-to-r from-orange-500 via-rose-500 to-red-600";
  const textGradient = "bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-600";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-4 md:px-8 py-4 pointer-events-none">
        <motion.nav
          initial={false}
          animate={{
            width: isScrolled ? "92%" : "100%",
            maxWidth: isScrolled ? "1100px" : "1200px",
            y: isScrolled ? 12 : 0,
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)",
            boxShadow: isScrolled 
              ? "0 20px 40px -15px rgba(244, 63, 94, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              : "0 0px 0px rgba(0,0,0,0)",
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="relative mx-auto pointer-events-auto rounded-[24px] border border-white/40 backdrop-blur-xl py-2.5 px-6 md:px-10"
        >
          <div className="flex justify-between items-center relative z-10">
            
            {/* LOGO */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                className={`w-10 h-10 ${premiumGradient} rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30`}
              >
                <span className="text-white font-serif text-xl font-bold italic">N</span>
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-[7px] uppercase tracking-[0.5em] text-rose-600 font-black group-hover:tracking-[0.7em] transition-all duration-500">Exclusive</span>
                <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900">
                  News<span className={textGradient}>Nova</span>
                </h1>
              </div>
            </motion.div>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-white/20">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group relative px-5 py-2 text-[13px] font-bold tracking-wide transition-all duration-300"
                >
                  <motion.span 
                    className={`relative z-10 transition-colors duration-300 ${isActive(link.path) ? "text-white" : "text-slate-500 group-hover:text-rose-600"}`}
                  >
                    {link.name}
                  </motion.span>

                  {!isActive(link.path) && (
                    <span className="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 scale-90 group-hover:scale-100" />
                  )}

                  {isActive(link.path) && (
                    <motion.span
                      layoutId="activePill"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`absolute inset-0 ${premiumGradient} rounded-xl shadow-lg shadow-rose-500/25`}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated ? (
  <motion.button
    onClick={handleLogout}
    whileHover={{ x: 3 }}
    className="text-[11px] font-black text-slate-400 hover:text-red-500 uppercase tracking-[0.2em] transition-all flex items-center gap-2"
  >
    Log Out
    <span className="text-lg">→</span>
  </motion.button>
) : (
  <div className="flex items-center gap-4">
    
    {/* LOGIN */}
    <button
      onClick={() => navigate("/login")}
      className="text-[11px] font-black text-slate-500 hover:text-rose-600 uppercase tracking-[0.2em] transition-all"
    >
      Login
    </button>

    {/* SIGNUP */}
    <motion.button 
      onClick={() => navigate("/signup")}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 15px 30px -10px rgba(244, 63, 94, 0.4)" 
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden px-6 py-2 ${premiumGradient} text-white text-[11px] font-black tracking-widest uppercase rounded-xl transition-all group`}
    >
      <span className="relative z-10">Join Circle</span>

      <motion.div 
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
      />
    </motion.button>

  </div>
)}
            </div>

            {/* MOBILE BUTTON */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 7h16M10 17h10" strokeLinecap="round" />
              </svg>
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-4 right-4 bottom-4 w-[220px] bg-white/95 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/60"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-50">
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${textGradient}`}>Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="hover:rotate-90 transition-transform duration-300 p-1 text-slate-400">
                  ✕
                </button>
              </div>

              <div className="p-3 flex flex-col gap-1.5">
                {navLinks.map((link, idx) => (
                  <motion.div key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-6 py-3.5 rounded-2xl text-[13px] font-bold ${
                        isActive(link.path) ? `${premiumGradient} text-white` : "text-slate-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* ✅ CONDITIONAL AUTH */}
              <div className="mt-auto p-6 flex flex-col gap-3">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className={`${premiumGradient} text-white py-3 rounded-xl`}>
                    Logout
                  </button>
                ) : (
                  <>
                    <button onClick={() => navigate("/login")} className="bg-gray-200 py-3 rounded-xl">
                      Login
                    </button>
                    <button onClick={() => navigate("/signup")} className={`${premiumGradient} text-white py-3 rounded-xl`}>
                      Signup
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;