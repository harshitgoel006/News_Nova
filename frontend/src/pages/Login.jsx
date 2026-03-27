

import { useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Loader2, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleLogin = async () => {
    setLocalError("");

    if (!email || !password) {
      return setLocalError("All fields are mandatory");
    }

    if (!email.includes("@")) {
      return setLocalError("Please enter a valid email");
    }

    await loginUser(email, password);

    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      navigate("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-6 relative overflow-hidden">
      {/* ✨ Signature Background Accents */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-rose-50/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-50/30 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <Sparkles size={12} className="text-rose-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">Welcome Back</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-none">
            Member <span className="text-rose-600 italic underline decoration-rose-100 underline-offset-8">Portal.</span>
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          {/* ❌ Error Handling */}
          <AnimatePresence mode="wait">
            {(error || localError) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 border border-red-100 rounded-2xl text-center"
              >
                {localError || error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* 📧 Email Field */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input 
                type="email" placeholder="Registered Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
              />
            </div>

            {/* 🔒 Password Field */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input 
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
              />
            </div>

            {/* 🔑 Action Button */}
            <button 
              onClick={handleLogin} disabled={loading}
              className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><LogIn size={14} /> Authenticate</>}
            </button>

            {/* 🔁 Secondary Actions */}
            <div className="pt-4 flex items-center justify-between px-2">
              <button 
                onClick={() => navigate("/forgot-password")}
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
              >
                Reset Password?
              </button>
              <div className="h-[1px] w-8 bg-slate-100" />
            </div>
          </div>
        </div>

        {/* 🆕 Registration Prompt */}
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          New to the platform? <span className="text-rose-600 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>Apply for Access</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;