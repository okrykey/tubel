import {
  createStyles,
  Text,
  Button,
  Container,
  Group,
  rem,
  Image,
} from "@mantine/core";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/pages/state/Atoms";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(16),
    paddingBottom: rem(80),
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily || "sans-serif"}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

export function NotFoundResult() {
  const { classes } = useStyles();
  const [, setIsOpen] = useAtom(modalOpenAtom);

  return (
    <Container className={`${classes.root} flex flex-col items-center`}>
      <Image
        src="images/no-result-image.png"
        alt="no result"
        width={400}
        height={320}
        className={classes.desktopImage}
      />
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        現在、このキーワードに関連する記事はありません。
      </Text>
      <Group position="center">
        <Button variant="subtle" size="md" onClick={() => setIsOpen(true)}>
          関連する記事を投稿する
        </Button>
      </Group>
    </Container>
  );
}
