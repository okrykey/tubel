import { createStyles, Text, Avatar, Group, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
  },
}));

interface CommentSimpleProps {
  postedAt: string;
  content: string;
  user: {
    name: string;
    image: string;
  };
}

export function CommentCard({ postedAt, content, user }: CommentSimpleProps) {
  const { classes } = useStyles();
  return (
    <div>
      <Group>
        <Avatar src={user.image} alt={user.name} radius="xl" />
        <div>
          <Text size="sm">{user.name}</Text>
          <Text size="xs" color="dimmed">
            {postedAt}
          </Text>
        </div>
      </Group>
      <Text className={classes.body} size="sm">
        {content}
      </Text>
    </div>
  );
}
