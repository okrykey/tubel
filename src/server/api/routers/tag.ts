import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  createTag: protectedProcedure
    .input(
      z.object({
        label: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tag.findUnique({
        where: {
          value: input.label,
        },
      });

      if (tag) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "tag already exists!",
        });
      }

      await ctx.prisma.tag.create({
        data: {
          ...input,
          slug: slugify(input.label),
        },
      });
    }),

  getTags: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tag.findMany();
  }),
});
