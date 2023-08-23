import {
  Badge,
  Center,
  SimpleGrid,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconAtom, IconBook, IconMovie } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { api } from "~/utils/api";
import { CategoryList } from "../CategoryList";
import Post from "../Post";
import type { PostProps } from "../Post";
import { useResponsive } from "~/utils/useResponsive";

type InitialDataAllPostsProps = {
  posts: PostProps[];
};
type InitialDataByCategoriesProps = {
  CategorizedPosts: PostProps[];
};

export const CategoryPostsList = ({
  initialDataAllPosts,
  initialDataByCategories,
}: {
  initialDataAllPosts: InitialDataAllPostsProps;
  initialDataByCategories: InitialDataByCategoriesProps;
}) => {
  const theme = useMantineTheme();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const isMobile = useResponsive();

  const postGetAll = api.post.all.useInfiniteQuery(
    {
      initialData: {
        pages: [initialDataAllPosts],
        pageParams: [{ cursor: null }],
      },
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );
  const getPostsByCategories = (categoryNames: string[]) => {
    return api.post.getByCategories.useInfiniteQuery(
      {
        categoryNames,
      },
      {
        ...{
          initialData: {
            pages: [initialDataByCategories],
            pageParams: [{ cursor: null }],
          },
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );
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
            MOVIE
          </Tabs.Tab>

          <Tabs.Tab value="2" color="yellow" icon={<IconBook size="1rem" />}>
            ENGLISH
          </Tabs.Tab>

          <Tabs.Tab value="3" color="blue" icon={<IconAtom size="1rem" />}>
            SCIENCE
          </Tabs.Tab>
          <Tabs.Tab ml="auto" value="4" color="black">
            {isMobile ? <BsThreeDots /> : "All"}
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
