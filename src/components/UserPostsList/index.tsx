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

type Post = {
  id: string;
  title: string;
  videoId: string;
  createdAt: Date;
  user?: {
    id: string;
  };
};

type PostsStackProps = {
  posts: Post[];
};

const PostRow: React.FC<{ post: Post }> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const isUserMatch = session && session.user?.id === post.user?.id;

  const YouTubeVideoId =
    new URLSearchParams(new URL(post.videoId).search).get("v") || "";

  const trpc = api.useContext();
  const deletePost = api.post.delete.useMutation({
    onSettled: async () => {
      await trpc.user.getUserPosts.invalidate();
      await trpc.user.getUserProfile.invalidate();
    },
  });

  return (
    <>
      <tr>
        <td>
          <Link href={`/tubes/${post.id}`}>
            <Image
              radius="sm"
              width={106}
              height={60}
              src={`https://i.ytimg.com/vi/${YouTubeVideoId}/maxresdefault.jpg`}
              alt={`Thumbnail for ${post.title}`}
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
                variant="subtle"
                color="gray"
                size="xs"
                radius="xl"
                onClick={() => router.push(`/tubes/${post.id}/edit`)}
              >
                編集
              </Button>

              <Button
                onClick={() => {
                  setSelectedPostId(post.id);
                  open();
                }}
                variant="subtle"
                color="red"
                size="xs"
                radius="xl"
              >
                削除
              </Button>
            </Group>
          )}
        </td>
      </tr>
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
    </>
  );
};

export function UserPostsList({ posts }: PostsStackProps) {
  return (
    <ScrollArea>
      <Table className="min-w-full" verticalSpacing="sm">
        <thead>
          <tr>
            <th>動画</th>
            <th>タイトル</th>
            <th className="hidden sm:table-cell">投稿日</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <PostRow post={post} key={post.id} />
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
