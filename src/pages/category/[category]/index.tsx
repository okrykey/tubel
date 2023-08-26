import {
  Badge,
  Center,
  Container,
  Divider,
  Loader,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAtom,
  IconBook,
  IconBrush,
  IconGlobe,
  IconMovie,
  IconShirt,
  IconUsers,
} from "@tabler/icons-react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetStaticPaths, type GetStaticPropsContext } from "next";
import type { InferGetStaticPropsType } from "next";
import React from "react";
import Post from "~/components/Post";
import MainLayout from "~/layouts/Mainlayout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const categoryData = [
  {
    id: 1,
    icon: IconMovie,
    title: "映画",
    value: "movie",
    description:
      "制作の裏話から最新情報まで。映画の魅力や背後にあるストーリーを探求しよう",
  },

  {
    id: 2,
    icon: IconBook,
    title: "英語",
    value: "english",
    description: "見るだけで世界中へ。場所を問わずグローバル化しよう",
  },
  {
    id: 3,
    icon: IconAtom,
    title: "科学",
    value: "science",
    description: "自然科学からコンピュータ科学まで、幅広い知識を学ぼう",
  },
  {
    id: 4,
    icon: IconUsers,
    title: "社会",
    value: "society",
    description: "社会に関する興味深いトピックや議論を探索しよう",
  },
  {
    id: 5,
    icon: IconBrush,
    title: "芸術",
    value: "art",
    description: "美術、音楽、舞台など、芸術の多様な形を楽しもう",
  },
  {
    id: 6,
    icon: IconGlobe,
    title: "カルチャー",
    value: "culture",
    description:
      "世界中の文化が集まる。動画から多様な文化と世界の広さを感じよう",
  },
  {
    id: 7,
    icon: IconShirt,
    title: "ファッション",
    value: "fashion",
    description:
      "著名人のファッションや最新の流行まで。最新のトレンドやファッションの歴史を学ぼう",
  },
];

export async function getStaticProps(
  context: GetStaticPropsContext<{ category: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
  });
  const category = context.params?.category as string;

  await helpers.post.getByCategories.prefetch({ categoryNames: [category] });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      category,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await prisma.category.findMany({ select: { name: true } });
  const paths = categories.map((category) => ({
    params: { category: category.name },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

const CategoryPostPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const theme = useMantineTheme();
  const { category } = props;

  const getPostsByCategory = (categoryNames: string[]) => {
    return api.post.getByCategories.useInfiniteQuery({
      categoryNames: categoryNames,
    });
  };

  const getCategoryDetails = (categoryValue: string | undefined) => {
    const found = categoryData.find((item) => item.value === categoryValue);
    return {
      icon: found ? found.icon : null,
      description: found ? found.description : "",
    };
  };

  const { icon: CategoryIcon, description: categoryDescription } =
    getCategoryDetails(category);

  if (!category) {
    return <p>カテゴリが正しく指定されていません。</p>;
  }
  const categoryPostsQuery = getPostsByCategory([category]);

  const renderPosts = () => {
    if (categoryPostsQuery.isLoading) {
      return (
        <Center>
          <Loader />
        </Center>
      );
    }

    if (categoryPostsQuery.isError) {
      return <p>記事の取得に失敗しました。</p>;
    }

    if (
      categoryPostsQuery.isSuccess &&
      categoryPostsQuery.data?.pages.some(
        (page) => page.CategorizedPosts?.length > 0
      )
    ) {
      return (
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
          {categoryPostsQuery.data?.pages.flatMap((page) =>
            page.CategorizedPosts?.map((post) => (
              <Post {...post} key={post.id} />
            ))
          )}
        </SimpleGrid>
      );
    }

    return (
      <Text
        component="h2"
        color={theme.colorScheme === "dark" ? "white" : "dark"}
        className="pt-10 text-center"
      >
        現在このカテゴリの記事はありません。
      </Text>
    );
  };

  return (
    <MainLayout>
      <Container size="lg" p="md" className="flex h-full w-full flex-col py-10">
        {categoryPostsQuery.isSuccess && (
          <>
            <Center className="md:pt-6">
              <Badge
                component="h1"
                size="xl"
                px="lg"
                radius="sm"
                variant="filled"
                color={theme.colorScheme === "dark" ? "teal" : "dark"}
                leftSection={
                  CategoryIcon ? <CategoryIcon size="1.2rem" /> : null
                }
              >
                {category}
              </Badge>
            </Center>
            <Text color="dimmed" size="sm" className="pt-4 text-center">
              {categoryDescription}
            </Text>
            <Divider mt="xl" />
          </>
        )}

        {renderPosts()}
      </Container>
    </MainLayout>
  );
};

export default CategoryPostPage;
