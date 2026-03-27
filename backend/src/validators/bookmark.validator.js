import { z } from "zod";

export const bookmarkSchema = z.object({
  body: z.object({
    articleId: z.string().min(1),

    title: z.string().min(3).max(300).optional(),

    url: z.string().url(),

    source: z.string().min(2).optional(),

    image: z
      .string()
      .url()
      .optional()
      .or(z.literal("")),

    publishedAt: z.string().datetime().optional(),
  }),
});