import { ScrollArea, SimpleGrid, Tabs } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";
import { useState } from "react";
import { BiBookOpen } from "react-icons/bi";
import { api } from "~/utils/api";
import Post from "../Post";

type Post = {
  id: string;
  title: string;
  content: string;
};

type Category = {
  id: string;
  name: string;
  posts: Post[];
};

export const PostsList = () => {
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const postGetAll = api.post.all.useInfiniteQuery({});
  const getPostsByCategory = api.post.getByCategory.useInfiniteQuery({});

  const ProgrammingCategory = getPostsByCategory.data?.pages
    .flatMap((page) => page.categories)
    .filter((category: Category) => category.name === "Programming");

  const EnglishCategory = getPostsByCategory.data?.pages
    .flatMap((page) => page.categories)
    .filter((category: Category) => category.name === "English");

  const CultureCategory = getPostsByCategory.data?.pages
    .flatMap((page) => page.categories)
    .filter((category: Category) => category.name === "Culture");

  return (
    <>
      <Tabs
        color="teal"
        defaultValue="first"
        value={currentTab}
        onTabChange={setCurrentTab}
      >
        <Tabs.List>
          <Tabs.Tab value="1">すべて</Tabs.Tab>
          <Tabs.Tab icon={<IconBrandYoutube size="0.8rem" />} value="2">
            プログラミング
          </Tabs.Tab>
          <Tabs.Tab icon={<BiBookOpen size="0.8rem" />} value="3" color="blue">
            英語
          </Tabs.Tab>
          <Tabs.Tab value="4" color="grape">
            カルチャー
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="1" pt="xs">
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
        </Tabs.Panel>
        <Tabs.Panel value="2" pt="xs">
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
            {getPostsByCategory.isSuccess &&
            ProgrammingCategory &&
            ProgrammingCategory.length > 0 ? (
              ProgrammingCategory.map((category) =>
                category.posts.map((post) => <Post {...post} key={post.id} />)
              )
            ) : (
              <p>現在このカテゴリの記事は存在しません。</p>
            )}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="3" pt="xs">
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
            {getPostsByCategory.isSuccess &&
            EnglishCategory &&
            EnglishCategory.length > 0 ? (
              EnglishCategory.map((category) =>
                category.posts.map((post) => <Post {...post} key={post.id} />)
              )
            ) : (
              <p>現在このカテゴリの記事は存在しません。</p>
            )}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value="4" pt="xs">
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
            {getPostsByCategory.isSuccess &&
            CultureCategory &&
            CultureCategory.length > 0 ? (
              CultureCategory.map((category) =>
                category.posts.map((post) => <Post {...post} key={post.id} />)
              )
            ) : (
              <p>現在このカテゴリの記事は存在しません。</p>
            )}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
      {currentTab === null && (
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
      )}
    </>
  );
};
