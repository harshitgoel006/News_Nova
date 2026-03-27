import { getCombinedNews } from "../services/news.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { News } from "../models/news.model.js";

// ==============================
// GET ALL NEWS (HEADLINES)
// ==============================
export const getTopHeadlines = asyncHandler(async (req, res) => {
  const country = req.query.country || "in";

  const { page, limit } = getPagination(req.query);

  const result = await getCombinedNews(
    country,
    "general",
    false,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result.data,
      "Top headlines fetched",
      result.meta
    )
  );
});

// ==============================
// GET CATEGORY NEWS
// ==============================
export const getCategoryNews = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const country = req.query.country || "in";

  const { page, limit } = getPagination(req.query);

  const result = await getCombinedNews(
    country,
    category,
    false,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result.data,
      `${category} news fetched`,
      result.meta
    )
  );
});

// ==============================
// SEARCH NEWS
// ==============================
export const searchNews = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json(
      new ApiResponse(400, [], "Search query required")
    );
  }

  const { page, limit } = getPagination(req.query);

  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { source: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ],
  };

  const total = await News.countDocuments(filter);

  const news = await News.find(filter)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      news,
      "Search results",
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    )
  );
});