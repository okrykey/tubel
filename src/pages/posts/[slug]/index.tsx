import { api } from "~/utils/api";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  BiBookmark,
  BiLike,
  BiSolidBookmark,
  BiSolidLike,
} from "react-icons/bi";

import {
  ActionIcon,
  AspectRatio,
  Badge,
  Divider,
  Group,
  Loader,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import MainLayout from "~/layouts/Mainlayout";
import YouTube from "react-youtube";
import CommentForm from "~/components/CommentForm";
import Link from "next/link";

const tagColors: Record<string, string> = {
  motivation: "blue",
  youtube: "pink",
  cs: "cyan",
};

const opts = {
  width: "100%",
  height: "100%",
};

const Postpage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { slug } = router.query;

  if (typeof slug !== "string") {
    return null;
  }

  const getPost = api.post.get.useQuery(slug);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (getPost.isSuccess) {
      setIsBookmarked(Boolean(getPost.data?.bookmarks?.length));
    }
  }, [getPost.isSuccess]);

  const trpc = api.useContext();
  const invalidateCurrentPostPage = useCallback(() => {
    trpc.post.get.invalidate(router.query.id as string);
  }, [trpc.post.get, router.query.id]);

  const likePost = api.post.likePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage();
    },
  });

  const dislikePost = api.post.dislikePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage();
    },
  });

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

  const handleClickLike = () => {
    post.id &&
      likePost.mutate({
        postId: post.id,
      });
  };
  const handleClickdisLike = () => {
    post.id &&
      dislikePost.mutate({
        postId: post.id,
      });
  };

  let YouTubeVideoId;
  if (getPost.data?.videoId) {
    YouTubeVideoId =
      new URLSearchParams(new URL(getPost.data.videoId).search).get("v") ||
      undefined;
  }

  if (getPost.isLoading) {
    return <Loader size="lg" variant="dots" />;
  }

  if (getPost.error) {
    return <div>Error</div>;
  }

  const post = getPost.data;
  return (
    <MainLayout>
      {getPost.isSuccess && (
        <div className="fixed bottom-10 z-10 flex w-full items-center justify-end pr-4 md:bottom-5 md:justify-center md:pl-0">
          <div className="transition-duration-300lex items-center justify-center space-x-2 rounded-xl border border-gray-400 bg-white px-4 py-3 hover:border-blue-500">
            <div className="transition-duration-300  group-hover:border-blue-500">
              <Group spacing={10}>
                <ActionIcon title="投稿にいいねする">
                  {post.likes && post.likes.length > 0 ? (
                    <BiSolidLike
                      className="cursor-pointer text-xl text-blue-500"
                      onClick={handleClickdisLike}
                    />
                  ) : (
                    <BiLike
                      className="cursor-pointer text-xl"
                      onClick={handleClickLike}
                    />
                  )}
                </ActionIcon>
                <Divider orientation="vertical" />
                <ActionIcon title="お気に入り追加">
                  {isBookmarked ? (
                    <BiSolidBookmark
                      onClick={() => removeBookmark.mutate({ postId: post.id })}
                      className="cursor-pointer text-xl text-purple-500"
                    />
                  ) : (
                    <BiBookmark
                      className="cursor-pointer text-xl"
                      onClick={() => {
                        bookmarkPost.mutate({
                          postId: post.id,
                        });
                      }}
                    />
                  )}
                </ActionIcon>
              </Group>
            </div>
          </div>
        </div>
      )}

      <div
        key={post.id}
        className="flex h-full w-full flex-col items-center justify-center p-4"
      >
        <div className="flex w-full max-w-4xl flex-col space-y-6">
          <h1 className="rounded-xl bg-opacity-50 p-4 text-center text-3xl font-bold">
            {post.title}
          </h1>
          <Paper withBorder radius="sm" className="p-2 md:p-4">
            <AspectRatio ratio={16 / 9}>
              <YouTube videoId={YouTubeVideoId} opts={opts}></YouTube>
            </AspectRatio>

            <div className="flex flex-row">
              {post.tags.map((tag, id) => (
                <div key={id}>
                  <Link href={`/tags/${tag}`}>
                    <Badge
                      className="mb-2 ml-2 mt-4 md:mb-0 md:mt-4"
                      color={tagColors[tag.toLowerCase()]}
                      variant={
                        theme.colorScheme === "dark" ? "light" : "outline"
                      }
                    >
                      {tag}
                    </Badge>
                  </Link>
                  {id < post.tags.length - 1 && (
                    <Divider orientation="vertical" className="mx-2" />
                  )}
                </div>
              ))}
            </div>
          </Paper>

          <div className="border-l-4 border-gray-400 pl-6">{post.content}</div>
          <Divider m="md" />
          <div className="pt-8">
            {getPost.data?.id && <CommentForm postId={getPost.data?.id} />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Postpage;
