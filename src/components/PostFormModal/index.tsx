import Modal from "../Modal";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/state/Atoms";
import { api } from "~/utils/api";
import React, { useState } from "react";
import {
  Button,
  Group,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

type PostFormType = {
  title: string;
  content: string;
  videoId: string;
  tags: string[];
  category: string;
};

export type TAG = { value: string; label: string };

const categories = [
  { value: "movie", label: "Movie" },
  { value: "english", label: "English" },
  { value: "science", label: "Science" },
  { value: "culture", label: "Culture" },
  { value: "society", label: "Society" },
  { value: "art", label: "Art" },
  { value: "fashion", label: "Fashion" },
];

const tags = [
  { value: "motivation", label: "motivation" },
  { value: "entertainment", label: "entertainment" },
  { value: "wired", label: "wired" },
  { value: "ted", label: "ted" },
  { value: "computerscience", label: "computerscience" },
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
      title: (value) => {
        if (value.length < 3) {
          return "※タイトルは3文字以上で入力してください";
        } else if (value.length > 15) {
          return "※タイトルは最大15文字までです";
        }
        return null;
      },
      content: (value) => {
        if (value.length < 20) {
          return "※内容は20文字以上で入力してください";
        } else if (value.length > 140) {
          return "※内容は最大140文字までです";
        }
        return null;
      },
      videoId: (value) => {
        if (value.length < 5) {
          return "※URLを入力してください";
        }

        const youtubeUrlPattern =
          /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!youtubeUrlPattern.test(value)) {
          return "無効なURLです";
        }
        return null;
      },
      category: (value) =>
        value.length < 1 ? "※カテゴリを選択してください" : null,
    },
  });

  const trpc = api.useContext();
  const { mutate } = api.post.create.useMutation({
    onMutate: () => {
      setIsOpen(false);
    },
    onSuccess: () => {
      notifications.show({
        color: "indigo",
        autoClose: 5000,
        message: "新しい投稿を作成しました！",
      });
      form.reset();
    },
    onError: () => {
      notifications.show({
        color: "red",
        autoClose: 5000,
        message: "エラーが発生しました。もう一度試してください。",
      });
      setIsOpen(true);
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
      await trpc.post.getCategorizedPosts.invalidate();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        // Intentionally empty
      }}
    >
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
          label="投稿のタイトル"
          {...form.getInputProps("title")}
          className="w-full"
          placeholder="タイトルを入力してください"
        />

        <Textarea
          id="content"
          {...form.getInputProps("content")}
          placeholder="内容を入力してください"
          label="投稿の本文"
          className="w-full"
          minRows={3}
          autosize
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\n+$/, "");
          }}
        />

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
        <Group py="sm">
          <Button
            variant="outline"
            type="button"
            size="sm"
            color="red"
            radius="xl"
            onClick={() => {
              form.reset();
              setIsOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button type="submit" variant="filled" size="sm" radius="xl">
            投稿
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default PostFormModal;
