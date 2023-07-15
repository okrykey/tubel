import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPostInput, updatePostInput } from "~/server/types";

export const postRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts.map(({ id, title, content }) => ({
      id,
      title,
      content,
    }));
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
    });

    if (!post) {
      throw new Error("記事が見つかりませんでした。");
    }

    const { id, title, content } = post;
    return { id, title, content };
  }),
  create: protectedProcedure
    .input(createPostInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
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
});
