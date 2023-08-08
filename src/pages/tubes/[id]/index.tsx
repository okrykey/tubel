import { api } from "~/utils/api";
import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Collapse,
  createStyles,
  Group,
  Loader,
  Paper,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import MainLayout from "~/layouts/Mainlayout";
import YouTube from "react-youtube";
import CommentForm from "~/components/CommentForm";
import Link from "next/link";
import { LoginModalAtom } from "~/pages/state/Atoms";
import { useAtom } from "jotai";
import { LoginModal } from "~/components/LoginModal";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  likePart: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
  },
  likeIcon: {
    cursor: "pointer",
    fontSize: "2rem",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[7],
    transition: "color 0.3s ease",
    "&:hover": {
      color: theme.colors.indigo[5],
    },
  },
}));

const tagColors: Record<string, string> = {
  motivation: "blue",
  youtube: "pink",
  computerscience: "cyan",
  wired: "grape",
};

const opts = {
  width: "100%",
  height: "100%",
};

const Postpage = () => {
  const theme = useMantineTheme();
  const [_, setIsOpen] = useAtom(LoginModalAtom);
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();
  const { data: session } = useSession();
  const trpc = api.useContext();
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  const getPost = api.post.get.useQuery(id);
  const invalidateCurrentPostPage = useCallback(() => {
    trpc.post.get.invalidate(router.query.id as string);
  }, [trpc.post.get, router.query.id]);

  const post = getPost.data;

  const likePost = api.post.likePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage();
      notifications.show({
        color: "grape",
        autoClose: 5000,
        title: "Nice!",
        message: "この投稿にいいねしました！",
      });
    },
  });

  const dislikePost = api.post.dislikePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage();
      notifications.show({
        color: "red",
        autoClose: 5000,
        message: "この投稿のいいねを取り消しました。",
      });
    },
  });

  const handleClickLike = useCallback(() => {
    if (session) {
      post?.id &&
        likePost.mutate({
          postId: post?.id,
        });
    } else {
      setIsOpen(true);
    }
  }, [session, post?.id, likePost.mutate, setIsOpen]);

  const handleClickdisLike = useCallback(() => {
    if (session) {
      post?.id &&
        dislikePost.mutate({
          postId: post?.id,
        });
    } else {
      setIsOpen(true);
    }
  }, [session, post?.id, dislikePost.mutate, setIsOpen]);

  let YouTubeVideoId;
  if (getPost.data?.videoId) {
    YouTubeVideoId =
      new URLSearchParams(new URL(getPost.data.videoId).search).get("v") ||
      undefined;
  }

  if (getPost.isLoading) {
    return (
      <MainLayout>
        <div className="relative min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (getPost.error) {
    return <div>Error</div>;
  }

  return (
    <MainLayout>
      {getPost.isSuccess && (
        <div className="fixed bottom-10 z-10 flex w-full items-center justify-center pr-4 md:bottom-5">
          <div className="flex w-full max-w-4xl flex-col items-end justify-end">
            <div
              className={` ${classes.likePart} transition-duration-300 flex items-center justify-center space-x-2 rounded-xl border border-gray-400 px-4 py-3 hover:border-gray-400`}
            >
              <Group spacing="0">
                {post?.likes && post?.likes.length > 0 ? (
                  <ActionIcon>
                    <BiSolidLike
                      className="cursor-pointer text-2xl text-indigo-500"
                      onClick={handleClickdisLike}
                    />
                  </ActionIcon>
                ) : (
                  <Tooltip
                    label="投稿にいいねする"
                    color={
                      theme.colorScheme === "dark"
                        ? theme.colors.gray[7]
                        : theme.colors.gray[6]
                    }
                    withArrow
                  >
                    <ActionIcon>
                      <BiLike
                        className={classes.likeIcon}
                        onClick={handleClickLike}
                      />
                    </ActionIcon>
                  </Tooltip>
                )}

                <Text
                  color={
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[4]
                      : theme.colors.gray[7]
                  }
                  className="ml-1 w-[10px]"
                >
                  {post?.likesCount}
                </Text>
              </Group>
              <LoginModal />
            </div>
          </div>
        </div>
      )}

      <div
        key={post?.id}
        className="flex h-full w-full flex-col items-center justify-center px-4 py-8 md:py-16"
      >
        <div className="flex w-full max-w-4xl flex-col space-y-4">
          <Paper withBorder radius="sm" className="p-2 md:p-4">
            <div className="flex flex-wrap justify-between pb-2">
              <h1 className=" py-2 text-lg font-bold sm:text-xl">
                {post?.title}
              </h1>
              <Group spacing={4}>
                <Link href={`/category/${post?.category.toLowerCase()}`}>
                  <Badge color="gray" radius="sm">
                    {post?.category}
                  </Badge>
                </Link>
                <Text size="xs" color="dimmed" className="pt-1">
                  {post?.createdAt.toLocaleDateString()}
                </Text>
              </Group>
            </div>

            <AspectRatio ratio={16 / 9}>
              <YouTube videoId={YouTubeVideoId} opts={opts}></YouTube>
            </AspectRatio>

            <Group position="apart">
              <Group key={id} spacing={8}>
                {post?.tags.slice(0, 2).map((tag, id) => (
                  <Link href={`/tags/${tag}`}>
                    <Badge
                      component="button"
                      className="cursol mb-2 mt-4 md:mb-0 "
                      color={tagColors[tag.toLowerCase()]}
                      size="sm"
                      variant={
                        theme.colorScheme === "dark" ? "light" : "outline"
                      }
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </Group>
              {post?.tags && post?.tags.length > 2 && (
                <ActionIcon
                  component="button"
                  onClick={toggle}
                  color="gray"
                  radius="sm"
                  className="cursol cursol mb-2 mt-4 md:mb-0"
                >
                  {opened ? (
                    <MdKeyboardArrowUp className="text-2xl" />
                  ) : (
                    <MdKeyboardArrowDown className="text-2xl" />
                  )}
                </ActionIcon>
              )}
            </Group>

            <Collapse in={opened}>
              <Group spacing={8}>
                {post?.tags.slice(2).map((tag, id) => (
                  <Group key={id} spacing={0}>
                    <Link href={`/tags/${tag}`}>
                      <Badge
                        className="cursol mb-2  md:mb-0 md:mt-4"
                        size="sm"
                        variant={
                          theme.colorScheme === "dark" ? "light" : "outline"
                        }
                      >
                        {tag}
                      </Badge>
                    </Link>
                  </Group>
                ))}
              </Group>
            </Collapse>
          </Paper>

          <div className="pt-4">
            <Text className="border-l-4 border-gray-400 pl-6">
              {post?.content}
            </Text>
          </div>

          <div className="py-4">
            {getPost.data?.id && <CommentForm postId={getPost.data?.id} />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Postpage;
