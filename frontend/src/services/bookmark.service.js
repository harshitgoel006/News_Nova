import api from "./api";

// ⭐ ADD
export const addBookmark = (data) => {
  return api.post("/bookmarks", data);
};

// 📥 GET ALL
export const getBookmarks = () => {
  return api.get("/bookmarks");
};

// ❌ REMOVE
export const removeBookmark = (id) => {
  return api.delete(`/bookmarks/${id}`);
};