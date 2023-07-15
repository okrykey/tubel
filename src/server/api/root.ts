import { createTRPCRouter } from "~/server/api/trpc";
import { commentRouter } from "./routers/comment";
import { favoriteRouter } from "./routers/favorite";
import { likeRouter } from "./routers/like";
import { postRouter } from "./routers/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  likes: likeRouter,
  favorite: favoriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
