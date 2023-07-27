import {
  Table,
  Group,
  Text,
  ActionIcon,
  useMantineTheme,
  Image,
  Divider,
  ScrollArea,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { PostProps } from "../Post";

type PostsStackProps = {
  posts: PostProps[];
};

export function PostsStack({ posts }: PostsStackProps) {
  const rows = posts.map((post) => (
    <tr key={post.id}>
      <td>
        <Image
          radius="sm"
          width={106}
          height={60}
          src={`https://i.ytimg.com/vi/${post.videoId}/maxresdefault.jpg`}
        />
      </td>
      <td>
        <Group spacing="sm">
          <Text size="sm" weight={500}>
            {post.title.length > 10
              ? post.title.substring(0, 10) + "..."
              : post.title}
          </Text>
        </Group>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          {post.createdAt.toLocaleDateString()}
        </Text>
      </td>
      <td>
        <Group spacing={0}>
          <ActionIcon>
            <IconPencil size="1.5rem" stroke={1.5} />
          </ActionIcon>
          <Divider orientation="vertical" className="mx-1"></Divider>
          <ActionIcon color="red">
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table className="min-w-full" verticalSpacing="sm">
        <thead>
          <tr>
            <th>動画</th>
            <th>タイトル</th>
            <th>投稿日</th>
            <th>編集 / 削除</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
