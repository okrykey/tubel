import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
          image: true,
          username: true,
          name: true,
          _count: {
            select: {
              post: true,
              comment: true,
            },
          },
        },
      });
    }),
  getUserPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          post: {
            select: {
              id: true,
              slug: true,
              title: true,
              content: true,
              createdAt: true,
              bookmarks: true,
              tags: true,
              user: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
            },
          },
        },
      });
    }),
});
