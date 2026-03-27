import api from "./api";

// ➕ ADD
export const addHistory = (data) => {
  return api.post("/history", data);
};

// 📥 GET
export const getHistory = () => {
  return api.get("/history");
};

// ❌ CLEAR ALL
export const clearHistory = () => {
  return api.delete("/history");
};