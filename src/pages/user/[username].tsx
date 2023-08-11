import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
  Loader,
  SimpleGrid,
} from "@mantine/core";
import { BiEdit } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { HeaderTabs } from "~/components/Header";
import { BookmarkPost } from "~/components/BookmarkPost";
import { modalOpenAtom } from "../state/Atoms";
import { useAtom } from "jotai";
import { UserPostsList } from "~/components/UserPostsList";
import PostFormModal from "~/components/PostFormModal";

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
  const [_, setIsOpen] = useAtom(modalOpenAtom);

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

  const getBookmarkList = api.user.getUserBookmarkList.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const isUserMatch = session && session.user?.id === userProfile.data?.id;

  const isLoading =
    userProfile.isLoading || userPosts.isLoading || getBookmarkList.isLoading;
  const isError =
    userProfile.isError || userPosts.isError || getBookmarkList.isError;

  useEffect(() => {
    if (userProfile.isSuccess && !isUserMatch) {
      void router.push("/");
    }
  }, [userProfile.isSuccess, isUserMatch, router]);

  const handleProfileEdit = async () => {
    await router.push("/settings/profile");
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />
        <PostFormModal />
        <Container className="flex  w-full flex-col py-10">
          <Card withBorder radius="md" className={classes.card}>
            <Card.Section sx={{ height: 100 }} />

            {isLoading ? (
              <Center>
                <Loader color="indigo" />
              </Center>
            ) : isError ? (
              <Center>
                <Text ta="center" fz="lg" fw={500}>
                  データの読み込みに問題が発生しました。
                </Text>
              </Center>
            ) : userProfile.isSuccess ? (
              <>
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
                      color={theme.colorScheme === "dark" ? "teal" : "dark"}
                      onClick={handleProfileEdit}
                    >
                      プロフィールを編集する
                    </Button>
                  </Center>
                )}
              </>
            ) : (
              <Center>
                <Text ta="center" fz="lg" fw={500}>
                  ユーザープロフィールが見つかりません
                </Text>
              </Center>
            )}

            <Divider className="mb-4 mt-8" label="投稿一覧" />

            {userPosts.isSuccess &&
            userPosts.data &&
            userPosts.data?.post?.length > 0 ? (
              <UserPostsList posts={userPosts.data.post} />
            ) : userPosts.isSuccess ? (
              <Center className="flex flex-col space-y-4">
                <Text ta="center" fz="md" color="dimmed" fw={400}>
                  まだ投稿はありません
                </Text>
                <Button
                  variant="subtle"
                  size="md"
                  onClick={() => setIsOpen(true)}
                >
                  記事を投稿する
                </Button>
              </Center>
            ) : (
              <></>
            )}

            <Divider className="my-4" label="お気に入り一覧" />

            {getBookmarkList.isSuccess ? (
              getBookmarkList.data && getBookmarkList.data.length > 0 ? (
                <SimpleGrid
                  cols={3}
                  spacing="xl"
                  verticalSpacing="xl"
                  mt={24}
                  breakpoints={[
                    { maxWidth: "sm", cols: 1 },
                    { maxWidth: "md", cols: 2 },
                  ]}
                >
                  {getBookmarkList.data.map((postData) => (
                    <BookmarkPost
                      key={postData.id}
                      post={{
                        ...postData,
                        category: postData.category
                          ? postData.category.name
                          : "",
                      }}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Center>
                  <Text ta="center" fz="md" color="dimmed" fw={400}>
                    まだお気に入りした投稿はありません
                  </Text>
                </Center>
              )
            ) : (
              <></>
            )}

            <Card.Section sx={{ height: 32 }} />
          </Card>
        </Container>
      </div>
    </>
  );
}

export default UserProfilePage;
