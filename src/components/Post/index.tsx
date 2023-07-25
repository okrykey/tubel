import React, { useState } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { createStyles, Flex, rem } from "@mantine/core";
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

  action: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[3],
    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[2],
    }),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

type PostProps = inferRouterOutputs<AppRouter>["post"]["all"]["posts"][number];

const Post = ({ ...post }: PostProps) => {
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(post.bookmarks?.length)
  );

  const trpc = api.useContext();
  const bookmarkPost = api.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategory.invalidate();
    },
  });
  const removeBookmark = api.post.removebookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategory.invalidate();
    },
  });

  const { classes, cx } = useStyles();

  return (
    <div key={post.id}>
      <Card withBorder radius="md" className={cx(classes.card)}>
        <Card.Section>
          <Link href={`/posts/${post.id}`}>
            <Image
              src={`https://i.ytimg.com/vi/${post.videoId}/maxresdefault.jpg`}
              height={180}
              alt={post.title}
            />
          </Link>
        </Card.Section>
        <Text className={classes.title} fw={500} component="a">
          {post.title}
        </Text>

        <Text fz="sm" color="dimmed" lineClamp={4}>
          {post.content.length > 20
            ? post.content.substring(0, 21) + "..."
            : post.content}
        </Text>

        <Group position="apart" className={classes.footer}>
          <Center>
            <Link href={`/user/${post.user.username}`}>
              <Avatar src={post.user.image} size={24} radius="xl" mr="xs" />
            </Link>
            <Text fz="xs" inline className="text-gray-600">
              {post.user.name}
            </Text>
          </Center>
          <Group spacing="0">
            <ActionIcon className={classes.action} title="お気に入り追加">
              {isBookmarked ? (
                <CiBookmarkCheck
                  onClick={() => removeBookmark.mutate({ postId: post.id })}
                  className="cursor-pointer text-3xl text-purple-600"
                />
              ) : (
                <CiBookmarkPlus
                  className="cursor-pointer text-3xl"
                  onClick={() => {
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
  );
};

export default Post;
