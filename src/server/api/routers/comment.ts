import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createCommentInput, updateCommentInput } from "~/server/types";

export const commentRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.comment.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts.map(({ id, content }) => ({
      id,
      content,
    }));
  }),
  create: protectedProcedure
    .input(createCommentInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(updateCommentInput)
    .mutation(({ ctx, input }) => {
      const { id, content } = input;
      return ctx.prisma.comment.update({
        where: {
          id,
        },
        data: {
          content,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.comment.delete({
      where: {
        id: input,
      },
    });
  }),
});
