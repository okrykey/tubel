import { Container } from "@mantine/core";
import { NextPage } from "next";
import { Hero } from "~/components/Hero";
import PostFormModal from "~/components/PostFormModal";
import { HeaderTabs } from "~/components/Header";
import { PostsList } from "~/components/PostsList";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import MainLayout from "~/layouts/Mainlayout";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.query.login === "success") {
      toast.success("ログインしました");
      router.replace(router.pathname);
    }
  }, [status, router.query, router.pathname]);

  return (
    <>
      <MainLayout>
        <Container size="lg" py="xl">
          <PostFormModal />
          <Hero />
          <PostsList />
        </Container>
      </MainLayout>
    </>
  );
};

export default Home;
