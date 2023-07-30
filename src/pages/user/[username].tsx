import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import {
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  rem,
  Container,
  Divider,
  Center,
} from "@mantine/core";
import { BiEdit } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { HeaderTabs } from "~/components/Header";
import { PostsStack } from "~/components/PostStack";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

export function UserProfilePage() {
  const { classes, theme } = useStyles();
  const router = useRouter();
  const { data: session } = useSession();

  const userProfile = api.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const userPosts = api.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const isUserMatch = session && session.user?.id === userProfile.data?.id;

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />
        <Container className="flex  w-full flex-col py-10">
          <Card withBorder radius="md" className={classes.card}>
            <Card.Section sx={{ height: 140 }} />

            {userProfile.data?.image && (
              <Avatar
                src={userProfile.data?.image}
                size={80}
                radius={80}
                mx="auto"
                mt={-30}
                className={classes.avatar}
              />
            )}

            <Text ta="center" fz="xl" fw={600} m="sm" className="">
              {userProfile.data?.name}
            </Text>
            <Text ta="center" fz="sm" c="dimmed">
              @{userProfile.data?.username}
            </Text>
            <Group mt="md" position="center" spacing={30}>
              <Text ta="center" fz="lg" fw={500}>
                {userProfile.data?._count.post ?? 0} 投稿
              </Text>
              <Text ta="center" fz="lg" fw={500}>
                {userProfile.data?._count.comment ?? 0} コメント
              </Text>
            </Group>
            {isUserMatch && (
              <Center>
                <Button
                  leftIcon={<BiEdit />}
                  radius="md"
                  mt="lg"
                  size="md"
                  color={theme.colorScheme === "dark" ? undefined : "dark"}
                  variant="outline"
                  onClick={() => router.push("/settings/profile")}
                >
                  プロフィール編集する
                </Button>
              </Center>
            )}
            <Divider className="my-8" />

            {userPosts.isSuccess &&
            userPosts.data &&
            userPosts.data.post?.length > 0 ? (
              <PostsStack posts={userPosts.data.post} />
            ) : (
              <Center>
                <Text ta="center" fz="lg" fw={500}>
                  まだ投稿はありません
                </Text>
              </Center>
            )}
          </Card>
        </Container>
      </div>
    </>
  );
}

export default UserProfilePage;
