import { api } from "~/utils/api";
import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { AspectRatio, Badge, Divider, Loader } from "@mantine/core";
import MainLayout from "~/layouts/Mainlayout";
import YouTube from "react-youtube";
import CommentForm from "~/components/CommentForm";

const Postpage = () => {
  const opts = {
    width: "100%",
    height: "100%",
  };

  const router = useRouter();
  const { slug } = router.query;

  if (typeof slug !== "string") {
    return null;
  }
  const PostRoute = api.useContext().post;
  const invalidateCurrentPostPage = useCallback(() => {
    PostRoute.get.invalidate(router.query.id as string);
  }, [PostRoute.get, router.query.id]);

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

  const getPost = api.post.get.useQuery(slug);

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
        <div className="fixed bottom-10 z-10 flex w-full items-center justify-start pl-8 md:bottom-5 md:justify-center md:pl-0">
          <div className="transition-duration-300 group flex items-center justify-center space-x-2 rounded-xl border border-gray-400 bg-white px-6 py-3 hover:border-blue-500">
            <div className="transition-duration-300  group-hover:border-blue-500">
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
            </div>
          </div>
        </div>
      )}

      <div
        key={post.id}
        className="flex h-full w-full flex-col items-center justify-center p-10"
      >
        <div className="flex w-full max-w-4xl flex-col space-y-6">
          <h1 className="rounded-xl bg-opacity-50 p-4 text-center text-3xl font-bold">
            {post.title}
          </h1>

          <AspectRatio ratio={16 / 9}>
            <YouTube videoId={post.videoId} opts={opts}></YouTube>
          </AspectRatio>

          <div className="flex flex-row">
            {post.tags.map((tag, id) => (
              <div key={id}>
                <Badge>{tag.name}</Badge>
                {id < post.tags.length - 1 && (
                  <Divider orientation="vertical" className="mx-2" />
                )}
              </div>
            ))}
          </div>
          <Divider m="md" />
          <div className="border-l-4 border-gray-400 pl-6">{post.content}</div>
          <div className="pt-8">
            {getPost.data?.id && <CommentForm postId={getPost.data?.id} />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Postpage;
