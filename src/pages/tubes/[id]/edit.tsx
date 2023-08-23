import { api } from "~/utils/api";
import React, { useState, useEffect } from "react";
import {
  Anchor,
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Group,
  MultiSelect,
  Paper,
  Select,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import MainLayout from "~/layouts/Mainlayout";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import YouTube from "react-youtube";

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

const opts = {
  width: "90%",
  height: "90%",
};

const extractVideoIdFromUrl = (url: string): string | null => {
  return new URLSearchParams(new URL(url).search).get("v");
};

const EditPost = () => {
  const theme = useMantineTheme();
  const [selectedTags, setSelectedTags] = useState<TAG[]>(tags);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const trpc = api.useContext();
  const postQuery = api.post.get.useQuery(id as string);

  const [inputVideoId, setInputVideoId] = useState<string>("");

  const [YouTubeVideoId, setYouTubeVideoId] = useState<
    string | null | undefined
  >("");

  const handlePreview = () => {
    const youtubeUrlPattern =
      /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeUrlPattern.test(inputVideoId)) {
      notifications.show({
        color: "red",
        autoClose: 5000,
        title: "エラー",
        message: "無効なYouTubeのURLです。",
      });
      return;
    }

    const extractedVideoId = extractVideoIdFromUrl(inputVideoId);
    form.setValues({ ...form.values, videoId: inputVideoId });
    setYouTubeVideoId(extractedVideoId);
    setShowPreview(true);
  };

  const form = useForm<PostFormType>({
    initialValues: {
      title: postQuery.data?.title ?? "",
      content: postQuery.data?.content ?? "",
      videoId: postQuery.data?.videoId ?? "",
      tags: postQuery.data?.tags ?? [],
      category: postQuery.data?.category ?? "",
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
      tags: (value) => (value.length < 1 ? "※タグを選択してください" : null),
    },
  });

  useEffect(() => {
    if (postQuery.isSuccess) {
      const postData = postQuery.data;

      if (postData.userId !== session?.user?.id) {
        void router.push("/");
        return;
      }

      setInputVideoId(postData.videoId);
      const videoId = extractVideoIdFromUrl(postData.videoId);
      setYouTubeVideoId(videoId);

      form.setValues({
        title: postData.title,
        content: postData.content,
        videoId: postData.videoId,
        tags: postData.tags,
        category: postData.category,
      });
    }
  }, [postQuery.isSuccess]);

  const { mutate } = api.post.update.useMutation({
    onSuccess: () => {
      void router.push(
        `/user/${postQuery.data?.username ?? "defaultUsername"}`
      );

      notifications.show({
        color: "indigo",
        autoClose: 5000,
        message: "記事を編集しました！",
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
              console.log("Submitting with videoId:", data.videoId);
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
              onChange={(e) => {
                setInputVideoId(e.target.value);
                form.setValues({ ...form.values, videoId: e.target.value });
              }}
              value={inputVideoId}
              className="w-full"
            />

            <div className="flex w-full flex-col items-end">
              <Button
                type="button"
                size="xs"
                radius="xl"
                color={theme.colorScheme === "dark" ? "teal" : "dark"}
                onClick={handlePreview}
                variant="outline"
                className="text-right"
                disabled={!inputVideoId || inputVideoId.trim() === ""}
              >
                動画のプレビュー
              </Button>
              <Text color="dimmed" size="xs" pt="xs" className="text-right">
                ※フォームの下に表示されます
              </Text>
            </div>

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
                variant="filled"
                type="submit"
                color={theme.colorScheme === "dark" ? "teal" : "dark"}
              >
                投稿を編集する
              </Button>
            </Group>
          </form>
        </Paper>
        {showPreview && (
          <Paper withBorder radius="sm" p="sm" className="mt-4">
            <Text size="lg" weight={600}>
              プレビュー
            </Text>
            <AspectRatio ratio={16 / 9}>
              <YouTube
                videoId={YouTubeVideoId || undefined}
                opts={opts}
              ></YouTube>
            </AspectRatio>
          </Paper>
        )}
      </Container>
    </MainLayout>
  );
};

export default EditPost;
