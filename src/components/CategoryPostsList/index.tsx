import { Badge, Center, createStyles, SimpleGrid, Tabs } from "@mantine/core";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { api } from "~/utils/api";
import { CategoryList } from "../CategoryList";
import Post from "../Post";

type Post = {
  id: string;
  title: string;
  content: string;
};

const useStyles = createStyles(() => ({}));

export const CategoryPostsList = () => {
  const { theme } = useStyles();
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  const postGetAll = api.post.all.useInfiniteQuery({});
  const getPostsByCategories = (categoryNames: string[]) => {
    return api.post.getByCategories.useInfiniteQuery({
      categoryNames,
    });
  };

  const allPostsQuery = getPostsByCategories([
    "programming",
    "english",
    "culture",
  ]);

  const renderPosts = (categoryName: string) => {
    const categoryPosts = allPostsQuery.data?.pages.flatMap((page) =>
      page.CategorizedPosts
        ? page.CategorizedPosts.filter(
            (post) => post.category && post.category.name === categoryName
          )
        : []
    );

    if (Array.isArray(categoryPosts) && categoryPosts.length > 0) {
      return categoryPosts.map((post) => <Post {...post} key={post.id} />);
    }

    return <p>現在このカテゴリの記事は存在しません。</p>;
  };
  return (
    <>
      <Tabs color="teal" value={currentTab} onTabChange={setCurrentTab}>
        <Tabs.List>
          <Tabs.Tab value="1">プログラミング</Tabs.Tab>

          <Tabs.Tab value="2" color="blue">
            英語
          </Tabs.Tab>

          <Tabs.Tab value="3" color="grape">
            カルチャー
          </Tabs.Tab>
          <Tabs.Tab ml="auto" value="4" color="black">
            <BsThreeDots />
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="1" pt="md" className="max-w-5xl">
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            mt={24}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
            ]}
          >
            {renderPosts("programming")}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="2" pt="md" className="max-w-5xl">
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            mt={24}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
            ]}
          >
            {renderPosts("english")}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value="3" pt="md" className="max-w-5xl">
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            mt={24}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
            ]}
          >
            {renderPosts("culture")}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value="4" pt="xl" className="max-w-5xl">
          <Center>
            <Badge
              component="h2"
              variant="filled"
              radius="sm"
              color={theme.colorScheme === "dark" ? "blue" : "dark"}
              size="lg"
              className="text-center"
            >
              すべてのカテゴリ
            </Badge>
          </Center>
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            mt={24}
            className="mx-4 md:mx-0"
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
            ]}
          >
            <CategoryList></CategoryList>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
      {currentTab === null && (
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
      )}
    </>
  );
};
