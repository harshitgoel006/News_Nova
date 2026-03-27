import { useState } from "react";
import { sendOtp, verifyOtp, signupUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { loginUser } = useAuthStore();

  const handleSendOtp = async () => {
  if (loading) return;

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    await sendOtp(email);

    setSuccess("Magic link sent to your inbox 📩");
    setStep(2);

  } catch (err) {
    const msg = err.response?.data?.message || "Failed to send OTP";

    // 🔥 MAIN LOGIC
    if (msg.toLowerCase().includes("already exists")) {
      setError("Account already exists. Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } else {
      setError(msg);
    }
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOtp = async () => {
    if (loading) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      await verifyOtp(email, otp);
      setSuccess("Identity verified ✅");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (loading) return;
    try {
      setLoading(true); setError(""); setSuccess("");
      await signupUser({ fullname, email, password });
      setSuccess("Welcome to the inner circle 🎉");
      await loginUser(email, password);
      if (useAuthStore.getState().isAuthenticated) navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-6 relative overflow-hidden">
      {/* ✨ Signature Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/30 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-4">
            <ShieldCheck size={12} className="text-rose-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Access</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Join <span className="text-rose-600 italic underline decoration-rose-100 underline-offset-8">NewsNova.</span>
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          {/* Notifications */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 text-[11px] font-bold uppercase tracking-widest text-red-500 bg-red-50/50 border border-red-100 rounded-2xl text-center">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="email" placeholder="Institutional Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
                  />
                </div>
                <button 
                  onClick={handleSendOtp} disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Initialize OTP"} <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="text" placeholder="Enter 6-digit Code" value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-black tracking-[1em]"
                  />
                </div>
                <button 
                  onClick={handleVerifyOtp} disabled={loading}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Verify Identity"}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-rose-600" onClick={() => setStep(1)}>
                  Change Email?
                </p>
              </motion.div>
            )}

            {/* STEP 3: FINAL DETAILS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="text" placeholder="Full Legal Name" value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="password" placeholder="Choose Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
                  />
                </div>
                <button 
                  onClick={handleSignup} disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Finalize Profile"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Already have an account? <span className="text-rose-600 cursor-pointer hover:underline" onClick={() => navigate("/login")}>Sign In</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;