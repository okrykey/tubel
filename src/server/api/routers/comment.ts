import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createCommentInput, updateCommentInput } from "~/server/types";

export const commentRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        select: {
          id: true,
          content: true,
          user: {
            select: {
              name: true,
              image: true,
              _count: {
                select: {
                  post: true,
                  comment: true,
                },
              },
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments;
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
