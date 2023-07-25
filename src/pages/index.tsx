import { Container, SimpleGrid } from "@mantine/core";
import { NextPage } from "next";

import { InputWithButton } from "~/components/Mantine UI/InputWithButton";
import { Hero } from "~/components/Mantine UI/Hero";
import PostFormModal from "~/components/PostFormModal";
import { HeaderTabs } from "~/components/Header";
import { PostsList } from "~/components/PostsList";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />
        <Container size="lg" py="xl">
          <PostFormModal></PostFormModal>
          <InputWithButton className="w-full" />
          <Hero />
          <PostsList />
        </Container>
      </div>
    </>
  );
};

export default Home;
