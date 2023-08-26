import type { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { Paper, Title, Text, Container, Button } from "@mantine/core";
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Container className="my-40 h-full w-full" size={420}>
        <Paper withBorder shadow="md" p={40} radius="md">
          <div className="mx-auto max-w-3xl">
            <Title
              align="center"
              sx={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily || "sans-serif"}`,
                fontWeight: 900,
              })}
            >
              LOGIN / SIGNIN
            </Title>
            <Text
              className="hover:underline"
              color="dimmed"
              size="sm"
              align="center"
              my={8}
            >
              <Link href="/">トップページに戻る</Link>
            </Text>
            <Image
              width={240}
              height={240}
              src="/images/signin-icon.png"
              alt="Random image"
              className="mx-auto"
            />
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button
                  leftIcon={<AiOutlineGoogle size="1.5rem" />}
                  variant="filled"
                  radius="xl"
                  color="teal"
                  size="md"
                  fullWidth
                  my="xl"
                  onClick={() =>
                    void signIn(provider.id, {
                      callbackUrl: `/?login=success`,
                    })
                  }
                >
                  {provider.name}でサインイン
                </Button>
              </div>
            ))}
          </div>
        </Paper>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
