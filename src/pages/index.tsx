import { Container } from "@mantine/core";
import type { NextPage } from "next";
import { Hero } from "~/components/Hero";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import MainLayout from "~/layouts/Mainlayout";
import { CategoryPostsList } from "~/components/CategoryPostsList";
import { notifications } from "@mantine/notifications";

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.query.login === "success") {
      notifications.show({
        color: "indigo",
        autoClose: 5000,
        title: "Login",
        message: "ログインしました。",
      });
      void router.replace(router.pathname);
    }
  }, [status, router.query, router.pathname, router]);

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
