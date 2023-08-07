import {
  Badge,
  Container,
  createStyles,
  Text,
  SimpleGrid,
  rem,
  Divider,
  Button,
} from "@mantine/core";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CategoryList } from "~/components/CategoryList";
import MainLayout from "~/layouts/Mainlayout";
import { modalOpenAtom } from "../state/Atoms";

const useStyles = createStyles((theme) => ({
  badge: {
    "&:hover": {
      boxShadow: theme.shadows.xs,
      transform: "scale(1.01)",
    },
  },

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
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },
}));

export default function CategoriesPage() {
  const { theme } = useStyles();
  const [_, setIsOpen] = useAtom(modalOpenAtom);
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <MainLayout>
      <Container
        p="md"
        size="lg"
        className=" h-fill flex w-full max-w-5xl flex-col pt-10"
      >
        <Badge
          component="h1"
          size="xl"
          radius="sm"
          color={theme.colorScheme === "dark" ? "blue" : "dark"}
          variant="outline"
          m="md"
          className="w-full"
        >
          全てのカテゴリ一覧
        </Badge>

        <Divider className="mt-10" />
        <div className="h-full w-full ">
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            my={40}
            className="mx-4 md:mx-0"
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
            ]}
          >
            <CategoryList />
          </SimpleGrid>
          <div className="flex flex-col items-center space-y-4 pb-8">
            <Button
              variant="outline"
              color="indigo"
              size="md"
              radius="xl"
              onClick={() =>
                sessionData ? setIsOpen(true) : router.push("/signin")
              }
            >
              おすすめ動画
              <Text
                component="span"
                inherit
                color={theme.colorScheme === "dark" ? "white" : "black"}
              >
                を共有する
              </Text>
            </Button>
            <Text className="text-center" color="dimmed" size="xs" weight={600}>
              ※カテゴリの追加は
              <Link href="/" className="underline">
                お問い合わせ
              </Link>
              までお願いします。
            </Text>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
