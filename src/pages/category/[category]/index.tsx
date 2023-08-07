import { Badge, Center, Container, Loader, SimpleGrid } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import Post from "~/components/Post";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

const getPostsByCategory = (categoryNames: string[]) => {
  return api.post.getByCategories.useInfiniteQuery({
    categoryNames: categoryNames,
  });
};

const CategoryPostPage = () => {
  const router = useRouter();
  const category = Array.isArray(router.query.category)
    ? router.query.category[0]
    : router.query.category || "";

  if (!category) {
    return <p>カテゴリが正しく指定されていません。</p>;
  }
  const categoryPostsQuery = getPostsByCategory([category]);

  const renderPosts = () => {
    if (categoryPostsQuery.isLoading) {
      return (
        <Center>
          <Loader color="indigo" />
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

    return <p>現在このカテゴリの記事は存在しません。</p>;
  };

  return (
    <MainLayout>
      <Container size="lg" p="md" className="flex h-full w-full flex-col py-10">
        {categoryPostsQuery.isSuccess && (
          <Center>
            <Badge component="h1" size="xl" px="xl" color="gray">
              {category}
            </Badge>
          </Center>
        )}

        {renderPosts()}
      </Container>
    </MainLayout>
  );
};

export default CategoryPostPage;
