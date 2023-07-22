import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";
import {
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  rem,
  SimpleGrid,
} from "@mantine/core";
import { BiEdit } from "react-icons/bi";
import Post from "~/components/Post";
import { useSession } from "next-auth/react";

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

  const currentUser = useSession();

  const userProfile = api.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const stats = [{ label: "aaa" }, { value: "bbb" }];

  const userPosts = api.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className=" flex h-full w-full max-w-screen-xl flex-col">
          <Card withBorder padding="xl" radius="md" className={classes.card}>
            <Card.Section sx={{ backgroundImage: "", height: 140 }} />

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

            <Text ta="center" fz="lg" fw={500} mt="sm">
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
            <Button
              leftIcon={<BiEdit />}
              fullWidth
              radius="md"
              mt="xl"
              size="md"
              color={theme.colorScheme === "dark" ? undefined : "dark"}
              variant="outline"
            >
              編集する
            </Button>
          </Card>
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
            {userPosts.isSuccess &&
              userPosts.data?.post.map((post) => (
                <Post {...post} key={post.id} />
              ))}
          </SimpleGrid>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfilePage;
