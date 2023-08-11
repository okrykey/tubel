import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import isDataURI from "validator/lib/isDataURI";
import { decode } from "base64-arraybuffer";
import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";

function assertEnv(variable: string | undefined, name: string): string {
  if (!variable) {
    throw new Error(`Environment variable ${name} is not set!`);
  }
  return variable;
}

const supabaseUrl = assertEnv(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  "NEXT_PUBLIC_SUPABASE_PUBLIC_URL"
);
const supabaseAnonKey = assertEnv(
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY,
  "NEXT_PUBLIC_SUPABASE_SERVICE_KEY"
);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
          image: true,
          username: true,
          name: true,
          _count: {
            select: {
              post: true,
              comment: true,
            },
          },
        },
      });
    }),
  getUserAvatar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          name: true,
          image: true,
          username: true,
        },
      });
    }),
  getUserPosts: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },

        select: {
          post: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              title: true,
              videoId: true,
              createdAt: true,

              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  username: true,
                },
              },
            },
          },
        },
      });
    }),

  getUserBookmarkList: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx }) => {
      const allBookmarks = await ctx.prisma.bookmark.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              videoId: true,
              createdAt: true,
              category: {
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
          },
        },
      });

      const bookmarkedPosts = allBookmarks.map((bookmark) => bookmark.post);

      return bookmarkedPosts;
    }),

  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageAsDataUrl: z
          .string()
          .nullable()
          .default(null)
          .refine((val) => val === null || isDataURI(val), {
            message: "imageAsDataUrl must be a valid data URI or null",
          }),
        username: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      if (input.imageAsDataUrl) {
        const imageBase64Str = input.imageAsDataUrl.replace(
          /^data:image\/\w+;base64,/,
          ""
        );

        const { data, error } = await supabase.storage
          .from("public")
          .upload(`avatars/${input.username}.png`, decode(imageBase64Str), {
            contentType: "image/png",
            upsert: true,
          });

        if (error) {
          console.error("Error during Supabase upload:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Upload failed to Supabase",
          });
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("public").getPublicUrl(data?.path);

        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            name: input.name,
            image: publicUrl,
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            name: input.name,
          },
        });
      }
    }),
});
