import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(50),
    paddingBottom: rem(50),
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily || "sans-serif"}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

export function NotFoundImage() {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
      >
        <div>
          <Title className={classes.title}>
            検索キーワードを入力してください
          </Title>
          <Image
            src="images/search-image.png"
            alt="Search Placeholder"
            className={classes.mobileImage}
          />
          <Text color="dimmed" size="lg">
            キーワードに該当するタイトル、本文の投稿が表示されます。
          </Text>
          <Button
            variant="subtle"
            size="md"
            mt="xl"
            className={classes.control}
            onClick={() => router.back()}
          >
            前のページへ戻る
          </Button>
        </div>

        <Image
          src="images/search-image.png"
          alt="Search Placeholder"
          className={classes.desktopImage}
        />
      </SimpleGrid>
    </Container>
  );
}
