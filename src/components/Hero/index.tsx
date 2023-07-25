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
import { IconCheck } from "@tabler/icons-react";
import { useAtom } from "jotai";
import Link from "next/link";
import { modalOpenAtom } from "~/pages/state/Atoms";
import { signIn, signOut, useSession } from "next-auth/react";
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
            <Title className={classes.title}>学びを共有しよう</Title>
            <Text color="dimmed" mt="md">
              学びを共有し、知識を広げるための無料のSNSプラットフォームへようこそ。私たちのサイトは、誰もが自由に学び、教え、つながることができる場所です。
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={15} radius="md">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>無料でアクセス可能</b>
                ：あなたの学びの旅は、費用を心配することなく始めることができます。私たちのコンテンツはすべて無料で、誰でも利用できます。
              </List.Item>
              <List.Item>
                <b>わかりやすいコンテンツ</b>
                ：私たちは、学びを楽しく、簡単にするために、わかりやすい教材を提供しています。専門知識がなくても、あなたの学びをサポートします。
              </List.Item>
              <List.Item>
                <b>学習の最短経路</b>
                ：私たちのプラットフォームは、学びを通じて人々をつなげる場所です。あなたの知識を共有し、他の学習者から学び、一緒に成長しましょう。
              </List.Item>
            </List>

            <Button
              variant="outline"
              size="xl"
              radius="xl"
              className={classes.control}
              onClick={() =>
                sessionData ? setIsOpen(true) : router.push("/signin")
              }
            >
              {sessionData ? "Get Started!" : "登録する"}
            </Button>
          </div>
          <Image src="images/signin-icon.png" className={classes.image} />
        </div>
      </Container>
    </div>
  );
};
