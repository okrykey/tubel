import { Button, Container, SimpleGrid, Flex } from "@mantine/core";
import { NextPage } from "next";
import { HeaderTabs } from "~/components/Mantine UI/HeaderTabs";
import { InputWithButton } from "~/components/Mantine UI/InputWithButton";
import { ArticleCard } from "~/components/Mantine UI/ArticleCard";
import { api } from "~/utils/api";
import { Hero } from "~/components/Mantine UI/Hero";
import { TabsList } from "~/components/Mantine UI/TabsList";

const Home: NextPage = () => {
  const postGetAllQuery = api.post.all.useQuery();
  if (postGetAllQuery.isLoading) return null;
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />

        <Container size="lg" py="xl">
          <InputWithButton className="w-full" />
          <Flex
            direction="row"
            gap={{ base: "sm", sm: "lg" }}
            align="center"
            justify={{ base: "center", sm: "flex-end" }}
            py="xl"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Button
                key={i}
                variant="outline"
                color="indigo"
                size="sm"
                className="rounded-3xl px-4 py-2"
              >
                tag{i}
              </Button>
            ))}
          </Flex>
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
            {postGetAllQuery.data?.map((post) => {
              return (
                <ArticleCard
                  id={post.id}
                  image="/images/signin-icon.png"
                  link={`/posts/${post.id}`}
                  title={post.title}
                  description={post.content}
                  author={{
                    name: "Test User",
                    image: "/images/signin-icon.png",
                  }}
                ></ArticleCard>
              );
            })}
          </SimpleGrid>
        </Container>
      </div>
    </>
  );
};

export default Home;
