import axios from "axios";
import { News } from "../models/news.model.js";
import { getCache, setCache } from "../utils/cache.js";


const GNEWS_KEYS = [
  process.env.NEWS_API_KEY_1, 
  process.env.NEWS_API_KEY_2
];

const NEWSDATA_KEYS = [
  process.env.NEWSDATA_API_KEY_1, 
  process.env.NEWSDATA_API_KEY_2
];

const CURRENTS_KEYS = [
  process.env.CURRENTS_API_KEY_1, 
  process.env.CURRENTS_API_KEY_2
];


let gnewsIndex = 0, newsdataIndex = 0, currentsIndex = 0;
let isFetching = false;


const normalizeCategory = (cat) => cat?.toLowerCase().trim();
const normalizeTitle = (title) => title?.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
const generateKey = (article) => normalizeTitle(article.title);



const isDataFresh = async (country, category) => {
  const latest = await News.findOne({ country, category })
    .sort({ createdAt: -1 }); 

  return latest && (Date.now() - new Date(latest.createdAt).getTime()) < 45 * 60 * 1000;
};

export const getCombinedNews = async (
  country = "in",
  category = "general",
  forceRefresh = false,
  page = 1,
  limit = 20
) => {
  const cleanCategory = normalizeCategory(category);
  const cacheKey = `news:${country}:${cleanCategory}:page:${page}:limit:${limit}`;

  if (isFetching) {
    console.log("Already fetching, skipping...");
    return;
  }

  const cached = await getCache(cacheKey);

  if (cached && !forceRefresh) {
    console.log("CACHE HIT");
    return cached;
  }

  const skip = (page - 1) * limit;

  const dbCount = await News.countDocuments(
    { 
      country, 
      category: cleanCategory 
    }
  );

  const fresh = await isDataFresh(country, cleanCategory);

  if (dbCount >= 10 && fresh && !forceRefresh) {

    console.log("DB HIT");

    const dbNews = await News.find({ country, category: cleanCategory })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const response = {
      data: dbNews,
      meta: {
        total: dbCount,
        page,
        limit,
        totalPages: Math.ceil(dbCount / limit),
        hasNextPage: page < Math.ceil(dbCount / limit),
      },
    };

    await setCache(cacheKey, response, 1800);
    return response;
  }

  console.log(`API HIT | Count: ${dbCount} | Fresh: ${fresh}`);

  isFetching = true;

  let articles = [];

  try {

    for (let i = 0; i < GNEWS_KEYS.length; i++) {

      try {
        const key = GNEWS_KEYS[gnewsIndex];
        gnewsIndex = (gnewsIndex + 1) % GNEWS_KEYS.length;

        const res = await axios.get("https://gnews.io/api/v4/top-headlines", {
          params: { token: key, country, topic: cleanCategory, lang: "en", max: 50 },
        });

        articles = res.data.articles || [];
        if (articles.length >= 5) break;
      } catch {
        console.log("GNews fail");
      }
    }

    if (articles.length < 5) {
      for (let i = 0; i < NEWSDATA_KEYS.length; i++) {
        try {
          const key = NEWSDATA_KEYS[newsdataIndex];
          newsdataIndex = (newsdataIndex + 1) % NEWSDATA_KEYS.length;

          const res = await axios.get("https://newsdata.io/api/1/news", {
            params: { apikey: key, country, category: cleanCategory, language: "en" },
          });

          articles = res.data.results || [];
          if (articles.length >= 5) break;
        } catch {
          console.log("NewsData fail");
        }
      }
    }

    if (articles.length < 5) {
      for (let i = 0; i < CURRENTS_KEYS.length; i++) {
        try {
          const key = CURRENTS_KEYS[currentsIndex];
          currentsIndex = (currentsIndex + 1) % CURRENTS_KEYS.length;

          const res = await axios.get("https://api.currentsapi.services/v1/latest-news", {
            params: { apiKey: key, country, category: cleanCategory },
          });

          articles = res.data.news || [];
          if (articles.length >= 5) break;
        } catch {
          console.log("Currents fail");
        }
      }
    }

    articles = articles.map(a => ({
      title: a.title,
      description: a.description,
      url: a.url || a.link,
      image: a.image || a.image_url,
      source: a.source?.name || a.source_id || a.author,
      publishedAt: a.publishedAt || a.pubDate || a.published,
      category: cleanCategory,
      country,
    }));


    articles = articles.filter(a => a.title && a.title.length > 10);

    const seen = new Set();
    articles = articles.filter(a => {
      const key = generateKey(a);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    for (const article of articles) {
      await News.updateOne(
        { uniqueKey: generateKey(article) },
        { $set: { ...article, uniqueKey: generateKey(article) } },
        { upsert: true }
      );
    }

    const updatedCount = await News.countDocuments(
      { 
        country, 
        category: cleanCategory 
      }
    );

    const updatedNews = await News.find(
      { 
        country, 
        category: cleanCategory 
      }
    )
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

      
    const response = {
      data: updatedNews,
      meta: {
        total: updatedCount,
        page,
        limit,
        totalPages: Math.ceil(updatedCount / limit),
        hasNextPage: page < Math.ceil(updatedCount / limit),
      },
    };

    await setCache(cacheKey, response, 1800);
    return response;

  } finally {
    isFetching = false;
  }
};