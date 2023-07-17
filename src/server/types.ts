import { z } from "zod";

export const updatePostInput = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "must be at least 1 letter")
    .max(50, "must be 50 letters or less"),
  content: z
    .string()
    .min(1, "must be at least 1 letter")
    .max(300, "must be 300 letters or less"),
});

export const createPostInput = z.object({
  title: z
    .string()
    .min(1, "must be at least 1 letter")
    .max(50, "must be 50 letters or less"),
  content: z
    .string()
    .min(1, "must be at least 1 letter")
    .max(140, "must be 140 letters or less"),
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
