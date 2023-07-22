import React, { useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { api } from "~/utils/api";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { createStyles, rem } from "@mantine/core";
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
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
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

  const bookmarkPost = api.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
  });
  const removeBookmark = api.post.removebookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
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
            <Text fz="sm" inline>
              {post.user.name}
              <span className="mx-1">
                {dayjs(post.createdAt).format("YYYY/MM/DD")}
              </span>
            </Text>
          </Center>

          <Group spacing={8} mr={0}>
            <ActionIcon className={classes.action}>
              {isBookmarked ? (
                <CiBookmarkCheck
                  onClick={() => removeBookmark.mutate({ postId: post.id })}
                  className="cursor-pointer text-3xl text-purple-800"
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
          </Group>
        </Group>
      </Card>
    </div>
  );
};

export default Post;
