import {
  Badge,
  Container,
  createStyles,
  Text,
  SimpleGrid,
  Divider,
  Button,
  Center,
} from "@mantine/core";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CategoryList } from "~/components/CategoryList";
import MainLayout from "~/layouts/Mainlayout";
import { modalOpenAtom } from "../../state/Atoms";

const useStyles = createStyles((theme) => ({
  badge: {
    "&:hover": {
      boxShadow: theme.shadows.xs,
      transform: "scale(1.01)",
    },
  },
}));

export default function CategoriesPage() {
  const { theme } = useStyles();
  const [, setIsOpen] = useAtom(modalOpenAtom);
  const { data: sessionData } = useSession();
  const router = useRouter();

  const handleButtonClick = () => {
    if (sessionData) {
      setIsOpen(true);
    } else {
      void router.push("/signin");
    }
  };

  return (
    <MainLayout>
      <Container
        p="md"
        size="lg"
        className=" h-fill flex w-full max-w-5xl flex-col pt-10"
      >
        <Center>
          <Badge
            component="h1"
            size="xl"
            radius="sm"
            variant="outline"
            color={theme.colorScheme === "dark" ? "teal" : "dark"}
            m="md"
          >
            全てのカテゴリ一覧
          </Badge>
        </Center>

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
          <div className="flex flex-col  space-y-4 pb-8">
            <Center>
              <Button
                variant="filled"
                color={theme.colorScheme === "dark" ? "teal" : "dark"}
                size="md"
                radius="xl"
                onClick={handleButtonClick}
              >
                おすすめ動画を共有する
              </Button>
            </Center>
            <Text
              className="pt-4 text-right"
              color="dimmed"
              size="xs"
              weight={600}
            >
              ※カテゴリの追加要望は
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdytwlDnLWjiRZmmdilnyo-j8nrpmUsl5swNDLDfcBkHrlhSA/viewform"
                className="underline"
              >
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
