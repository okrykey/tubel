import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createPostInput, updatePostInput } from "~/server/types";
import slugify from "slugify";

const LIMIT = 10;

export const postRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          createdAt: true,
          featuredImage: true,

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
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: LIMIT + 1,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (posts.length > LIMIT) {
        const nextItem = posts.pop();
        if (nextItem) nextCursor = nextItem.id;
      }

      return { posts, nextCursor };
    }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        likes: ctx.session?.user?.id
          ? {
              where: {
                userId: ctx.session?.user?.id,
              },
            }
          : false,
      },
    });

    if (!post) {
      throw new Error("記事が見つかりませんでした。");
    }

    const { id, title, content, likes } = post;
    return { id, title, content, likes };
  }),
  create: protectedProcedure
    .input(createPostInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          slug: slugify(input.title),
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(updatePostInput)
    .mutation(({ ctx, input }) => {
      const { id, content, title } = input;
      return ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          content,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.post.delete({
      where: {
        id: input,
      },
    });
  }),
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      await ctx.prisma.like.create({
        data: {
          userId: ctx.session.user.id,
          postId,
        },
      });
    }),
  dislikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      await ctx.prisma.like.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      await ctx.prisma.bookmark.create({
        data: {
          userId: ctx.session.user.id,
          postId,
        },
      });
    }),
  removebookmark: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      await ctx.prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
