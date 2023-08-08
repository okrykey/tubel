import { z } from "zod";

export const updatePostInput = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  videoId: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
});

export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
  videoId: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
});

export const createCommentInput = z.object({
  content: z
    .string()
    .min(1, "must be at least 1 letter")
    .max(100, "must be 100 letters or less"),
  postId: z.string(),
});

export const updateCommentInput = z.object({
  id: z.string(),
  content: z
    .string()
    .min(1, "must be at least 1 letter")
    .max(100, "must be 100 letters or less"),
});

export const createInput = z.object({
  useId: z.string(),
  postId: z.string(),
});
