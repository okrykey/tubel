import Modal from "../Modal";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/pages/state/Atoms";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import React from "react";
import { Button, Title } from "@mantine/core";
import toast from "react-hot-toast";
import { TagSelecter } from "../TagSelecter";
import { PutUrl } from "../PutUrl";

type PostFormType = {
  title: string;
  content: string;
};

const PostFormScheme = z.object({
  title: z.string().min(5, "※タイトルは5文字以上で入力してください"),
  content: z.string().min(20, "※内容は20文字以上で入力してください"),
});

const PostFormModal = () => {
  const [isOpen, setIsOpen] = useAtom(modalOpenAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormType>({
    resolver: zodResolver(PostFormScheme),
  });

  const trpc = api.useContext();
  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      toast.success("新しい投稿を作成しました！");
      setIsOpen(false);
      reset();
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
    },
  });

  const onSubmit: SubmitHandler<PostFormType> = (data) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <Title size="xl">投稿</Title>
        <input
          type="text"
          id="title"
          className="focus:shadow-outline h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-purple-600"
          placeholder="タイトルを入力してください"
          {...register("title")}
        />
        <p className="w-full pb-2 text-left text-sm text-red-400">
          {errors.title?.message}
        </p>

        <textarea
          id="maincontent"
          placeholder="内容を入力してください"
          {...register("content")}
          className="focus:shadow-outline h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-purple-600"
          cols={10}
          rows={10}
        ></textarea>
        <p className="w-full pb-2 text-left text-sm text-red-400">
          {errors.content?.message}
        </p>
        <TagSelecter />
        <PutUrl />
        <Button type="submit" variant="outline" size="sm" color="indigo">
          投稿
        </Button>
      </form>
    </Modal>
  );
};

export default PostFormModal;
