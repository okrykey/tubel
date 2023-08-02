import {
  Table,
  Group,
  Text,
  Image,
  ScrollArea,
  Modal,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { PostProps } from "../Post";

type PostsStackProps = {
  posts: PostProps[];
};

export function PostsStack({ posts }: PostsStackProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  const rows = posts.map((post) => {
    const isUserMatch = session && session.user?.id === post.user?.id;

    const YouTubeVideoId = new URLSearchParams(
      new URL(post.videoId).search
    ).get("v");

    return (
      <tr key={post.id}>
        <td>
          <Link href={`/posts/${post.id}`}>
            <Image
              radius="sm"
              width={106}
              height={60}
              src={`https://i.ytimg.com/vi/${YouTubeVideoId}/maxresdefault.jpg`}
            />
          </Link>
        </td>
        <td>
          <Group spacing="sm">
            <Text size="sm" weight={500} className="w-full md:w-auto">
              {post.title.length > 10
                ? post.title.substring(0, 10) + "..."
                : post.title}
            </Text>
          </Group>
        </td>
        <td className="hidden sm:table-cell">
          <Text size="sm" color="dimmed">
            {post.createdAt.toLocaleDateString()}
          </Text>
        </td>
        <td>
          {isUserMatch && (
            <Group spacing={10}>
              <Button
                variant="outline"
                size="xs"
                radius="xl"
                onClick={() => router.push(`/posts/${post.id}/edit`)}
              >
                編集
              </Button>

              <Button
                onClick={() => {
                  setSelectedPostId(post.id);
                  open();
                }}
                color="red"
                variant="outline"
                size="xs"
                radius="xl"
              >
                削除
              </Button>
            </Group>
          )}
        </td>
      </tr>
    );
  });

  const trpc = api.useContext();
  const deletePost = api.post.delete.useMutation({
    onSettled: async () => {
      await trpc.user.getUserPosts.invalidate();
      await trpc.user.getUserProfile.invalidate();
    },
  });

  return (
    <ScrollArea>
      <Table className="min-w-full" verticalSpacing="sm">
        <thead>
          <tr>
            <th>動画</th>
            <th>タイトル</th>
            <th className="hidden sm:table-cell">投稿日</th>
            <th>編集</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <Modal opened={opened} onClose={close} centered title="削除">
          <Group position="apart" mb="xs">
            <Text fz="sm" className="py-4 ">
              本当に削除しますか？（この投稿へのコメントも削除されます）
            </Text>
          </Group>
          <Group position="right" mt="md">
            <Button variant="default" size="xs" onClick={close}>
              キャンセル
            </Button>
            <Button
              variant="outline"
              size="xs"
              color="red"
              onClick={() => {
                deletePost.mutate(selectedPostId);
                close();
              }}
            >
              削除する
            </Button>
          </Group>
        </Modal>
      </Table>
    </ScrollArea>
  );
}
