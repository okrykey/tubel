import type { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { Paper, Title, Text, Container, Button, Image } from "@mantine/core";
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Container size={420} my={60}>
        <Paper withBorder shadow="md" p={30} mt={120} radius="md">
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
            <Text color="dimmed" size="sm" align="center" my={8}>
              <Link href="/">トップページに戻る</Link>
            </Text>
            <Image
              maw={240}
              mx="auto"
              radius="md"
              src="/images/signin-icon.png"
              alt="Random image"
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
