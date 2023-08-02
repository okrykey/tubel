import { api } from "~/utils/api";
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import toast from "react-hot-toast";
import { useForm } from "@mantine/form";
import MainLayout from "~/layouts/Mainlayout";
import { useRouter } from "next/router";

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
  { value: "youtube", label: "youTube" },
  { value: "motivation", label: "motivation" },
  { value: "cs", label: "cs" },
  { value: "science", label: "science" },
];

const EditPost = () => {
  const [selectedTags, setSelectedTags] = useState<TAG[]>(tags);
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<PostFormType>({
    initialValues: {
      title: "",
      content: "",
      videoId: "",
      tags: [""],
      category: "",
    },
  });

  const trpc = api.useContext();
  const postQuery = api.post.get.useQuery(id as string);

  useEffect(() => {
    if (postQuery.isSuccess) {
      const postData = postQuery.data;
      form.setValues({
        title: postData.title,
        content: postData.content,
        videoId: postData.videoId,
        tags: postData.tags,
        category: postData.category,
      });
    }
  }, [postQuery.data]);

  const { mutate } = api.post.update.useMutation({
    onSuccess: () => {
      router.back();
      toast.success("編集しました！");
      form.reset();
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
    },
  });

  return (
    <MainLayout>
      <Container className="h-full w-full px-10 py-20">
        <form
          className="flex flex-col items-center justify-center space-y-4"
          onSubmit={form.onSubmit((data: PostFormType) => {
            mutate({
              id: id as string,
              ...data,
            });
          })}
        >
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
              const item = { value: query, label: query };
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
            編集する
          </Button>
        </form>
      </Container>
    </MainLayout>
  );
};

export default EditPost;
