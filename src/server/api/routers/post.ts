import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createPostInput, updatePostInput } from "~/server/types";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { getKeywords } from "~/utils/kuromoji";

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
              id: true,
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
          category: { select: { name: true } },
        },
      });

      return { posts };
    }),

  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
        likes: ctx.session?.user?.id
          ? {
              where: {
                userId: ctx.session?.user?.id,
              },
            }
          : false,
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
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("記事が見つかりませんでした。");
    }

    const likesCount = await ctx.prisma.like.count({
      where: {
        postId: post.id,
      },
    });

    const tags = post.tags.map((tag) => tag.name);
    const category = post.category ? post.category.name : "";

    const { id, title, content, createdAt, likes, bookmarks, videoId, user } =
      post;
    return {
      id,
      title,
      content,
      createdAt,
      likes,
      bookmarks,
      videoId,
      username: user?.username,
      userId: user?.id,
      tags,
      category,
      likesCount,
    };
  }),

  create: protectedProcedure
    .input(createPostInput)
    .mutation(async ({ ctx, input }) => {
      let category = await ctx.prisma.category.findUnique({
        where: {
          name: input.category,
        },
      });

      if (!category) {
        category = await ctx.prisma.category.create({
          data: {
            name: input.category,
          },
        });
      }

      const tagPromises = input.tags.map(async (tagName) => {
        let tag = await ctx.prisma.tag.findUnique({
          where: {
            name: tagName,
          },
        });

        if (!tag) {
          tag = await ctx.prisma.tag.create({
            data: {
              name: tagName,
              slug: slugify(tagName),
            },
          });
        }

        return tag;
      });

      const tags = await Promise.all(tagPromises);

      if (!tags || tags.length === 0) {
        throw new Error("タグの作成に失敗しました。");
      }

      await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          videoId: input.videoId,
          slug: uuidv4(),
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
    .mutation(async ({ ctx, input }) => {
      const { id, content, title, videoId, tags, category } = input;

      const post = await ctx.prisma.post.findUnique({
        where: { id },
        include: { tags: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      await ctx.prisma.post.update({
        where: { id },
        data: {
          tags: {
            disconnect: post.tags.map((tag) => ({ id: tag.id })),
          },
        },
      });

      return ctx.prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          videoId,
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag, slug: tag },
            })),
          },
          category: {
            connectOrCreate: {
              where: { name: category },
              create: { name: category },
            },
          },
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

  getByCategories: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        categoryNames: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const CategorizedPosts = await ctx.prisma.post.findMany({
        where: {
          category: {
            name: { in: input.categoryNames },
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
          category: { select: { name: true } },
          _count: {
            select: {
              bookmarks: true,
              comment: true,
            },
          },
          user: {
            select: {
              id: true,
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

  getByTag: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        tagName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TaggedPosts = await ctx.prisma.post.findMany({
        where: {
          tags: {
            some: {
              name: input.tagName,
            },
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
              id: true,
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
          category: { select: { name: true } },
        },
      });

      return { TaggedPosts };
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const SearchedPosts = await ctx.prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.query,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: input.query,
                mode: "insensitive",
              },
            },
          ],
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
              id: true,
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
          category: { select: { name: true } },
        },
      });

      return { SearchedPosts };
    }),

  recommendByContent: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
        select: { title: true, content: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const keywords = await getKeywords(`${post.title} ${post.content}`);

      const recommendedPosts = await ctx.prisma.post.findMany({
        where: {
          OR: keywords.map((keyword) => ({
            title: { contains: keyword },
          })),
          NOT: { id: postId },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
        select: {
          id: true,
          title: true,
          content: true,
          videoId: true,
          createdAt: true,

          category: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      });

      return { recommendedPosts };
    }),
});
