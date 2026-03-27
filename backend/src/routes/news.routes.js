import { Router } from "express";
import {
  getTopHeadlines,
  getCategoryNews,
  searchNews
} from "../controllers/news.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { 
  searchQuerySchema, 
  headlinesQuerySchema, 
  categoryParamSchema 
} from "../validators/news.validator.js";

const router = Router();


router.get(
  "/headlines", 
  validate(headlinesQuerySchema), 
  getTopHeadlines
);

router.get(
  "/category/:category",
  validate(categoryParamSchema), 
  getCategoryNews
);

router.get(
  "/search", 
  validate(searchQuerySchema), 
  searchNews
);

export default router;

