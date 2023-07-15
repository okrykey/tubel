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
import Link from "next/link";

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
    fontWeight: 900,
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
  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <span className={classes.highlight}>Next.js</span> React <br />{" "}
              Typescript
            </Title>
            <Text color="dimmed" mt="md">
              Build fully functional accessible web applications faster than
              ever – Mantine includes more than 120 customizable components and
              hooks to cover you in any situation
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
                <b>TypeScript based</b> – build type safe applications, all
                components and hooks export types
              </List.Item>
              <List.Item>
                <b>Free and open source</b> – all packages have MIT license, you
                can use Mantine in any project
              </List.Item>
              <List.Item>
                <b>No annoying focus ring</b> – focus ring will appear only when
                user navigates with keyboard
              </List.Item>
            </List>

            <Link href="/signin">
              <Button
                variant="outline"
                size="xl"
                radius="xl"
                className={classes.control}
              >
                Get started
              </Button>
            </Link>
          </div>
          <Image src="images/signin-icon.png" className={classes.image} />
        </div>
      </Container>
    </div>
  );
};
