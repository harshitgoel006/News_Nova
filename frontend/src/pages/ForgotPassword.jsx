import { useState } from "react";
import { sendResetOtp, verifyResetOtp, resetPassword } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, ShieldCheck, Lock, ArrowRight, Loader2, ChevronLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    try {
      setLoading(true); setError(""); setSuccess("");
      if (!email) return setError("Email is required to proceed");
      await sendResetOtp(email);
      setSuccess("Recovery code dispatched to your inbox 📩");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate recovery");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true); setError(""); setSuccess("");
      if (!otp) return setError("Please enter the recovery code");
      await verifyResetOtp(email, otp);
      setSuccess("Identity confirmed ✅");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true); setError(""); setSuccess("");
      if (!newPassword) return setError("New password cannot be empty");
      await resetPassword(email, otp, newPassword);
      setSuccess("Access restored successfully 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Finalization failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-6 relative overflow-hidden">
      {/* ✨ Signature Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-rose-50/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-50/30 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to Login Link */}
        <button 
          onClick={() => navigate("/login")}
          className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition-colors"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Login
        </button>

        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-4">
            <KeyRound size={12} className="text-rose-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Recovery Mode</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Reset <span className="text-rose-600 italic underline decoration-rose-100 underline-offset-8">Access.</span>
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          {/* Notifications */}
          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center border ${
                  error ? "text-red-500 bg-red-50/50 border-red-100" : "text-emerald-600 bg-emerald-50/50 border-emerald-100"
                }`}
              >
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* STEP 1: EMAIL DISCOVERY */}
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="email" placeholder="Account Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
                  />
                </div>
                <button 
                  onClick={handleSendOtp} disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Request Reset Code"} <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: CODE VERIFICATION */}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="text" placeholder="Recovery Code" value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-black tracking-[1em]"
                  />
                </div>
                <button 
                  onClick={handleVerifyOtp} disabled={loading}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Verify Code"}
                </button>
                <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-widest cursor-pointer hover:text-rose-600" onClick={() => setStep(1)}>
                  Resend Code?
                </p>
              </motion.div>
            )}

            {/* STEP 3: PASSWORD REGENERATION */}
            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="password" placeholder="New Secret Password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-rose-100 outline-none transition-all text-sm font-serif italic"
                  />
                </div>
                <button 
                  onClick={handleResetPassword} disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Finalize Reset"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;