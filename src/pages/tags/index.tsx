import {
  Badge,
  Center,
  Container,
  createStyles,
  Group,
  Loader,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  badge: {
    width: "160px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      boxShadow: theme.shadows.xs,
      transform: "scale(1.01)",
    },
  },
}));

export default function TagsPage() {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const getTags = api.tag.getAllTags.useQuery();

  return (
    <MainLayout>
      <Container
        size="lg"
        p="md"
        className="flex h-screen w-full max-w-4xl flex-col py-16"
      >
        <Badge
          component="h1"
          size="xl"
          radius="sm"
          color={theme.colorScheme === "dark" ? "teal" : "dark"}
          variant="outline"
          className="mb-10 "
        >
          全てのタグ一覧
        </Badge>
        {getTags.data && getTags.data?.length > 0 ? (
          <Group spacing={32} position="center">
            {getTags.data?.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.name}`}>
                <Badge
                  radius="lg"
                  size="xl"
                  color={theme.colorScheme === "dark" ? "gray" : "dark"}
                  variant="filled"
                  className={classes.badge}
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </Group>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}
      </Container>
    </MainLayout>
  );
}
