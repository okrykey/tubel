import {
  createStyles,
  Title,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
  Avatar,
  Card,
  FileButton,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

type ProfileFormType = {
  name: string;
  image?: string;
  imageAsDataUrl?: string;
  file?: File;
};

type PayloadType = {
  name: string;
  username: string;
  imageAsDataUrl?: string;
};

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily || "sans-serif"}`,
    paddingTop: "32px",
    paddingBottom: "32px",
  },

  controls: {
    [theme.fn.smallerThan("md")]: {
      flexDirection: "column-reverse",
    },
    paddingTop: "16px",
  },

  control: {
    [theme.fn.smallerThan("md")]: {
      width: "100%",
      textAlign: "center",
    },
  },

  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    [theme.fn.smallerThan("md")]: {
      paddingTop: "40px",
      paddingBottom: "40px",
    },
  },

  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

export default function EditUserProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const { classes, theme } = useStyles();
  const trpc = api.useContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectImage, setObjectImage] = useState("");

  const handleChangeImage = (file: File | null) => {
    if (file) {
      if (file.size > 1.5 * 1000000) {
        return notifications.show({
          color: "red",
          autoClose: 5000,
          title: "エラー",
          message: "1MBより大きい画像は使用できません。",
        });
      }
      setObjectImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const userId = session?.user?.id;
  const getUser = api.user.getUserAvatar.useQuery(
    {
      userId: userId || "",
    },
    {
      enabled: !!userId,
    }
  );

  const form = useForm<ProfileFormType>({
    initialValues: {
      name: getUser.data?.name || "",
    },
    validate: {
      name: (value) =>
        value.length < 1 || value.length > 10
          ? "※名前は1文字以上10文字以下で入力してください"
          : null,
    },
  });

  const updateAvatar = api.user.uploadAvatar.useMutation({
    onMutate: () => {
      void router.push(`/user/${getUser.data?.username ?? "/"}`);
    },
    onError: () => {
      notifications.show({
        color: "red",
        autoClose: 3000,
        message: "エラーが発生しました。もう一度やり直してください。",
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "indigo",
        autoClose: 3000,
        message: "プロフィールを変更しました！",
      });
      form.reset();
    },
    onSettled: async () => {
      await trpc.user.getUserProfile.invalidate();
    },
  });

  return (
    <MainLayout>
      <Container size="lg" p="md" className="h-full w-full  max-w-3xl">
        <Title className={classes.title} align="center">
          ユーザー編集
        </Title>
        <div>
          <form
            onSubmit={form.onSubmit((data: ProfileFormType) => {
              const updateUser = (imageDataUrl?: string) => {
                const payload: PayloadType = {
                  name: data.name,
                  username: getUser.data?.username || "",
                };

                if (imageDataUrl) {
                  payload.imageAsDataUrl = imageDataUrl;
                }

                updateAvatar.mutate(payload);
              };
              if (selectedFile) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(selectedFile);
                fileReader.onloadend = () => {
                  if (typeof fileReader.result === "string") {
                    updateUser(fileReader.result);
                  }
                };
              } else {
                updateUser();
              }
            })}
          >
            <Card withBorder padding="xl" radius="md" className={classes.card}>
              <Card.Section sx={{ height: 60 }} />

              {objectImage ? (
                <Avatar
                  src={objectImage}
                  size={80}
                  radius={80}
                  mx="auto"
                  mt={-30}
                  className={classes.avatar}
                />
              ) : (
                <Avatar
                  src={getUser.data?.image}
                  size={80}
                  radius={80}
                  mx="auto"
                  mt={-30}
                  className={classes.avatar}
                />
              )}

              <Center className="pt-1">
                <FileButton
                  onChange={handleChangeImage}
                  accept="image/png,image/jpeg"
                >
                  {(props) => (
                    <Button
                      variant="subtle"
                      color={theme.colorScheme === "dark" ? "gray" : "dark"}
                      {...props}
                    >
                      画像を変更する
                    </Button>
                  )}
                </FileButton>
              </Center>

              <TextInput
                label="ユーザーネーム"
                placeholder="表示名を入力してください"
                className="pt-8"
                id="name"
                {...form.getInputProps("name")}
              />

              <Group position="apart" mt="lg" className={classes.controls}>
                <Anchor color="dimmed" size="sm" className={classes.control}>
                  <Center inline>
                    <IconArrowLeft size={rem(12)} stroke={1.5} />

                    <Box ml={5} onClick={() => router.back()}>
                      プロフィールページに戻る
                    </Box>
                  </Center>
                </Anchor>

                <Button
                  className={classes.control}
                  color={theme.colorScheme === "dark" ? "teal" : "dark"}
                  type="submit"
                >
                  プロフィールを更新する
                </Button>
              </Group>
              <Text color="dimmed" size="xs" className="pt-4 text-right">
                ※画像が反映されるまで時間がかかるおそれがあります。
              </Text>
              <Card.Section sx={{ height: 32 }} />
            </Card>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
}
