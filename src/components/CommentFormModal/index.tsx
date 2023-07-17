import Modal from "../Modal";
import { useAtom } from "jotai";
import { CommentOpenAtom } from "~/pages/state/Atoms";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import React from "react";
import { Button, Textarea, Title } from "@mantine/core";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type commentFormType = {
  postId: string;
  content: string;
};

const commentFormScheme = z.object({
  content: z.string().min(5, "※5文字以上で入力してください"),
});

const commentFormModal = () => {
  const [isCommentOpen, setIsCommentOpen] = useAtom(CommentOpenAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<commentFormType>({
    resolver: zodResolver(commentFormScheme),
  });

  const trpc = api.useContext();
  const { mutate } = api.comment.create.useMutation({
    onSuccess: () => {
      toast.success("新しいコメントを作成しました！");
      setIsCommentOpen(false);
      reset();
    },
    onSettled: async () => {
      await trpc.comment.all.invalidate();
    },
  });
  const router = useRouter();
  const { id } = router.query;
  const onSubmit: SubmitHandler<commentFormType> = (data) => {
    if (typeof id !== "string") {
      return null;
    }
    data.postId = id;
    mutate(data);
  };

  return (
    <Modal isOpen={isCommentOpen} onClose={() => setIsCommentOpen(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <Title size="xl">コメントしてみる</Title>

        <Textarea
          id="content"
          className="focus:shadow-outline h-full w-full "
          {...register("content")}
          placeholder="コメントを入力してください"
          autosize
          minRows={2}
          maxRows={4}
          radius="md"
        />
        <p className="w-full pb-1 text-left text-sm text-red-400">
          {errors.content?.message}
        </p>
        <Button type="submit" variant="outline" size="md" color="indigo">
          投稿
        </Button>
      </form>
    </Modal>
  );
};

export default commentFormModal;
