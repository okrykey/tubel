import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import { Badge, Button, Center, Divider, Text, Textarea } from "@mantine/core";
import { BiChat } from "react-icons/bi";
import { CommentCard } from "../CommentCard";
import { useSession } from "next-auth/react";
import { LoginModalAtom } from "~/state/Atoms";
import { useAtom } from "jotai";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
dayjs.extend(relativeTime);

type CommentFormType = { content: string };

const CommentForm = ({ postId }: { postId: string }) => {
  const form = useForm<CommentFormType>({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) => {
        if (value.length < 3) {
          return "※コメントは3文字以上で入力してください";
        } else if (value.length > 10) {
          return "※コメントは最大30文字までです";
        }
        return null;
      },
    },
  });

  const { data: session } = useSession();
  const [, setIsOpen] = useAtom(LoginModalAtom);
  const [showButton, setShowButton] = useState(false);
  const postRoute = api.useContext().comment;
  const submitComment = api.comment.create.useMutation({
    onSuccess: () => {
      notifications.show({
        color: "grape",
        autoClose: 5000,
        message: "この投稿にコメントしました！",
      });
      void postRoute.all.invalidate({ postId });
      form.reset();
      setShowButton(false);
    },
    onError: () => {
      notifications.show({
        color: "red",
        autoClose: 5000,
        message: "エラーが発生しました",
      });
    },
  });

  const getComments = api.comment.all.useQuery({
    postId,
  });

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!session) {
      event.preventDefault();
      void setIsOpen(true);
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
            comments
          </Badge>
        }
      ></Divider>
      <form
        onSubmit={form.onSubmit((data: CommentFormType) => {
          submitComment.mutate({
            ...data,
            postId,
          });
        })}
      >
        <div className="flex items-center" onClick={handleClick}>
          <Textarea
            icon={<BiChat />}
            variant="filled"
            placeholder="コメントする"
            autosize
            className="mx-2 flex-grow"
            id="comment"
            {...form.getInputProps("content")}
            disabled={!session}
            onClick={() => setShowButton(true)}
          />
        </div>
        {showButton && (
          <div className="mx-2 mt-4 flex justify-end">
            <Button type="submit" variant="outline" size="sm">
              コメント
            </Button>
          </div>
        )}
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
                name: `${comment.user.name || "Unknown"}`,
                image: `${comment.user.image || "Default"}`,
              }}
            />
          </div>
        ))
      ) : (
        <Center>
          <Text className="mt-8" color="dimmed">
            まだコメントはありません
          </Text>
        </Center>
      )}
    </>
  );
};

export default CommentForm;
