import { Container, SimpleGrid } from "@mantine/core";
import { NextPage } from "next";

import { InputWithButton } from "~/components/Mantine UI/InputWithButton";
import { api } from "~/utils/api";
import { Hero } from "~/components/Mantine UI/Hero";
import { TabsList } from "~/components/Mantine UI/TabsList";
import PostFormModal from "~/components/PostFormModal";
import Post from "~/components/Post";
import { HeaderTabs } from "~/components/Header";

const Home: NextPage = () => {
  const postGetAll = api.post.all.useInfiniteQuery({});

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />
        <Container size="lg" py="xl">
          <PostFormModal></PostFormModal>
          <InputWithButton className="w-full" />
          <Hero />
          <TabsList />
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            mt={50}
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
      </div>
    </>
  );
};

export default Home;
