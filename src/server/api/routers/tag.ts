import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  getTags: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tag.findMany();
  }),
});
