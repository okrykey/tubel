import { Container } from "@mantine/core";
import type { InferGetStaticPropsType, NextPage } from "next";
import { Hero } from "~/components/Hero";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import MainLayout from "~/layouts/Mainlayout";
import { CategoryPosts } from "~/components/CategoryPosts";
import { notifications } from "@mantine/notifications";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;

const Home: NextPage<HomeProps> = (props) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.query.login === "success") {
      notifications.show({
        icon: <AiOutlineCheckCircle />,
        color: "indigo",
        autoClose: 3000,
        message: "ログインしました!",
      });
      void router.replace(router.pathname);
    }
  }, [status, router.query, router.pathname, router]);

  return (
    <>
      <MainLayout>
        <Container size="lg" p="md" className="flex h-full w-full flex-col">
          <Hero />
          <CategoryPosts
            initialDataAllPosts={props.initialDataAllPosts}
            initialDataByCategories={props.initialDataByCategories}
          />
        </Container>
      </MainLayout>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
  });

  const initialDataAllPosts = await helpers.post.all.fetchInfinite({});
  const initialDataByCategories =
    await helpers.post.getByCategories.fetchInfinite({
      categoryNames: ["movie", "english", "science"],
    });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      initialDataAllPosts,
      initialDataByCategories,
    },
  };
}
