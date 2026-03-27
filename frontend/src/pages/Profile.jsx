import { useState, useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateProfile,
  updateInterests,
  changePassword,
  sendEmailChangeOtp,
  verifyEmailChange,
} from "../services/user.service";
import {
  User, ShieldCheck, Mail, Heart, Globe, CheckCircle2,
  AlertCircle, Save, X, Hash, ChevronRight, Loader2, Sparkles
} from "lucide-react";

const Profile = () => {
  const { user, initAuth } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [fullname, setFullname] = useState("");
  const [country, setCountry] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setCountry(user.country || "");
      setInterestsInput(user.interests?.join(", ") || "");
    }
  }, [user]);

  const handleAction = async (fn, successMsg) => {
    try {
      setLoading(true); setError(""); setSuccess("");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      await fn();
      await initAuth();
      setSuccess(successMsg);
      timeoutRef.current = setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } finally { setLoading(false); }
  };

  const handleProfileUpdate = () =>
    handleAction(async () => {
      await updateProfile({ fullname, country });
      setEditMode(false);
    }, "Identity updated ✅");

  const handleInterestUpdate = () =>
    handleAction(async () => {
      const cleaned = interestsInput.split(",").map((i) => i.trim().toLowerCase()).filter((i) => i.length > 0);
      await updateInterests(cleaned);
    }, "Preferences saved ✅");

  const handlePassword = () =>
    handleAction(async () => {
      await changePassword(oldPassword, newPassword);
      setOldPassword(""); setNewPassword("");
    }, "Access Updated 🔐");

  const handleSendOtp = () =>
    handleAction(async () => {
      await sendEmailChangeOtp(newEmail);
      setStep(2);
    }, "Verification code sent 📩");

  const handleVerifyOtp = () =>
    handleAction(async () => {
      await verifyEmailChange(newEmail, otp);
      setStep(1); setNewEmail(""); setOtp("");
    }, "Email Migrated ✅");

  return (
    <div className="max-w-6xl mx-auto pt-32 pb-20 px-6 min-h-screen bg-[#FDFDFF] relative overflow-hidden selection:bg-rose-100 selection:text-rose-900">
      {/* 🌌 Animated Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-100/30 blur-[140px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 blur-[120px] rounded-full -z-10" />

      {/* HEADER */}
      <div className="mb-20 text-center relative">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-rose-100 shadow-sm rounded-full mb-6">
          <Sparkles size={12} className="text-rose-500" />
          <span className="text-rose-600 font-black text-[9px] uppercase tracking-[0.4em]">Management Console</span>
        </motion.div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 mt-2">
          Member <span className="italic text-slate-500 underline decoration-rose-200">Account</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: STATIC USER CARD */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-10 border border-white shadow-[0_30px_60px_rgba(0,0,0,0.03)] text-center relative group hover:shadow-[0_40px_80px_rgba(244,63,94,0.08)] transition-all duration-500 border-b-rose-100/50">
            <div className="w-32 h-32 bg-slate-900 rounded-[32px] flex items-center justify-center text-white font-serif italic text-5xl mx-auto mb-8 shadow-2xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               {user?.fullname?.charAt(0) || "U"}
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 leading-tight">{user?.fullname}</h3>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               <Globe size={10} className="text-rose-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{user?.country || "Global"}</span>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 opacity-60"><Mail size={10} /> Contact Inbox</span>
              <p className="text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-1 rounded-full border border-slate-100">{user?.email}</p>
            </div>
          </motion.div>

          {/* STATUS MESSAGES */}
          <AnimatePresence mode="wait">
            {(success || error) && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-[28px] border flex items-center gap-4 shadow-sm ${error ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}>
                <div className={`p-2 rounded-xl ${error ? "bg-red-100" : "bg-emerald-100"}`}>
                   {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error || success}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: FORMS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. IDENTITY SECTION */}
          <section className="bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-white shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform"><User size={24} /></div>
                <div>
                   <h4 className="font-serif font-bold text-2xl text-slate-900">Identity Profile</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Information</p>
                </div>
              </div>
              <button onClick={() => setEditMode(!editMode)} className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-700 underline decoration-rose-100 underline-offset-8 transition-all px-4 py-2 hover:bg-rose-50 rounded-full">
                {editMode ? "Abort Changes" : "Modify Identity"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</label>
                <input value={fullname} disabled={!editMode} onChange={(e) => setFullname(e.target.value)}
                  className={`w-full p-5 rounded-2xl text-sm font-semibold transition-all ${editMode ? "bg-white border-rose-200 border-2 shadow-inner outline-none focus:ring-4 focus:ring-rose-50/50" : "bg-slate-50/50 border-transparent border-2 cursor-not-allowed"}`} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Native Region</label>
                <input value={country} disabled={!editMode} onChange={(e) => setCountry(e.target.value)}
                  className={`w-full p-5 rounded-2xl text-sm font-semibold transition-all ${editMode ? "bg-white border-rose-200 border-2 shadow-inner outline-none focus:ring-4 focus:ring-rose-50/50" : "bg-slate-50/50 border-transparent border-2 cursor-not-allowed"}`} />
              </div>
            </div>
            {editMode && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={handleProfileUpdate} disabled={loading}
                className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-200 transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Commit Identity</>}
              </motion.button>
            )}
          </section>

          {/* 2. INTERESTS SECTION */}
          <section className="bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-rose-50 rounded-[20px] flex items-center justify-center text-rose-500 border border-rose-100 shadow-inner group-hover:-rotate-6 transition-transform"><Heart size={24} /></div>
              <div>
                 <h4 className="font-serif font-bold text-2xl text-slate-900">Curation Tags</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed Personalization</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {user?.interests?.map((tag) => (
                <span key={tag} className="px-4 py-2 bg-white text-[10px] font-black text-slate-500 rounded-xl border border-slate-100 uppercase tracking-wider shadow-sm hover:border-rose-200 hover:text-rose-500 transition-colors">#{tag}</span>
              ))}
            </div>
            <div className="relative group/input">
              <input value={interestsInput} onChange={(e) => setInterestsInput(e.target.value)} placeholder="tech, lifestyle, sports..."
                className="w-full pl-8 pr-20 py-6 bg-slate-50/50 border-2 border-transparent rounded-[28px] focus:bg-white focus:border-rose-100 focus:ring-8 focus:ring-rose-50/30 outline-none transition-all text-sm font-serif italic" />
              <button onClick={handleInterestUpdate} className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center hover:bg-rose-600 transition-all shadow-xl hover:-translate-x-1">
                <ChevronRight size={22} />
              </button>
            </div>
          </section>

          {/* 3. ACCESS & INBOX (GRID) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PASSWORD */}
            <div className="bg-white p-10 rounded-[44px] border border-slate-100 space-y-5 shadow-sm hover:border-rose-200 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><ShieldCheck size={20} /></div><h4 className="font-serif font-bold text-lg">Access Security</h4></div>
              <input type="password" placeholder="Current Secret" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-rose-100 transition-all" />
              <input type="password" placeholder="New Secret" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-rose-100 transition-all" />
              <button onClick={handlePassword} className="w-full py-5 bg-slate-900 text-white rounded-[22px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 shadow-lg shadow-slate-200 transition-all">Update Key</button>
            </div>

            {/* EMAIL */}
            <div className="bg-white p-10 rounded-[44px] border border-slate-100 space-y-5 shadow-sm hover:border-blue-200 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Mail size={20} /></div><h4 className="font-serif font-bold text-lg">Inbox Migration</h4></div>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <input placeholder="New Target Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-100 transition-all" />
                    <button onClick={handleSendOtp} className="w-full py-5 bg-rose-50 text-rose-600 rounded-[22px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all">Send OTP Code</button>
                  </motion.div>
                ) : (
                  <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <input placeholder="Enter Code" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-black tracking-[0.8em] text-center outline-none border-2 border-rose-100 focus:bg-white transition-all" />
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="p-5 bg-slate-50 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><X size={18} /></button>
                      <button onClick={handleVerifyOtp} className="flex-1 py-5 bg-emerald-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-emerald-100 transition-all">Verify Migration</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;