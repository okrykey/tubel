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
import { LoginModalAtom, modalOpenAtom } from "~/state/Atoms";
import { useSession } from "next-auth/react";
import { useResponsive } from "~/utils/useResponsive";

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
      fontSize: rem(50),
      lineHeight: 1.3,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(42),
      lineHeight: 1.3,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.2)`,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      marginTop: "16px",
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
  const { classes, theme } = useStyles();
  const [, setIsOpen] = useAtom(modalOpenAtom);
  const [, setIsLginOpen] = useAtom(LoginModalAtom);
  const { data: sessionData } = useSession();
  const isMobile = useResponsive();

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <Group spacing={0}>
                You
                <Text
                  component="span"
                  inherit
                  color={theme.colorScheme === "dark" ? "teal" : "indigo"}
                >
                  Tube
                </Text>
                <Text component="span" inherit color="gray">
                  ×
                </Text>
                <Text
                  component="span"
                  inherit
                  color={theme.colorScheme === "dark" ? "teal" : "indigo"}
                >
                  L
                </Text>
                earn
              </Group>
            </Title>

            <Text color="dimmed" mt="md">
              有益な動画を共有し、新たな学びを発見しよう。学習に役立つ動画を見つけ、効率的に学習を深めよう。
            </Text>

            <List
              className="mt-4 md:mt-7"
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon
                  size={18}
                  radius="md"
                  variant="outline"
                  className="mt-2 md:mt-1.5"
                >
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              {isMobile ? (
                <List.Item>
                  <b className="text-2xl">
                    Learning from YouTube, You earn more!
                  </b>
                </List.Item>
              ) : (
                <>
                  <List.Item>
                    <b className="text-xl">Learning from YouTube</b>
                    ：YouTubeのコンテンツはすべてフリー。誰でもどこでも。
                  </List.Item>
                  <List.Item>
                    <b className="text-xl"> You earn more!</b>
                    ：有益な動画から役立つ情報を吸収しよう。
                  </List.Item>
                </>
              )}
            </List>

            <Button
              variant="filled"
              size="xl"
              radius="xl"
              className={classes.control}
              onClick={() =>
                sessionData ? setIsOpen(true) : setIsLginOpen(true)
              }
            >
              学びになる動画を共有する
            </Button>
          </div>
          <Image
            src="images/hero.png"
            alt="hero image"
            className={classes.image}
            width={350}
            height={350}
          />
        </div>
      </Container>
    </div>
  );
};
