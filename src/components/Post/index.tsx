import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { Button, createStyles, Highlight, Modal, rem } from "@mantine/core";
import {
  Card,
  Text,
  Image,
  Group,
  Center,
  Avatar,
  ActionIcon,
} from "@mantine/core";
import { CiBookmarkCheck, CiBookmarkPlus } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { LoginModal } from "../LoginModal";
import { isBookmarkedAtomFamily, LoginModalAtom } from "~/pages/state/Atoms";
import { useAtom } from "jotai";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  rating: {
    position: "absolute",
    top: theme.spacing.xs,
    right: rem(12),
    pointerEvents: "none",
  },

  title: {
    display: "block",
    marginTop: theme.spacing.md,
    marginBottom: rem(5),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

export type PostProps =
  inferRouterOutputs<AppRouter>["post"]["all"]["posts"][number] & {
    searchKeyword?: string;
  };

const Post = ({ searchKeyword, ...post }: PostProps) => {
  const { classes, cx } = useStyles();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useAtom(LoginModalAtom);
  const [isBookmarked, setIsBookmarked] = useAtom(
    isBookmarkedAtomFamily(post.id)
  );

  const trpc = api.useContext();
  const bookmarkPost = api.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
      await trpc.post.getByTag.invalidate();
      await trpc.post.search.invalidate();
    },
  });
  const removeBookmark = api.post.removebookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
      await trpc.post.getByTag.invalidate();
    },
  });

  const YouTubeVideoId = new URLSearchParams(new URL(post.videoId).search).get(
    "v"
  );

  return (
    <>
      <div key={post.id}>
        <Card withBorder radius="md" className={cx(classes.card)}>
          <Card.Section>
            <Link href={`/posts/${post.id}`}>
              <Image
                src={`https://i.ytimg.com/vi/${YouTubeVideoId}/maxresdefault.jpg`}
                height={180}
                alt={post.title}
              />
            </Link>
          </Card.Section>
          <Text className={classes.title} fw={500} component="a">
            {searchKeyword && post.title.includes(searchKeyword) ? (
              <Highlight highlightColor="blue" highlight={searchKeyword}>
                {post.title}
              </Highlight>
            ) : (
              post.title
            )}
          </Text>

          <Text fz="sm" color="dimmed" lineClamp={4}>
            {searchKeyword && post.content.includes(searchKeyword) ? (
              <Highlight highlightColor="blue" highlight={searchKeyword}>
                {post.content.length > 18
                  ? post.content.substring(0, 19) + "..."
                  : post.content}
              </Highlight>
            ) : post.content.length > 18 ? (
              post.content.substring(0, 19) + "..."
            ) : (
              post.content
            )}
          </Text>

          <Group position="apart" className={classes.footer}>
            <Center>
              <Avatar src={post.user.image} size={24} radius="xl" mr="xs" />

              <Text fz="xs" inline className="text-gray-600">
                {post.user.name}
              </Text>
            </Center>
            <Group spacing="0">
              <ActionIcon title="お気に入り追加">
                {isBookmarked ? (
                  <CiBookmarkCheck
                    onClick={() => removeBookmark.mutate({ postId: post.id })}
                    className="cursor-pointer text-3xl text-purple-600"
                  />
                ) : (
                  <CiBookmarkPlus
                    className="cursor-pointer text-3xl"
                    onClick={() => {
                      if (!session) {
                        setIsOpen(true);
                        return;
                      }
                      bookmarkPost.mutate({
                        postId: post.id,
                      });
                    }}
                  />
                )}
              </ActionIcon>

              <p className="ml-1 w-[10px] text-gray-700">
                {post._count.bookmarks}
              </p>
            </Group>
          </Group>
        </Card>
      </div>
    </>
  );
};

export default Post;
