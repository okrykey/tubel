import {
  Badge,
  Container,
  SimpleGrid,
  Center,
  useMantineTheme,
  Text,
  Divider,
  Loader,
  Button,
} from "@mantine/core";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetStaticPaths, type GetStaticPropsContext } from "next";
import type { InferGetStaticPropsType } from "next";
import Post from "~/components/Post";
import MainLayout from "~/layouts/Mainlayout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const tagColors: Record<string, string> = {
  motivation: "blue",
  youtube: "pink",
  cs: "cyan",
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ tag: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
  });
  const tag = context.params?.tag as string;

  await helpers.post.getByTag.prefetchInfinite({ tagName: tag });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      tag,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await prisma.tag.findMany({ select: { name: true } });
  const paths = tags.map((tag) => ({ params: { tag: tag.name } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default function TagPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const theme = useMantineTheme();
  const { tag } = props;

  const getPostsByTag = (tagName: string) => {
    return api.post.getByTag.useInfiniteQuery(
      {
        tagName: tagName,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  };

  const tagPostsQuery = getPostsByTag(tag);

  const renderPosts = (tagName: string) => {
    if (!tagName) {
      return <p>タグを取得中...</p>;
    }

    if (tagPostsQuery.isError) {
      return <p>記事の取得に失敗しました。</p>;
    }

    if (tagPostsQuery.isSuccess) {
      return tagPostsQuery.data?.pages.flatMap((page) =>
        page.TaggedPosts?.map((post) => <Post {...post} key={post.id} />)
      );
    }
  };

  return (
    <MainLayout>
      <Container
        size="lg"
        p="md"
        className="flex h-screen w-full flex-col py-10"
      >
        {tagPostsQuery.isSuccess && (
          <>
            <Center>
              <Badge
                size="xl"
                color={tagColors[tag.toLowerCase()]}
                variant={theme.colorScheme === "dark" ? "light" : "outline"}
              >
                {tag} タグがついた投稿
              </Badge>
            </Center>
            <Divider mt="xl"></Divider>
          </>
        )}

        {tagPostsQuery.isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : tagPostsQuery.isSuccess &&
          tagPostsQuery.data?.pages.some(
            (page) => page.TaggedPosts?.length > 0
          ) ? (
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
            {renderPosts(tag)}
          </SimpleGrid>
        ) : (
          <Center>
            <Text className="pt-8 text-center">
              現在このタグの記事は存在しません。
            </Text>
          </Center>
        )}

        {tagPostsQuery.hasNextPage && (
          <Center>
            <Button
              onClick={() => void tagPostsQuery.fetchNextPage()}
              disabled={tagPostsQuery.isFetchingNextPage}
              size="xs"
              mt="md"
              radius="md"
            >
              {tagPostsQuery.isFetchingNextPage
                ? "Loading more..."
                : "Load More"}
            </Button>
          </Center>
        )}
      </Container>
    </MainLayout>
  );
}
