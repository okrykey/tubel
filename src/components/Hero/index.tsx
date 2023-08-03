import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconBrandYoutube, IconCheck } from "@tabler/icons-react";
import { AiFillYoutube } from "react-icons/ai";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/pages/state/Atoms";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: `calc(${theme.spacing.xl} )`,
    paddingBottom: `calc(${theme.spacing.xl} )`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontSize: rem(60),
    fontWeight: 800,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(40),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      lineHeight: 1.3,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.colors.grape[6],
    }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export const Hero = () => {
  const { classes } = useStyles();
  const [isOpen, setIsOpen] = useAtom(modalOpenAtom);
  const { data: sessionData } = useSession();

  const router = useRouter();
  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <Group spacing={0}>
                <AiFillYoutube className="text-3xl text-purple-500 md:text-6xl" />
                <Text
                  color="indigo"
                  component="span"
                  inherit
                  className="text-purple-500"
                >
                  YouTube
                </Text>
                で学びを共有
              </Group>
            </Title>

            <Text color="dimmed" mt="md">
              有益な動画を共有し、新たな学びを発見しよう。学習に役立つ動画を見つけ、効率的に学習を深めよう。
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={15} radius="md" color="indigo">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>自由にアクセス可能</b>
                ：コンテンツはすべてフリー。誰でも楽しめる。
              </List.Item>
              <List.Item>
                <b>役立つ動画すぐ見つかる</b>
                ：学びのある動画を厳選。最短経路で学ぼう。
              </List.Item>
            </List>

            <Button
              variant="outline"
              color="violet"
              size="xl"
              radius="xl"
              className={classes.control}
              onClick={() =>
                sessionData ? setIsOpen(true) : router.push("/signin")
              }
            >
              おすすめ動画
              <Text component="span" inherit className="text-black">
                を共有
              </Text>
            </Button>
          </div>
          <Image src="images/signin-icon.png" className={classes.image} />
        </div>
      </Container>
    </div>
  );
};
