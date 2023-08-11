import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Text,
  Textarea,
} from "@mantine/core";
import { BiChat } from "react-icons/bi";
import { CommentCard } from "../CommentCard";
import { useSession } from "next-auth/react";
import { LoginModalAtom } from "~/pages/state/Atoms";
import { useAtom } from "jotai";
import { notifications } from "@mantine/notifications";
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
  const [_, setIsOpen] = useAtom(LoginModalAtom);

  const postRoute = api.useContext().comment;
  const submitComment = api.comment.create.useMutation({
    onSuccess: () => {
      notifications.show({
        color: "grape",
        autoClose: 5000,
        title: "Nice!",
        message: "この投稿にコメントしました！",
      });
      postRoute.all.invalidate({ postId });
      reset();
    },
    onError: () => {
      notifications.show({
        color: "red",
        autoClose: 5000,
        title: "エラー",
        message: "エラーが発生しました",
      });
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
        label={
          <Badge
            px={0}
            className="w-[112px]"
            component="p"
            variant="light"
            size="lg"
            radius="md"
            color="gray"
          >
            {getComments.data?.length ?? 0} コメント
          </Badge>
        }
      ></Divider>
      <form onSubmit={handleSubmit(handleComment)}>
        <div className="flex items-center" onClick={handleClick}>
          <Textarea
            icon={<BiChat />}
            variant="filled"
            placeholder="コメントする"
            autosize
            className="mx-2 flex-grow"
            id="comment"
            {...register("content")}
            disabled={!session}
          />
        </div>
        <div className="mx-2 mt-4 flex justify-end">
          {isValid && (
            <Button type="submit" variant="outline" size="sm">
              コメント
            </Button>
          )}
        </div>
      </form>

      {getComments.data && getComments.data?.length > 0 ? (
        getComments.data?.map((comment) => (
          <div key={comment.id} className="pt-6">
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
