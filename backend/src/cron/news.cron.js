import cron from "node-cron";
import { getCombinedNews } from "../services/news.service.js";
import { News } from "../models/news.model.js";
import logger from "../utils/logger.js";

const categories = [
  "general","technology","business","sports",
  "science","health","entertainment","politics"
];

const country = "in";
let index = 0;
let apiCallsToday = 0;
const MAX_DAILY_CALLS = 100;

// 🔄 Reset counter daily
cron.schedule("0 0 * * *", () => {
  apiCallsToday = 0;
  logger.info("🔄 API counter reset");
});

// 🔥 CRON (every 30 min, controlled)
export const startNewsCron = () => {

  cron.schedule("*/30 * * * *", async () => {
    if (apiCallsToday >= MAX_DAILY_CALLS) {
      logger.warn("⚠️ DAILY LIMIT REACHED");
      return;
    }

    const category = categories[index];

    const count = await News.countDocuments({ country, category });

    const latest = await News.findOne({ country, category })
      .sort({ createdAt: -1 })

    const fresh = latest && (Date.now() - new Date(latest.publishedAt).getTime()) < 45 * 60 * 1000;

    if (count < 10 || !fresh) {
      logger.info(`🚀 Fetching ${category} | Count: ${count} | Fresh: ${fresh}`);
      
      await getCombinedNews(country, category); // ❌ no forceRefresh
      
      apiCallsToday++;
    } else {
      logger.info(`⏭ Skipped ${category} (fresh data)`);
    }

    index = (index + 1) % categories.length;
  });
};