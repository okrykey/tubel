import {
  Badge,
  Container,
  createStyles,
  Group,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  badge: {
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
        className="flex h-screen w-full max-w-4xl flex-col py-10"
      >
        <Badge
          component="h1"
          size="xl"
          radius="sm"
          color={theme.colorScheme === "dark" ? "blue" : "dark"}
          variant="outline"
          className="mb-10 "
        >
          全てのタグ一覧
        </Badge>
        {getTags.data && getTags.data?.length > 0 ? (
          <div className="flex flex-col md:flex-row md:space-x-4">
            {getTags.data?.map((tag) => (
              <div key={tag.id} className="pb-8">
                <Link href={`/tags/${tag.name}`}>
                  <Badge
                    radius="sm"
                    size="xl"
                    color={theme.colorScheme === "dark" ? "gray" : "dark"}
                    variant={
                      theme.colorScheme === "dark" ? "outline" : "filled"
                    }
                    className={classes.badge}
                  >
                    {tag.name}→
                  </Badge>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div>No tags found.</div>
        )}
      </Container>
    </MainLayout>
  );
}
