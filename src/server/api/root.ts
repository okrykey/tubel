import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "./routers/category";
import { commentRouter } from "./routers/comment";
import { postRouter } from "./routers/post";
import { tagRouter } from "./routers/tag";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  user: userRouter,
  tag: tagRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
