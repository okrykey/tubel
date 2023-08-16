import {
  Badge,
  Center,
  createStyles,
  SimpleGrid,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAtom, IconBook, IconMovie } from "@tabler/icons-react";
import Link from "next/link";
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

export const CategoryPostsList = () => {
  const theme = useMantineTheme();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const isMdUp = useMediaQuery("(min-width: 768px)");

  const postGetAll = api.post.all.useInfiniteQuery({});
  const getPostsByCategories = (categoryNames: string[]) => {
    return api.post.getByCategories.useInfiniteQuery({
      categoryNames,
    });
  };

  const allPostsQuery = getPostsByCategories(["movie", "english", "science"]);

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

    return (
      <Text color="dimmed" className="text-center">
        現在このカテゴリの記事は存在しません。
      </Text>
    );
  };
  return (
    <>
      <Tabs color="teal" value={currentTab} onTabChange={setCurrentTab}>
        <Tabs.List grow>
          <Tabs.Tab value="1" color="green" icon={<IconMovie size="1rem" />}>
            Movie
          </Tabs.Tab>

          <Tabs.Tab value="2" color="yellow" icon={<IconBook size="1rem" />}>
            English
          </Tabs.Tab>

          <Tabs.Tab value="3" color="blue" icon={<IconAtom size="1rem" />}>
            Science
          </Tabs.Tab>
          <Tabs.Tab ml="auto" value="4" color="black">
            {isMdUp ? "All" : <BsThreeDots />}
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
            {renderPosts("movie")}
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
            {renderPosts("science")}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value="4" className="max-w-5xl pt-10">
          <Center>
            <Link href="/category">
              <Badge
                variant="filled"
                radius="sm"
                color={theme.colorScheme === "dark" ? "teal" : "dark"}
                size="lg"
              >
                すべてのカテゴリ
              </Badge>
            </Link>
          </Center>
          <SimpleGrid
            cols={3}
            spacing="xl"
            verticalSpacing="xl"
            mt={24}
            className="mx-2 md:mx-0"
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
