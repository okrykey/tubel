import { Container, Loader, SimpleGrid } from "@mantine/core";
import { useRouter } from "next/router";
import Post from "~/components/Post";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

export default function TagPage() {
  const router = useRouter();
  let { tag } = router.query;

  tag = typeof tag === "string" ? tag : "";

  const getPostsByTag = (tagName: string) => {
    return api.post.getByTag.useInfiniteQuery({
      tagName: tagName,
    });
  };

  const tagPostsQuery = getPostsByTag(tag);

  const renderPosts = (tagName: string) => {
    if (!tagName) {
      return <p>タグを取得中...</p>;
    }

    if (tagPostsQuery.isLoading) {
      return <Loader variant="bars" />;
    }

    if (tagPostsQuery.isError) {
      return <p>記事の取得に失敗しました。</p>;
    }

    return tagPostsQuery.isSuccess &&
      tagPostsQuery.data?.pages.some((page) => page.TaggedPosts?.length > 0) ? (
      tagPostsQuery.data?.pages.flatMap((page) =>
        page.TaggedPosts?.map((post) => <Post {...post} key={post.id} />)
      )
    ) : (
      <p>現在このタグの記事は存在しません。</p>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <MainLayout>
        <Container size="lg" py="xl">
          {tagPostsQuery.isSuccess && <h1>「{tag}」の記事一覧</h1>}
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
            {renderPosts(tag)}
          </SimpleGrid>
        </Container>
      </MainLayout>
    </div>
  );
}
