import { createServerSideHelpers } from "@trpc/react-query/server";
import { api } from "~/utils/api";
import React, { memo, useCallback, useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Center,
  Collapse,
  createStyles,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Spoiler,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import MainLayout from "~/layouts/Mainlayout";
import YouTube from "react-youtube";
import type { YouTubeProps } from "react-youtube";
import superjson from "superjson";
import CommentForm from "~/components/CommentForm";
import Link from "next/link";
import { LoginModalAtom } from "~/state/Atoms";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { BookmarkPost } from "~/components/BookmarkPost";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { useRouter } from "next/router";
import { formatDateToTokyoTimezone } from "~/utils/timezoneUtils";

const MemoizedMainLayout = memo(MainLayout);

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
  ted: "red",
};

const opts: YouTubeProps["opts"] = {
  width: "100%",
  height: "100%",
};

type LikeContext = {
  previousIsLiked: boolean;
  previousLikeCount: number;
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
    transformer: superjson,
  });
  const id = context.params?.id as string;

  await helpers.post.get.prefetch(id);
  await helpers.comment.all.prefetch({ postId: id });
  await helpers.post.recommendByContent.prefetch({
    postId: id,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),

    fallback: "blocking",
  };
};

const Postpage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const getPost = api.post.get.useQuery(props.id);
  const post = getPost.data;

  const theme = useMantineTheme();
  const [, setIsOpen] = useAtom(LoginModalAtom);
  const [isLiked, setIsLiked] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();
  const { data: session } = useSession();
  const trpc = api.useContext();
  const router = useRouter();

  let YouTubeVideoId: string | undefined;
  if (getPost.data?.videoId) {
    const videoId = new URLSearchParams(
      new URL(getPost.data.videoId).search
    ).get("v");
    YouTubeVideoId = videoId !== null ? videoId : undefined;
  }

  const recommendPost = api.post.recommendByContent.useQuery(
    {
      postId: props.id,
    },
    {
      enabled: Boolean(props.id),
    }
  );

  useEffect(() => {
    setIsLiked(Boolean(post?.likes?.length));
  }, [post]);

  const likePost = api.post.likePost.useMutation({
    onMutate: async (): Promise<LikeContext> => {
      await trpc.post.get.cancel();
      if (!post)
        return {
          previousIsLiked: false,
          previousLikeCount: 0,
        };

      const previousIsLiked = isLiked;
      const previousLikeCount = post.likesCount;
      if (post) {
        setIsLiked((prev) => !prev);
        post.likesCount += 1;
      }
      return { previousIsLiked, previousLikeCount };
    },

    onError: (error, _, context?: LikeContext) => {
      notifications.show({
        color: "red",
        autoClose: 2000,
        message: "エラーが発生しました。もう一度試して下さい。",
      });
      if (!context || !post) return;
      setIsLiked(context.previousIsLiked);
      post.likesCount = context.previousLikeCount;
    },
    onSuccess: () => {
      notifications.show({
        color: "blue",
        autoClose: 2000,
        message: "この投稿にいいねしました。",
      });
    },
    onSettled: async () => {
      await trpc.post.get.invalidate();
    },
  });

  const dislikePost = api.post.dislikePost.useMutation({
    onMutate: async (): Promise<LikeContext> => {
      await trpc.post.get.cancel();
      if (!post)
        return {
          previousIsLiked: false,
          previousLikeCount: 0,
        };

      const previousIsLiked = isLiked;
      const previousLikeCount = post.likesCount;
      if (post) {
        setIsLiked((prev) => !prev);
        post.likesCount -= 1;
      }
      return { previousIsLiked, previousLikeCount };
    },

    onError: (error, _, context?: LikeContext) => {
      notifications.show({
        color: "red",
        autoClose: 2000,
        message: "エラーが発生しました。もう一度試して下さい。",
      });
      if (!context || !post) return;
      setIsLiked(context.previousIsLiked);
      post.likesCount = context.previousLikeCount;
    },
    onSuccess: () => {
      notifications.show({
        color: "red",
        autoClose: 2000,
        message: "この投稿のいいねを取り消しました。",
      });
    },
    onSettled: async () => {
      await trpc.post.get.invalidate();
    },
  });

  const handleClickLike = useCallback(() => {
    if (session && post?.id) {
      likePost.mutate({
        postId: post?.id,
      });
    } else {
      setIsOpen(true);
    }
  }, [session, post, setIsOpen, likePost]);

  const handleClickdisLike = useCallback(() => {
    if (session && post?.id) {
      dislikePost.mutate({
        postId: post?.id,
      });
    } else {
      setIsOpen(true);
    }
  }, [session, post, setIsOpen, dislikePost]);

  if (getPost.isLoading) {
    return (
      <MemoizedMainLayout>
        <Center className="flex h-full w-full flex-col items-center justify-center px-4 py-10 md:py-16">
          <Loader />
        </Center>
      </MemoizedMainLayout>
    );
  }

  if (getPost.error) {
    return <div>Error</div>;
  }

  return (
    <MemoizedMainLayout>
      {getPost.isSuccess && post && (
        <div className="fixed  bottom-5 z-10 flex w-full items-center justify-center pr-4">
          <div className="flex w-full max-w-4xl flex-col items-end justify-end">
            <div
              className={` ${classes.likePart} transition-duration-300 flex items-center justify-center space-x-2 rounded-xl border border-gray-400 px-4 py-3 hover:border-gray-400`}
            >
              <Group spacing="0">
                {isLiked ? (
                  <ActionIcon>
                    <BiSolidLike
                      className="cursor-pointer text-2xl text-blue-500"
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
                  {post.likesCount}
                </Text>
              </Group>
            </div>
          </div>
        </div>
      )}
      {post ? (
        <div
          key={post.id}
          className="flex  h-full w-full flex-col items-center justify-between px-4 py-10 md:py-16"
        >
          <div className="flex w-full max-w-4xl flex-col space-y-4">
            <Paper withBorder radius="sm" className="p-2 md:p-4">
              <div className="flex items-end justify-between pb-2">
                <h1 className="py-2 text-lg font-bold sm:text-xl">
                  {post.title}
                </h1>
                <div className="flex flex-col items-end">
                  <Text
                    tt="uppercase"
                    weight={700}
                    className="cursor-pointer text-xs hover:underline md:text-sm"
                  >
                    <Link
                      href={`/category/${
                        post.category?.toLowerCase() ?? "default"
                      }`}
                    >
                      {post.category}
                    </Link>
                  </Text>

                  <Text
                    className="text-xs md:text-sm"
                    weight={700}
                    color="dimmed"
                  >
                    {formatDateToTokyoTimezone(post.createdAt)}
                  </Text>
                </div>
              </div>

              <AspectRatio ratio={16 / 9}>
                <YouTube videoId={YouTubeVideoId || ""} opts={opts}></YouTube>
              </AspectRatio>

              <Group position="apart">
                <Group spacing={8}>
                  {post.tags.slice(0, 2).map((tag, id) => (
                    <Badge
                      key={id}
                      component="button"
                      className="mb-2 mt-4 cursor-pointer md:mb-0  "
                      color={tagColors[tag.toLowerCase()]}
                      size="md"
                      variant={
                        theme.colorScheme === "dark" ? "light" : "outline"
                      }
                      onClick={() => void router.push(`/tags/${tag}`)}
                    >
                      # {tag}
                    </Badge>
                  ))}
                </Group>
                {post.tags && post.tags.length > 2 && (
                  <ActionIcon
                    component="button"
                    onClick={toggle}
                    color="gray"
                    radius="sm"
                    className="mb-2 mt-4 cursor-pointer md:mb-0 md:mt-4"
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
                  {post.tags.slice(2).map((tag, id) => (
                    <Group key={id} spacing={0}>
                      <Link href={`/tags/${tag}`}>
                        <Badge
                          className="mb-2 cursor-pointer md:mb-0 md:mt-2"
                          size="md"
                          variant={
                            theme.colorScheme === "dark" ? "light" : "outline"
                          }
                        >
                          # {tag}
                        </Badge>
                      </Link>
                    </Group>
                  ))}
                </Group>
              </Collapse>
            </Paper>
            <Spoiler
              className="pt-4"
              maxHeight={120}
              transitionDuration={200}
              showLabel={
                <Badge
                  component="a"
                  className="ml-[17.5rem] mt-3 md:ml-[45rem] md:mt-4 lg:ml-[51rem]"
                  size="sm"
                  color="gray"
                  variant="light"
                  radius="md"
                >
                  もっとみる
                </Badge>
              }
              hideLabel={
                <MdKeyboardArrowUp
                  className="mx-[20rem] mt-1 text-2xl md:ml-[47.5rem] lg:ml-[53rem]"
                  color="gray"
                />
              }
            >
              <Text
                lineClamp={4}
                className="whitespace-pre-wrap border-l-4 border-gray-400 pl-6"
              >
                {post.content}
              </Text>
            </Spoiler>

            <div className="pt-4">
              {getPost.data?.id && <CommentForm postId={props.id} />}
            </div>
            {recommendPost.isSuccess && (
              <div>
                <Divider
                  className="pb-2 pt-3"
                  labelPosition="center"
                  label={
                    <Badge
                      component="p"
                      variant="light"
                      size="lg"
                      radius="md"
                      color="gray"
                      px={0}
                      className="w-[112px]"
                    >
                      recommend
                    </Badge>
                  }
                />

                <SimpleGrid
                  cols={2}
                  spacing="xl"
                  verticalSpacing="xl"
                  mt={24}
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  {recommendPost.data.recommendedPosts.map((postData) => (
                    <BookmarkPost
                      key={postData.id}
                      post={{
                        ...postData,
                        category: postData.category?.name
                          ? postData.category.name
                          : "",
                      }}
                    />
                  ))}
                </SimpleGrid>
              </div>
            )}
          </div>
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Text
              color="dimmed"
              size="sm"
              underline
              className="text-sm font-bold md:text-base"
              transform="uppercase"
            >
              {post.category && (
                <Link href={`/category/${post.category}`}>{post.category}</Link>
              )}
            </Text>

            <Text
              color="dimmed"
              size="sm"
              className="text-sm font-bold md:text-base"
            >
              /
            </Text>
            <Text
              color="dimmed"
              size="sm"
              underline
              className="text-sm font-bold md:text-base"
            >
              <Link href="/">HOME</Link>
            </Text>
          </div>
        </div>
      ) : (
        <p>投稿が存在しません。</p>
      )}
    </MemoizedMainLayout>
  );
};

export default Postpage;
