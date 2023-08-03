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
  getUserPosts: protectedProcedure
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
              title: true,
              videoId: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
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

  getUserBookmarkList: protectedProcedure.query(async ({ ctx }) => {
    const allBookmarks = await ctx.prisma.bookmark.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            videoId: true,
            createdAt: true,
          },
        },
      },
    });

    const bookmarkedPosts = allBookmarks.map((bookmark) => bookmark.post);

    return bookmarkedPosts;
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
