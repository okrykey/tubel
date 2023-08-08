import { api } from "~/utils/api";
import React, { useState, useEffect } from "react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  MultiSelect,
  Paper,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import MainLayout from "~/layouts/Mainlayout";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";

type PostFormType = {
  title: string;
  content: string;
  videoId: string;
  tags: string[];
  category: string;
};

export type TAG = { value: string; label: string };

const categories = [
  { value: "programming", label: "Programming" },
  { value: "english", label: "English" },
  { value: "science", label: "Science" },
  { value: "culture", label: "Culture" },
  { value: "society", label: "Society" },
  { value: "art", label: "Art" },
  { value: "movie", label: "Movie" },
  { value: "fashion", label: "Fashion" },
];

const tags = [
  { value: "youtube", label: "YouTube" },
  { value: "motivation", label: "motivation" },
  { value: "computer-science", label: "computer-science" },
  { value: "science", label: "science" },
];

const EditPost = () => {
  const [selectedTags, setSelectedTags] = useState<TAG[]>(tags);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

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
      if (postQuery.data.userId !== session?.user?.id) {
        router.push("/");
      }
    }
  }, [session, router]);

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
      router.push(`/user/${postQuery.data?.username}`);
      notifications.show({
        color: "grape",
        autoClose: 5000,
        title: "記事を変更",
        message: "記事を変更しました！",
      });
      form.reset();
    },
    onSettled: async () => {
      await trpc.post.all.invalidate();
      await trpc.post.getByCategories.invalidate();
    },
  });

  return (
    <MainLayout>
      <Container className="h-full w-full px-4 py-16">
        <Paper withBorder radius="sm" p="lg">
          <h3 className="p-2 text-center text-lg font-bold">投稿を編集</h3>
          <form
            className="flex flex-col items-center justify-center space-y-6"
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
              label="タイトル"
              {...form.getInputProps("title")}
              className="w-full"
              placeholder="タイトルを入力してください"
            />

            <Textarea
              id="content"
              label="内容"
              {...form.getInputProps("content")}
              placeholder="内容を入力してください"
              className="w-full"
              minRows={3}
              maxRows={7}
              autosize
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

            <Group position="apart" mt="lg" className="sm:flex-col-reverse">
              <Anchor
                color="dimmed"
                size="sm"
                className="sm:w-full sm:text-center"
              >
                <Center inline>
                  <Box ml={5} onClick={() => router.back()}>
                    前のページに戻る
                  </Box>
                </Center>
              </Anchor>
              <Button
                className="sm:w-full sm:text-center"
                variant="outline"
                type="submit"
              >
                編集する
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default EditPost;
