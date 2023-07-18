import {
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  rem,
  ActionIcon,
} from "@mantine/core";
import { BiBookmark, BiHeart, BiLike } from "react-icons/bi";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  },

  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },
  action: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    }),
  },
  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface CommentHtmlProps {
  postedAt: string;
  content: string;
  user: {
    name: string;
    image: string;
  };
}

export function CommentCard({ postedAt, content, user }: CommentHtmlProps) {
  const { classes, theme } = useStyles();
  return (
    <Paper withBorder radius="lg" p="sm" className={classes.comment}>
      <Group>
        <Avatar src={user.image} alt={user.name} radius="xl" />
        <div>
          <Text fz="sm">{user.name}</Text>
          <Text fz="xs" c="dimmed">
            {postedAt}
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
