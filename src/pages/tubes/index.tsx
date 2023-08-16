import { Badge, Center, Container, SimpleGrid } from "@mantine/core";

import Post from "~/components/Post";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

type Post = {
  id: string;
  title: string;
  content: string;
};

export default function TubesPage() {
  const postGetAll = api.post.all.useInfiniteQuery({});

  return (
    <MainLayout>
      <Container size="lg" p="md" className="flex h-full w-full flex-col py-10">
        <Center className="md:pt-6">
          <Badge component="h1" size="xl" px="lg" radius="sm" variant="filled">
            すべての投稿
          </Badge>
        </Center>
        <SimpleGrid
          cols={3}
          spacing="xl"
          verticalSpacing="xl"
          mt={40}
          breakpoints={[
            { maxWidth: "sm", cols: 1 },
            { maxWidth: "md", cols: 2 },
          ]}
        >
          {postGetAll.isSuccess &&
            postGetAll.data?.pages
              .flatMap((page) => page.posts)
              .map((post) => <Post {...post} key={post.id} />)}
        </SimpleGrid>
      </Container>
    </MainLayout>
  );
}
