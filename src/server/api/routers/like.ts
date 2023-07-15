import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createInput } from "~/server/types";

export const likeRouter = createTRPCRouter({
  create: protectedProcedure.input(createInput).mutation(({ ctx, input }) => {
    return ctx.prisma.like.create({
      data: {
        user: {
          connect: {
            id: input.useId,
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
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.like.delete({
      where: {
        id: input,
      },
    });
  }),
  count: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const counts = await ctx.prisma.like.count({
      where: {
        postId: input,
      },
    });
    return counts;
  }),

  all: protectedProcedure.query(async ({ ctx }) => {
    const likes = await ctx.prisma.like.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        post: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likes.map((like) => like.post);
  }),
});
