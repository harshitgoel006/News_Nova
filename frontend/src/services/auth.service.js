import api from "./api";

// 🔐 SEND OTP
export const sendOtp = (email) =>
  api.post("/auth/send-otp", { email });

// 🔐 VERIFY OTP
export const verifyOtp = (email, otp) =>
  api.post("/auth/verify-otp", { email, otp });

// 👤 SIGNUP
export const signupUser = (data) =>
  api.post("/auth/signup", data);

// 🔑 LOGIN
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

// 🚪 LOGOUT
export const logout = () =>
  api.post("/auth/logout");

// 🔁 FORGOT PASSWORD
export const sendResetOtp = (email) =>
  api.post("/auth/send-reset-otp", { email });

export const verifyResetOtp = (email, otp) =>
  api.post("/auth/verify-reset-otp", { email, otp });

export const resetPassword = (email, otp, newPassword) =>
  api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });