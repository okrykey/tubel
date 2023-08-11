import { Group, Text, Image, createStyles, Card, Avatar } from "@mantine/core";

import Link from "next/link";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    "&:hover": {
      boxShadow: theme.shadows.xs,
      transform: "scale(1.005)",
    },
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily || "sans-serif"}`,
    lineHeight: 1.2,
  },

  body: {
    padding: theme.spacing.md,
  },
}));

type BookmarkPostProps = {
  post: {
    id: string;
    title: string;
    category: string;
    videoId: string;
    createdAt: Date;
    user?:
      | {
          id: string;
          image: string | null;
          name: string | null;
        }
      | undefined;
  };
};

export function BookmarkPost({ post }: BookmarkPostProps) {
  const { classes } = useStyles();
  const YouTubeVideoId = new URLSearchParams(new URL(post.videoId).search).get(
    "v"
  );

  return (
    <Link key={post.id} href={`/tubes/${post.id}`}>
      <Card withBorder radius="md" p={0} className={classes.card}>
        <Group noWrap spacing={0} ml="xs">
          <Image
            radius="sm"
            width={106}
            height={60}
            src={`https://i.ytimg.com/vi/${YouTubeVideoId}/maxresdefault.jpg`}
            alt={post.title}
          />
          <div className={classes.body}>
            <Text transform="uppercase" color="dimmed" weight={700} size="xs">
              {post.category}
            </Text>
            <Text className={classes.title} mt="xs" mb="md" size="sm">
              {post.title.length > 8
                ? post.title.substring(0, 8) + "..."
                : post.title}
            </Text>
            <Group noWrap spacing="xs">
              <Group spacing="xs" noWrap>
                <Avatar
                  size={20}
                  src={post.user?.image || undefined}
                  radius="xl"
                />
                <Text size="xs">{post.user?.name || "Unknown"}</Text>
              </Group>

              <Text size="xs" color="dimmed">
                {post.createdAt.toLocaleDateString()}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
    </Link>
  );
}
