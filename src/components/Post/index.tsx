import Link from "next/link";
import { api } from "~/utils/api";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { createStyles, Highlight, rem } from "@mantine/core";
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
import { PiChatsThin } from "react-icons/pi";
import { useSession } from "next-auth/react";
import { LoginModalAtom } from "~/state/Atoms";
import { useAtom } from "jotai";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

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
    videoId: string;
  };

type BookmarkContext = {
  previousIsBookmarked: boolean;
  previousBookmarksCount: number;
};

const Post = ({ searchKeyword, ...post }: PostProps) => {
  const { classes, cx, theme } = useStyles();
  const { data: session } = useSession();
  const [, setIsOpen] = useAtom(LoginModalAtom);
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(post.bookmarks?.length)
  );

  const trpc = api.useContext();

  const bookmarkPost = api.post.bookmarkPost.useMutation({
    onMutate: async (): Promise<BookmarkContext> => {
      await trpc.post.all.cancel();
      await trpc.post.getByCategories.cancel();
      await trpc.post.getByTag.cancel();
      await trpc.post.search.cancel();
      const previousIsBookmarked = isBookmarked;
      const previousBookmarksCount = post._count.bookmarks;
      setIsBookmarked((prev) => !prev);
      post._count.bookmarks += 1;
      return { previousIsBookmarked, previousBookmarksCount };
    },
    onError: (error, _, context?: BookmarkContext) => {
      notifications.show({
        color: "red",
        autoClose: 2000,
        message: "エラーが発生しました。もう一度試して下さい。",
      });
      if (!context) return;
      setIsBookmarked(context.previousIsBookmarked);
      post._count.bookmarks = context.previousBookmarksCount;
    },
    onSuccess: () => {
      notifications.show({
        color: "indigo",
        autoClose: 2000,
        message: "この投稿をお気に入りに追加しました。",
      });
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
      await trpc.post.getByTag.invalidate();
      await trpc.post.search.invalidate();
    },
  });

  const removeBookmark = api.post.removebookmark.useMutation({
    onMutate: async (): Promise<BookmarkContext> => {
      await trpc.post.all.cancel();
      await trpc.post.getByCategories.cancel();
      await trpc.post.getByTag.cancel();
      await trpc.post.search.cancel();
      const previousIsBookmarked = isBookmarked;
      const previousBookmarksCount = post._count.bookmarks;
      setIsBookmarked((prev) => !prev);
      post._count.bookmarks -= 1;
      return { previousIsBookmarked, previousBookmarksCount };
    },
    onError: (error, _, context?: BookmarkContext) => {
      notifications.show({
        color: "red",
        autoClose: 2000,
        message: "エラーが発生しました。もう一度試して下さい。",
      });
      if (!context) return;
      setIsBookmarked(context.previousIsBookmarked);
      post._count.bookmarks = context.previousBookmarksCount;
    },
    onSuccess: () => {
      notifications.show({
        color: "red",
        autoClose: 2000,
        message: "この投稿をお気に入りを削除しました。",
      });
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
      await trpc.post.getByTag.invalidate();
      await trpc.post.search.invalidate();
    },
  });

  const YouTubeVideoId = new URLSearchParams(new URL(post.videoId).search).get(
    "v"
  );

  const vailYouTubeVideoId: string =
    YouTubeVideoId !== null ? YouTubeVideoId : "";
  return (
    <>
      <div key={post.id}>
        <Card withBorder radius="md" className={cx(classes.card)}>
          <Card.Section>
            <Link href={`/tubes/${post.id}`}>
              <Image
                src={`https://i.ytimg.com/vi/${vailYouTubeVideoId}/maxresdefault.jpg`}
                height={180}
                alt={post.title}
              />
            </Link>
          </Card.Section>
          <Text className={classes.title} fw={600} component="a">
            {searchKeyword && post.title.includes(searchKeyword) ? (
              <Highlight
                highlightColor={theme.colorScheme === "dark" ? "teal" : "blue"}
                highlight={searchKeyword}
              >
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
              <Avatar src={post.user.image} size={24} radius="sm" mr="xs" />

              <Text size="sm" inline color="dimmed" weight={500}>
                {post.user.name}
              </Text>
              <Text size="xs" color="dimmed" pt={3}>
                ・{post.createdAt.toLocaleDateString()}
              </Text>
            </Center>

            <Group>
              <Group spacing="0">
                <ActionIcon title="お気に入り追加">
                  {isBookmarked ? (
                    <CiBookmarkCheck
                      onClick={() => removeBookmark.mutate({ postId: post.id })}
                      className="cursor-pointer text-3xl"
                      color={theme.colorScheme === "dark" ? "teal" : "blue"}
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

                <Text
                  className="ml-1 w-[10px] "
                  color="dimmed"
                  weight={400}
                  inline
                >
                  {post._count.bookmarks}
                </Text>
              </Group>
              <Group spacing="0">
                <PiChatsThin size="1.7rem" className="text-gray-500" />
                <Text
                  className="ml-2 w-[10px] "
                  color="gray"
                  weight={400}
                  inline
                >
                  {post._count.comment}
                </Text>
              </Group>
            </Group>
          </Group>
        </Card>
      </div>
    </>
  );
};

export default Post;
