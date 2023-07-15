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
import { IconShare } from "@tabler/icons-react";
import { BiBookmark, BiLike } from "react-icons/bi";

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
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export function CommentCard({ postedAt, body, author }: CommentHtmlProps) {
  const { classes, theme } = useStyles();
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group>
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text fz="sm">{author.name}</Text>
          <Text fz="xs" c="dimmed">
            {postedAt}
          </Text>
        </div>

        <Group spacing={4} mr={0}>
          <ActionIcon className={classes.action}>
            <BiLike size="1rem" color={theme.colors.blue[6]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <BiBookmark size="1rem" color={theme.colors.yellow[7]} />
          </ActionIcon>
        </Group>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
