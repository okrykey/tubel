import {
  createStyles,
  Image,
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
  ActionIcon,
  HoverCard,
  Center,
  SimpleGrid,
  Text,
  UnstyledButton,
  Collapse,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ActionToggle } from "../ActionToggle";
import Link from "next/link";
import { api } from "~/utils/api";
import {
  IconAtom,
  IconBook,
  IconChevronDown,
  IconGlobe,
  IconMovie,
  IconSearch,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  menu: {
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[4],
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

const categoryData = [
  {
    icon: IconMovie,
    title: "映画",
    label: "movie",
    description:
      "制作の裏話から最新情報まで。映画の魅力や背後にあるストーリーを探求しよう",
  },
  {
    icon: IconBook,
    title: "英語",
    label: "english",
    description: "見るだけで世界中へ。場所を問わずグローバル化しよう",
  },
  {
    icon: IconAtom,
    title: "科学",
    label: "science",
    description: "自然科学からコンピュータ科学まで、幅広い知識を学ぼう",
  },
  {
    icon: IconGlobe,
    title: "文化",
    label: "culture",
    description:
      "世界中の文化が集まる。動画から多様な文化と世界の広さを感じよう",
  },
];

export const HeaderTabs = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { data: sessionData } = useSession();
  const router = useRouter();

  const userId: string | undefined = sessionData?.user?.id;
  const userAvatarQuery = api.user.getUserAvatar.useQuery(
    {
      userId: userId || "",
    },
    {
      enabled: !!userId,
    }
  );

  const userImage: string = (userAvatarQuery.data?.image as string) || "";
  const userName: string = (userAvatarQuery.data?.username as string) || "";

  const links = categoryData.map((item) => (
    <UnstyledButton
      className={classes.subLink}
      key={item.label}
      onClick={() => {
        void closeDrawer();
        void router.push(`/category/${item.label}`);
      }}
    >
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));
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
            <Link href="/" className={classes.link}>
              <Image
                width={100}
                height={60}
                src={
                  theme.colorScheme === "dark"
                    ? "/images/tubel-white-logo.png"
                    : "/images/tubel-logo.png"
                }
                alt="Tubel"
              ></Image>
            </Link>

            <Link href="/about" className={classes.link}>
              ABOUT
            </Link>

            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link href="/category" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      CATEGORY
                    </Box>
                    <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    />
                  </Center>
                </Link>
              </HoverCard.Target>
              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text fw={500}>カテゴリ</Text>
                  <Link href="/category" className="text-xs underline">
                    すべてみる
                  </Link>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text fw={500} fz="sm">
                        カテゴリの追加
                      </Text>
                      <Text size="xs" color="dimmed">
                        カテゴリの追加は
                        <Link
                          href="https://docs.google.com/forms/d/e/1FAIpQLSdytwlDnLWjiRZmmdilnyo-j8nrpmUsl5swNDLDfcBkHrlhSA/viewform"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          お問い合わせ
                        </Link>
                        にお願いします
                      </Text>
                    </div>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group className={classes.hiddenMobile}>
            <Link href="/search">
              <ActionIcon>
                <IconSearch size="1.5rem" stroke={1.5} />
              </ActionIcon>
            </Link>
            <ActionToggle />

            {sessionData && (
              <>
                <Menu
                  transitionProps={{
                    transition: "rotate-right",
                    duration: 150,
                  }}
                  position="bottom-end"
                  shadow="xs"
                  offset={6}
                  width={240}
                >
                  <Menu.Target>
                    <Avatar src={userImage} size={40} radius={80} mx="auto" />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label className="font-bold">ユーザー設定</Menu.Label>
                    <Link href={`/user/${userName}`}>
                      <Menu.Item
                        className={`${classes.menu} text-base font-bold `}
                      >
                        投稿の管理 / 設定
                      </Menu.Item>
                    </Link>

                    <Menu.Divider />
                    <Menu.Label className="font-bold">その他</Menu.Label>

                    <Menu.Item
                      className={`${classes.menu} text-base font-bold `}
                      onClick={() => {
                        void signOut({
                          callbackUrl: `/`,
                        });
                      }}
                    >
                      ログアウト
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            )}

            {!sessionData && (
              <Button
                variant="filled"
                size="xs"
                onClick={() => {
                  void signIn();
                }}
              >
                登録/ログイン
              </Button>
            )}
          </Group>

          <Group className={classes.hiddenDesktop} position="apart">
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
            <ActionToggle />
          </Group>
          <Group className={classes.hiddenDesktop}>
            <Link href="/search">
              <ActionIcon>
                <IconSearch size="1.5rem" stroke={1.5} />
              </ActionIcon>
            </Link>

            {sessionData ? (
              <>
                <Menu
                  transitionProps={{
                    transition: "rotate-right",
                    duration: 150,
                  }}
                  position="bottom-end"
                  shadow="md"
                  offset={6}
                  width={240}
                >
                  <Menu.Target>
                    <Avatar src={userImage} size={40} radius={80} mx="auto" />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label className="font-bold">ユーザー設定</Menu.Label>
                    <Link href={`/user/${userName}`}>
                      <Menu.Item
                        className={`${classes.menu} text-base font-bold `}
                      >
                        投稿の管理/設定
                      </Menu.Item>
                    </Link>

                    <Menu.Divider />
                    <Menu.Label className="font-bold">その他</Menu.Label>

                    <Menu.Item
                      className={`${classes.menu} text-base font-bold `}
                      onClick={() => {
                        void signOut({
                          callbackUrl: `/`,
                        });
                      }}
                    >
                      ログアウト
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <Button variant="outline" size="xs" onClick={() => void signIn()}>
                ログイン
              </Button>
            )}
          </Group>
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        withCloseButton={false}
        size="100%"
        padding="md"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <Drawer.CloseButton size="md" />
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Link href="/" className={classes.link}>
            ホーム
          </Link>

          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                カテゴリ
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href="/about" className={classes.link}>
            Tubelについて
          </Link>
          {sessionData && (
            <Link href={`/user/${userName}`} className={classes.link}>
              ユーザー設定
            </Link>
          )}

          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSdytwlDnLWjiRZmmdilnyo-j8nrpmUsl5swNDLDfcBkHrlhSA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            お問い合わせ
          </Link>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="xl">
            {sessionData ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void signOut({
                    callbackUrl: `/`,
                  });
                }}
              >
                ログアウト
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void signIn();
                }}
              >
                ログイン
              </Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};
