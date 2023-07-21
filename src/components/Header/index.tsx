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
  Avatar,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { modalOpenAtom } from "~/pages/state/Atoms";
import { ActionToggle } from "../ActionToggle";
import Link from "next/link";
import { api } from "~/utils/api";

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

export const HeaderTabs = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const { data: sessionData } = useSession();

  const router = useRouter();

  const [isOpen, setIsOpen] = useAtom(modalOpenAtom);

  const userId = sessionData?.user?.id;
  const userAvatarQuery = api.user.getUserAvatar.useQuery(
    {
      userId: userId || "",
    },
    {
      enabled: !!userId,
    }
  );

  const userImage = userAvatarQuery.data?.image as string;

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
            <Menu position="bottom-end" shadow="md" offset={6} width={240}>
              <Menu.Target>
                <Avatar src={userImage} size={40} radius={80} mx="auto" />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label className="font-bold">ユーザー設定</Menu.Label>
                <Menu.Item className="text-base font-bold text-gray-600">
                  プロフィール編集
                </Menu.Item>
                <Menu.Item className="text-base font-bold text-gray-600">
                  ブックマーク
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label className="font-bold">その他</Menu.Label>
                <Link href="/about"></Link>
                <Menu.Item className="text-base font-bold text-gray-600">
                  〇〇について
                </Menu.Item>
                <Menu.Item className="text-base font-bold text-gray-600">
                  ログアウト
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
              {sessionData ? "ログアウト" : "登録/ログイン"}
            </Button>
          </Group>

          <Group className={classes.hiddenDesktop} position="apart">
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>
          <Group className={classes.hiddenDesktop}>
            <ActionToggle />
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
