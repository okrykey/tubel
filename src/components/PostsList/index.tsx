import { Loader, SimpleGrid, Tabs } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";
import { useState } from "react";
import { BiBookOpen } from "react-icons/bi";
import { api } from "~/utils/api";
import { LoginModal } from "../LoginModal";
import Post from "../Post";

type Post = {
  id: string;
  title: string;
  content: string;
};

export const PostsList = () => {
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const postGetAll = api.post.all.useInfiniteQuery({});
  const getPostsByCategories = (categoryNames: string[]) => {
    return api.post.getByCategories.useInfiniteQuery({
      categoryNames,
    });
  };

  const allPostsQuery = getPostsByCategories([
    "Programming",
    "English",
    "Culture",
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
          <Tabs.Tab icon={<IconBrandYoutube size="0.8rem" />} value="1">
            プログラミング
          </Tabs.Tab>
          <Tabs.Tab icon={<BiBookOpen size="0.8rem" />} value="2" color="blue">
            英語
          </Tabs.Tab>

          <Tabs.Tab icon={<BiBookOpen size="0.8rem" />} value="3" color="grape">
            カルチャー
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="1" pt="md">
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
            {renderPosts("Programming")}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="2" pt="md">
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
            {renderPosts("English")}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value="3" pt="md">
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
            {renderPosts("Culture")}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
      {currentTab === null && (
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
          {postGetAll.isSuccess &&
            postGetAll.data?.pages
              .flatMap((page) => page.posts)
              .map((post) => <Post {...post} key={post.id} />)}
        </SimpleGrid>
      )}
    </>
  );
};
