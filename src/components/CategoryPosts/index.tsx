import {
  Badge,
  Center,
  Loader,
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

type InitialDataAllPostsProps = {
  posts: PostProps[];
};
type InitialDataByCategoriesProps = {
  CategorizedPosts: PostProps[];
};

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
        initialData: {
          pages: [initialDataByCategories],
          pageParams: [{ cursor: null }],
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
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

    return categoryPosts.map((post) => <Post {...post} key={post.id} />);
  };

  const PostGrid = ({ category }: { category: string }) => {
    return (
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
            className="max-w-5xl"
          >
            <PostGrid category={category.name} />
          </Tabs.Panel>
        ))}
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
            <CategoryList posts={extractedPosts} />
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
      {currentTab === null && postGetAll.isLoading && (
        <Center className="mt-10">
          <Loader />
        </Center>
      )}
      {currentTab === null && postGetAll.isSuccess && (
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
            .map((post) => (
              <Post {...post} key={post.id} />
            ))}
        </SimpleGrid>
      )}
    </>
  );
};
