import {
  createStyles,
  Header,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  useMantineColorScheme,
  ActionIcon,
  Avatar,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSun, IconMoonStars, IconSearch } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/pages/state/Atoms";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const ActionToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],
        })}
      >
        {colorScheme === "dark" ? (
          <IconSun size="1.2rem" />
        ) : (
          <IconMoonStars size="1.2rem" />
        )}
      </ActionIcon>
    </Group>
  );
};

export const HeaderTabs = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const { data: sessionData } = useSession();

  const router = useRouter();

  const [isOpen, setIsOpen] = useAtom(modalOpenAtom);

  return (
    <Box pb={0}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
            position="center"
          >
            <a href="/" className={classes.link}>
              Home
            </a>
          </Group>

          <Group className={classes.hiddenMobile}>
            <ActionToggle />
            <Menu position="bottom-end" offset={6}>
              <Menu.Target>
                <Avatar src="" size={40} radius={80} mx="auto" />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<IconSearch size={rem(14)} />} disabled>
                  Search
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Button
              variant="outline"
              size="xs"
              color="indigo"
              onClick={() =>
                sessionData ? setIsOpen(true) : router.push("/signin")
              }
            >
              Post
            </Button>

            <Button
              variant="outline"
              size="xs"
              color="indigo"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </Button>
          </Group>

          <Group className={classes.hiddenDesktop} position="apart">
            <ActionToggle />
          </Group>
          <Group className={classes.hiddenDesktop}>
            {sessionData ? (
              <Button
                variant="outline"
                size="xs"
                color="indigo"
                onClick={() => setIsOpen(true)}
              >
                投稿
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xs"
                color="indigo"
                onClick={() => router.push("/signin")}
              >
                登録
              </Button>
            )}

            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <a href="/" className={classes.link}>
            ホーム
          </a>

          <a href="#" className={classes.link}>
            〇〇とは？
          </a>
          <a href="#" className={classes.link}>
            プライバシーポリシー
          </a>
          <a href="#" className={classes.link}>
            ご要望・ご質問
          </a>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="xl">
            <Button
              variant="outline"
              size="md"
              color="indigo"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};
