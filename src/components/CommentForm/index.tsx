import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import { Box, Button, Center, Divider, Input, Text } from "@mantine/core";
import { BiChat } from "react-icons/bi";
import { CommentCard } from "../CommentCard";
import { useSession } from "next-auth/react";
import { LoginModalAtom } from "~/pages/state/Atoms";
import { useAtom } from "jotai";
dayjs.extend(relativeTime);

type CommentFormType = { content: string };

export const commentFormSchema = z.object({
  content: z.string().min(3),
});

const CommentForm = ({ postId }: { postId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  });

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useAtom(LoginModalAtom);

  const postRoute = api.useContext().comment;
  const submitComment = api.comment.create.useMutation({
    onSuccess: () => {
      toast.success("コメントを作成しました！");
      postRoute.all.invalidate({ postId });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getComments = api.comment.all.useQuery({
    postId,
  });

  const handleComment = (data: CommentFormType) => {
    if (session) {
      submitComment.mutate({
        ...data,
        postId,
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!session) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
      <Divider
        className="pb-4"
        labelPosition="center"
        label={<Box ml={5}>{getComments.data?.length ?? 0} コメント</Box>}
      ></Divider>
      <form onSubmit={handleSubmit(handleComment)}>
        <div className="flex items-center" onClick={handleClick}>
          <Input
            icon={<BiChat />}
            variant="filled"
            placeholder="コメントする"
            className="mx-2 flex-grow"
            id="comment"
            {...register("content")}
            disabled={!session}
          />
        </div>
        <Center className="pt-4">
          {isValid ? (
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="hover flex items-center space-x-3 rounded border border-gray-300 px-4 py-2 text-gray-900 transition hover:border-gray-900"
            >
              コメントする
            </Button>
          ) : (
            <div style={{ height: "2rem" }}></div>
          )}
        </Center>
      </form>

      {getComments.data && getComments.data?.length > 0 ? (
        getComments.data?.map((comment) => (
          <div key={comment.id} className="pb-8">
            <CommentCard
              postedAt={dayjs(comment.createdAt).fromNow()}
              content={comment.content}
              id={comment.id}
              user={{
                id: comment.user.id,
                name: `${comment.user.name}`,
                image: `${comment.user.image}`,
              }}
            />
          </div>
        ))
      ) : (
        <Center>
          <Text className="mt-8">まだコメントはありません</Text>
        </Center>
      )}
    </>
  );
};

export default CommentForm;
