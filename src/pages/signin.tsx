import type { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import {
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Image,
} from "@mantine/core";
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
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Link href="/">
            <Anchor size="sm" component="button">
              Return to top page
            </Anchor>
          </Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <div className="mx-auto max-w-3xl">
            <div className="flexjustify-center"></div>
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
                  variant="outline"
                  color="indigo"
                  size="md"
                  fullWidth
                  mt="xl"
                  onClick={() =>
                    void signIn(provider.id, {
                      callbackUrl: "/",
                    })
                  }
                >
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
          </div>
        </Paper>
      </Container>
    </>
  );
}
