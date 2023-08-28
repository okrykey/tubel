import {
  Badge,
  Button,
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
import type { PostPickProps } from "../CategoryList";
import type { PostProps } from "../Post";
import { useResponsive } from "~/utils/useResponsive";
import type { InfiniteData } from "@tanstack/react-query";

type InitialDataAllPostsProps = InfiniteData<{
  posts: PostProps[];
  nextCursor: string | undefined;
}>;

type InitialDataByCategoriesProps = InfiniteData<{
  CategorizedPosts: PostProps[];
  nextCursor: string | undefined;
}>;

const CATEGORIES = [
  {
    value: "1",
    color: "green",
    icon: <IconMovie size="1rem" />,
    name: "movie",
  },
  {
    value: "2",
    color: "yellow",
    icon: <IconBook size="1rem" />,
    name: "english",
  },
  {
    value: "3",
    color: "blue",
    icon: <IconAtom size="1rem" />,
    name: "science",
  },
];

export const CategoryPosts = ({
  initialDataAllPosts,
  initialDataByCategories,
}: {
  initialDataAllPosts: InitialDataAllPostsProps;
  initialDataByCategories: InitialDataByCategoriesProps;
}) => {
  const theme = useMantineTheme();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isMobile = useResponsive();

  const postGetAll = api.post.all.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      initialData: {
        pages: initialDataAllPosts.pages,
        pageParams: initialDataAllPosts.pageParams,
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const getPostsByCategories = (categoryNames: string[]) => {
    return api.post.getByCategories.useInfiniteQuery(
      {
        categoryNames,
        limit: 10,
      },
      {
        initialData: {
          pages: initialDataByCategories.pages,
          pageParams: initialDataByCategories.pageParams,
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  };

  const allPostsQuery = getPostsByCategories(["movie", "english", "science"]);

  const renderPosts = (categoryName: string) => {
    const categoryPosts = (allPostsQuery.data?.pages || [])
      .flatMap((page) => page.CategorizedPosts || [])
      .filter((post) => post.category?.name === categoryName);

    if (categoryPosts.length === 0) {
      return (
        <Text color="dimmed" className="text-center">
          現在このカテゴリの記事は存在しません。
        </Text>
      );
    }

    return (
      <>
        {categoryPosts.map((post) => (
          <Post {...post} key={post.id} />
        ))}
      </>
    );
  };

  const PostGrid = ({ category }: { category: string }) => {
    return (
      <>
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
          {renderPosts(category)}
        </SimpleGrid>
        {allPostsQuery.hasNextPage && (
          <Center>
            <Button
              onClick={() => {
                void postGetAll.fetchNextPage();
              }}
              disabled={allPostsQuery.isFetchingNextPage}
              size="xs"
              mt="md"
              radius="md"
            >
              {allPostsQuery.isFetchingNextPage
                ? "Loading more..."
                : "Load More"}
            </Button>
          </Center>
        )}
      </>
    );
  };

  const extractedPosts: PostPickProps[] =
    postGetAll.data?.pages
      .flatMap((page) => page.posts)
      .map((post) => ({
        title: post.title,
        videoId: post.videoId,
        category: post.category,
      })) || [];

  return (
    <>
      <Tabs color="teal" value={currentTab} onTabChange={setCurrentTab}>
        <Tabs.List grow>
          {CATEGORIES.map((category) => (
            <Tabs.Tab
              key={category.value}
              value={category.value}
              color={category.color}
              icon={category.icon}
            >
              {category.name.toUpperCase()}
            </Tabs.Tab>
          ))}
          <Tabs.Tab ml="auto" value="4" color="black">
            {isMobile ? <BsThreeDots /> : "All"}
          </Tabs.Tab>
        </Tabs.List>
        {CATEGORIES.map((category) => (
          <Tabs.Panel
            key={category.value}
            value={category.value}
            pt="md"
            className="w-full"
          >
            <PostGrid category={category.name} />
          </Tabs.Panel>
        ))}
        <Tabs.Panel value="4" className="w-full pt-10">
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
            <CategoryList posts={extractedPosts} />
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
          {postGetAll.data?.pages
            .flatMap((page) => page.posts)
            .map((post, index) => (
              <div
                className={
                  hasAnimated ? "" : `animate-slideFromTop delay-${index * 100}`
                }
                onAnimationEnd={() => setHasAnimated(true)}
                key={post.id}
              >
                <Post {...post} />
              </div>
            ))}
        </SimpleGrid>
      )}

      {postGetAll.hasNextPage && (
        <Center>
          <Button
            onClick={() => {
              void postGetAll.fetchNextPage();
            }}
            disabled={postGetAll.isFetchingNextPage}
            size="xs"
            mt="md"
            radius="md"
          >
            {postGetAll.isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </Center>
      )}
    </>
  );
};
