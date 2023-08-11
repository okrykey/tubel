import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  }),
});
