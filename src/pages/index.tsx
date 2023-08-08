import { Container } from "@mantine/core";
import { NextPage } from "next";
import { Hero } from "~/components/Hero";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import MainLayout from "~/layouts/Mainlayout";
import { CategoryPostsList } from "~/components/CategoryPostsList";
import { notifications } from "@mantine/notifications";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.query.login === "success") {
      notifications.show({
        color: "indigo",
        autoClose: 5000,
        title: "ログイン",
        message: "ログインしました。",
      });
      router.replace(router.pathname);
    }
  }, [status, router.query, router.pathname]);

  return (
    <>
      <MainLayout>
        <Container size="lg" p="md">
          <Hero />
          <CategoryPostsList />
        </Container>
      </MainLayout>
    </>
  );
};

export default Home;
