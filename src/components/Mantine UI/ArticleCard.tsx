import {
  Card,
  Text,
  ActionIcon,
  Group,
  Center,
  Avatar,
  createStyles,
  rem,
} from "@mantine/core";
import {
  BiBookmark,
  BiLike,
  BiSolidBookmark,
  BiSolidLike,
} from "react-icons/bi";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 100ms ease",
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.02)",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: rem(6),
      backgroundImage: theme.fn.linearGradient(
        0,
        theme.colors.indigo[2],
        theme.colors.grape[6]
      ),
    },
  },

  rating: {
    position: "absolute",
    top: theme.spacing.xs,
    right: rem(12),
    pointerEvents: "none",
  },

  title: {
    display: "block",
    marginTop: theme.spacing.md,
    marginBottom: rem(5),
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

  footer: {
    marginTop: theme.spacing.md,
  },
}));

interface ArticleCardProps {
  image: string;
  link: string;
  title: string;
  description: string;
  author: {
    name: string;
    image: string;
  };
}

export function ArticleCard({
  className,
  image,
  link,
  title,
  description,
  author,
  ...others
}: ArticleCardProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof ArticleCardProps>) {
  const [isLiked, setIsCLiked] = useState(false);
  const [isBookmark, setIsCBookmark] = useState(false);

  const handleClickLike = () => {
    setIsCLiked(!isLiked);
  };
  const handleClickBookmark = () => {
    setIsCBookmark(!isBookmark);
  };
  const { classes, cx, theme } = useStyles();
  const linkProps = {
    href: link,
  };
  const LimitedDescription =
    description.length > 20 ? description.slice(0, 20) + "..." : description;

  return (
    <Card
      withBorder
      radius="md"
      className={cx(classes.card, className)}
      {...others}
    >
      <Text className={classes.title} fw={500} component="a" {...linkProps}>
        {title}
      </Text>

      <Text fz="sm" color="dimmed" lineClamp={4}>
        {LimitedDescription}
      </Text>

      <Group position="apart" className={classes.footer}>
        <Center>
          <Avatar src={author.image} size={24} radius="xl" mr="xs" />
          <Text fz="sm" inline>
            {author.name}
          </Text>
        </Center>

        <Group spacing={8} mr={0}>
          <ActionIcon className={classes.action} onClick={handleClickLike}>
            {isLiked ? (
              <BiSolidLike size="1rem" color={theme.colors.blue[6]} />
            ) : (
              <BiLike size="1rem" color={theme.colors.blue[6]} />
            )}
          </ActionIcon>
          <ActionIcon className={classes.action} onClick={handleClickBookmark}>
            {isBookmark ? (
              <BiSolidBookmark size="1rem" color={theme.colors.yellow[6]} />
            ) : (
              <BiBookmark size="1rem" color={theme.colors.yellow[6]} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}
