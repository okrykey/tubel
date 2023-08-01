import Modal from "../Modal";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/pages/state/Atoms";
import { api } from "~/utils/api";
import React, { useState } from "react";
import {
  Button,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import toast from "react-hot-toast";
import { useForm } from "@mantine/form";

type PostFormType = {
  title: string;
  content: string;
  videoId: string;
  tags: string[];
  category: string;
};

export type TAG = { value: string; label: string };

const categories = [
  { value: "Programming", label: "Programming" },
  { value: "English", label: "English" },
  { value: "Culture", label: "Culture" },
];

const tags = [
  { value: "youtube", label: "YouTube" },
  { value: "motivation", label: "motivation" },
  { value: "cs", label: "cs" },
  { value: "science", label: "science" },
];

const PostFormModal = () => {
  const [isOpen, setIsOpen] = useAtom(modalOpenAtom);

  const [selectedTags, setSelectedTags] = useState<TAG[]>(tags);

  const form = useForm<PostFormType>({
    initialValues: {
      title: "",
      content: "",
      videoId: "",
      tags: [""],
      category: "",
    },

    validate: {
      title: (value) =>
        value.length < 5 ? "※タイトルは5文字以上で入力してください" : null,
      content: (value) =>
        value.length < 20 ? "※内容は20文字以上で入力してください" : null,
      videoId: (value) => (value.length < 5 ? "※URLを入力してください" : null),
      category: (value) =>
        value.length < 1 ? "※カテゴリを選択してください" : null,
      tags: (value) => (value.length < 1 ? "※タグを選択してください" : null),
    },
  });

  const trpc = api.useContext();
  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      toast.success("新しい投稿を作成しました！");
      setIsOpen(false);
      form.reset();
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form
        className="flex flex-col items-center justify-center space-y-4"
        onSubmit={form.onSubmit((data: PostFormType) => {
          mutate(data);
        })}
      >
        <Title size="xl">投稿</Title>
        <TextInput
          type="text"
          id="title"
          {...form.getInputProps("title")}
          className="w-full"
          placeholder="タイトルを入力してください"
        />

        <Textarea
          id="content"
          {...form.getInputProps("content")}
          placeholder="内容を入力してください"
          className="w-full"
          minRows={6}
        ></Textarea>

        <Select
          label="関連するカテゴリ"
          className="w-full"
          {...form.getInputProps("category")}
          placeholder="カテゴリを選択してください"
          clearable
          data={categories}
        />

        <MultiSelect
          label="関連するタグ"
          className="w-full"
          data={selectedTags}
          {...form.getInputProps("tags")}
          placeholder="タグを入力または選択してください"
          nothingFound="Nothing found"
          searchable
          creatable
          getCreateLabel={(query) => `+ ${query}`}
          onCreate={(query) => {
            const item = { id: query, value: query, label: query };
            setSelectedTags((current) => [...current, item]);
            return item;
          }}
        />

        <TextInput
          label="YouTubeのURL"
          id="url"
          type="text"
          placeholder="https://www.youtube.com/xxxxxxxx"
          {...form.getInputProps("videoId")}
          className="w-full"
        />

        <Button type="submit" variant="outline" size="sm" color="indigo">
          投稿
        </Button>
      </form>
    </Modal>
  );
};

export default PostFormModal;
