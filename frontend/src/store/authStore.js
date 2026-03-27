import { create } from "zustand";
import { login, logout } from "../services/auth.service";
import { getCurrentUser } from "../services/user.service";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // 🔐 LOGIN
  loginUser: async (email, password) => {
  try {
    set({ loading: true, error: null });

    const res = await login(email, password);

    const { user, accessToken } = res.data.data;

    // 🔥 SAVE TOKEN
    localStorage.setItem("token", accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
      loading: false,
    });

  } catch (err) {
    set({
      error: err.response?.data?.message || "Login failed",
      loading: false,
    });
  }
},

  // 🚪 LOGOUT
  logoutUser: async () => {
  try {
    await logout();
  } catch (err) {
    console.error(err);
  }

  localStorage.removeItem("token"); // 🔥 IMPORTANT

  set({
    user: null,
    accessToken: null,
    isAuthenticated: false,
  });
},

  // 🔥 AUTO LOGIN (IMPORTANT)
 initAuth: async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token");

    const res = await getCurrentUser();

    set({
      user: res.data.data,
      accessToken: token,
      isAuthenticated: true,
    });

  } catch (err) {
    localStorage.removeItem("token");

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  }
},

}));

export default useAuthStore;