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
import { useSession } from "next-auth/react";
import { LoginModalAtom } from "~/state/Atoms";
import { useAtom } from "jotai";
import { useState } from "react";

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

const Post = ({ searchKeyword, ...post }: PostProps) => {
  const { classes, cx, theme } = useStyles();
  const { data: session } = useSession();
  const [, setIsOpen] = useAtom(LoginModalAtom);
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
              <Avatar src={post.user.image} size={24} radius="xl" mr="xs" />

              <Text fz="xs" inline color="dimmed">
                {post.user.name}
              </Text>
            </Center>
            <Group spacing="0">
              <ActionIcon title="お気に入り追加">
                {isBookmarked ? (
                  <CiBookmarkCheck
                    onClick={() => removeBookmark.mutate({ postId: post.id })}
                    className="cursor-pointer text-3xl "
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

              <Text className="ml-1 w-[10px] " color="dimmed" inline>
                {post._count.bookmarks}
              </Text>
            </Group>
          </Group>
        </Card>
      </div>
    </>
  );
};

export default Post;
