import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createPostInput, updatePostInput } from "~/server/types";
import slugify from "slugify";

export const postRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx }) => {
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
          videoId: true,
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
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return { posts };
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
        videoId: true,

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

    const { id, title, content, likes, videoId } = post;
    return { id, title, content, likes, videoId };
  }),
  create: protectedProcedure
    .input(createPostInput)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: {
          name: input.category,
        },
      });
      if (!category) {
        throw new Error("Failed to create category");
      }

      const tagPromises = input.tags.map((tagName) =>
        ctx.prisma.tag.create({
          data: {
            name: tagName,
            slug: slugify(tagName),
          },
        })
      );
      const tags = await Promise.all(tagPromises);
      if (!tags || tags.length === 0) {
        throw new Error("Failed to create tags");
      }

      await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          videoId: input.videoId,
          slug: slugify(input.videoId),
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })),
          },
          category: {
            connect: {
              id: category.id,
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
  getBookmarkList: protectedProcedure.query(async ({ ctx }) => {
    const allBookmarks = ctx.prisma.bookmark.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return allBookmarks;
  }),
  getByCategory: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        categoryName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const CategorizedPosts = await ctx.prisma.post.findMany({
        where: {
          category: {
            name: input.categoryName,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          createdAt: true,
          videoId: true,
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
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return { CategorizedPosts };
    }),
});
