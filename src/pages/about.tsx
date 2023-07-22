import {
  createStyles,
  Title,
  Container,
  Accordion,
  ThemeIcon,
  MantineProvider,
  getStylesRef,
  rem,
  Box,
  Timeline,
  Text,
  Avatar,
  Divider,
} from "@mantine/core";
import MainLayout from "~/layouts/Mainlayout";
import { IconSun, IconVideo, IconPlus } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    minHeight: rem(820),
    backgroundImage: ``,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top left",
    position: "relative",
    color: theme.black,
  },

  title: {
    fontWeight: 800,
    fontSize: rem(50),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  subtitle: {
    fontWeight: 800,
    fontSize: rem(30),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(20),
      textAlign: "left",
    },
  },

  description: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[6],
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      fontSize: theme.fontSizes.md,
      textAlign: "left",
    },
  },

  item: {
    backgroundColor: theme.white,
    borderBottom: 0,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
    overflow: "hidden",
  },

  control: {
    fontSize: theme.fontSizes.lg,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    color: theme.black,

    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  content: {
    paddingLeft: theme.spacing.xl,
    lineHeight: 1.6,
    color: theme.black,
  },

  icon: {
    ref: getStylesRef("icon"),
    marginLeft: theme.spacing.md,
  },

  gradient: {
    backgroundImage: `r`,
  },

  itemOpened: {
    [`& .${getStylesRef("icon")}`]: {
      transform: "rotate(45deg)",
    },
  },

  button: {
    display: "block",
    marginTop: theme.spacing.md,

    [theme.fn.smallerThan("sm")]: {
      display: "block",
      width: "100%",
    },
  },
}));

const placeholder =
  "It can’t help but hear a pin drop from over half a mile away, so it lives deep in the mountains where there aren’t many people or Pokémon.It was born from sludge on the ocean floor. In a sterile environment, the germs within its body can’t multiply, and it dies.It has no eyeballs, so it can’t see. It checks its surroundings via the ultrasonic waves it emits from its mouth.";

export default function About() {
  const { classes } = useStyles();
  return (
    <MainLayout>
      <MantineProvider inherit theme={{ colorScheme: "light" }}>
        <div className={classes.wrapper}>
          <Title className={classes.title}>
            Automated AI code reviews for{" "}
            <Text component="span" inherit className="text-yellow-300">
              any stack
            </Text>
          </Title>

          <Container size={640}>
            <Text size="lg" className={classes.description}>
              Build more reliable software with AI companion. AI is also trained
              to detect lazy developers who do nothing and just complain on
              Twitter.
            </Text>
            <div className="p-8">
              <Title className={classes.subtitle} size={rem(30)}>
                How to use ?
              </Title>
              <Text size="lg" className={classes.description}>
                Build more reliable software with AI companion. AI is also
                trained to detect lazy developers who do nothing and just
                complain on Twitter.
              </Text>

              <Box maw={320} mx="auto">
                <Timeline>
                  <Timeline.Item title="Default bullet" bulletSize={24}>
                    <Text color="dimmed" size="sm">
                      1. 投稿されたものをみる
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item
                    title="Avatar"
                    bulletSize={24}
                    bullet={
                      <Avatar
                        size={22}
                        radius="xl"
                        src="https://avatars0.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4"
                      />
                    }
                  >
                    <Text color="dimmed" size="sm">
                      2. 投稿に対してコメントする
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item
                    title="Icon"
                    bulletSize={24}
                    bullet={<IconSun size="0.8rem" />}
                  >
                    <Text color="dimmed" size="sm">
                      3. ためになった動画を投稿してみる
                    </Text>
                  </Timeline.Item>
                </Timeline>
              </Box>
            </div>
            <Divider my="sm" />
            <Accordion
              chevronPosition="right"
              defaultValue="reset-password"
              chevronSize={50}
              variant="separated"
              disableChevronRotation
              chevron={<IconPlus size="1.05rem" stroke={1.5} />}
            >
              <Accordion.Item className={classes.item} value="reset-password">
                <Accordion.Control>
                  How can I reset my password?
                </Accordion.Control>
                <Accordion.Panel>{placeholder}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="another-account">
                <Accordion.Control>
                  Can I create more that one account?
                </Accordion.Control>
                <Accordion.Panel>{placeholder}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Container>
        </div>
      </MantineProvider>
    </MainLayout>
  );
}
