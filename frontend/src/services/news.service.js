import axios from "axios";
import api from "./api";

//////////////////////////////////////////////////////////
// 📰 NORMAL REQUEST (NO CANCEL)
//////////////////////////////////////////////////////////

const makeRequest = async (url, params = {}) => {
  try {
    const res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    return { data: [] };
  }
};

//////////////////////////////////////////////////////////
// 🔍 SEARCH REQUEST (WITH CANCEL)
//////////////////////////////////////////////////////////

let searchCancelSource = null;

export const searchNews = async (query) => {
  try {
    if (searchCancelSource) {
      searchCancelSource.cancel("Previous search cancelled");
    }

    searchCancelSource = axios.CancelToken.source();

    const res = await api.get("/news/search", {
      params: { q: query },
      cancelToken: searchCancelSource.token,
    });

    return res.data;

  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Search cancelled");
    } else {
      console.error("Search Error:", error);
    }
    return { data: [] };
  }
};

//////////////////////////////////////////////////////////
// 📰 GET ALL NEWS
//////////////////////////////////////////////////////////

export const getAllNews = async () => {
  return await makeRequest("/news/headlines", {
    country: "in",
  });
};

//////////////////////////////////////////////////////////
// 📂 GET CATEGORY NEWS
//////////////////////////////////////////////////////////

export const getCategoryNews = async (category) => {
  return await makeRequest(`/news/category/${category}`, {
    country: "in",
  });
};