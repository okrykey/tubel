import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
  getUserAvatar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          image: true,
          username: true,
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
              videoId: true,
              createdAt: true,
              _count: {
                select: {
                  bookmarks: true,
                  comment: true,
                },
              },
              user: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: ctx.session?.user?.id
                ? {
                    where: {
                      userId: ctx.session?.user?.id,
                    },
                  }
                : false,
              tags: {
                select: {
                  name: true,
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
