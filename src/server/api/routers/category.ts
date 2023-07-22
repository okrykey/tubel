import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: {
          id: input.id,
        },
      });

      if (category) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "category already exists!",
        });
      }

      await ctx.prisma.tag.create({
        data: {
          ...input,
          slug: slugify(input.name),
        },
      });
    }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),
});
