import { api } from "~/utils/api";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Comments from "~/components/Comment";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { BsChat } from "react-icons/bs";

import CommentFormModal from "~/components/CommentFormModal";
import { AspectRatio, Button, Divider } from "@mantine/core";
import { useAtom } from "jotai";
import { CommentOpenAtom, IdSetAtom, tagsAtom } from "../state/Atoms";
import MainLayout from "~/layouts/Mainlayout";
import YouTube from "react-youtube";
import CommentSidebar from "~/components/CommentSidebar";

const Postpage = () => {
  const [isCommentOpen, setIsCommentOpen] = useAtom(CommentOpenAtom);
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [tags] = useAtom(tagsAtom);
  const [videoId, setVideoId] = useAtom(IdSetAtom);

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

  const handleClick = () => {
    window.innerWidth <= 768
      ? setIsCommentOpen(true)
      : setShowCommentSidebar(true);
  };

  const getPost = api.post.get.useQuery(slug);

  if (getPost.isLoading) {
    return <div>Loading...</div>;
  }

  if (getPost.error) {
    return <div>Error</div>;
  }

  const post = getPost.data;
  return (
    <MainLayout>
      {getPost.isSuccess && (
        <div className="fixed bottom-10 flex w-full items-center justify-center md:bottom-5">
          <div className="transition-duration-300 group flex items-center justify-center space-x-2 rounded-full border border-gray-400 bg-white px-6 py-3 hover:border-blue-500">
            <div className="transition-duration-300 border-r pr-4 group-hover:border-blue-500">
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
            <div>
              <BsChat
                className="cursor-pointer text-base"
                onClick={handleClick}
              ></BsChat>
            </div>
          </div>
        </div>
      )}

      <div
        key={post.id}
        className="flex h-full w-full flex-col items-center justify-center p-10"
      >
        <div className="flex w-full max-w-screen-md flex-col space-y-6">
          <h1 className="rounded-xl bg-opacity-50 p-4 text-center text-3xl font-bold">
            {post.title}
          </h1>

          <AspectRatio ratio={16 / 9}>
            <YouTube videoId={post.videoId} />
          </AspectRatio>

          <div className="border-l-4 border-gray-400 pl-6">{post.content}</div>
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag.label}
            </span>
          ))}

          <Divider my="sm" variant="dotted" />
          <Button
            variant="outline"
            size="sm"
            color="indigo"
            onClick={handleClick}
          >
            コメントを書く
          </Button>
          {getPost.data?.id && <CommentFormModal />}
          {getPost.data?.id && (
            <CommentSidebar
              showCommentSidebar={showCommentSidebar}
              setShowCommentSidebar={setShowCommentSidebar}
              postId={getPost.data?.id}
            />
          )}

          <Comments postId={getPost.data?.id} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Postpage;
