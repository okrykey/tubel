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
  Textarea,
  Avatar,
  Card,
  FileButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "~/layouts/Mainlayout";
import { api } from "~/utils/api";

type ProfileFormType = {
  userId: string;
  name: string;
};

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("md")]: {
      flexDirection: "column-reverse",
    },
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
      paddingTop: "80px",
      paddingBottom: "80px",
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
  const { classes } = useStyles();
  const trpc = api.useContext();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<ProfileFormType>({
    initialValues: {
      userId: session?.user.id || "",
      name: "",
    },
    validate: {
      name: (value) =>
        value.length < 1 || value.length > 10
          ? "※名前は1文字以上10文字以下で入力してください"
          : null,
    },
  });

  const updateName = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("プロフィールを編集しました！");

      form.reset();
    },
    onSettled: async () => {
      await trpc.user.getUserProfile.invalidate();
    },
  });

  return (
    <MainLayout>
      <Container className="h-full w-full px-24 py-20">
        <Title className={classes.title} align="center">
          ユーザー編集
        </Title>
        <div className="pt-10">
          <form
            onSubmit={form.onSubmit((data: ProfileFormType) => {
              updateName.mutate(data);
            })}
          >
            <Card withBorder padding="xl" radius="md" className={classes.card}>
              <Card.Section sx={{ height: 60 }} />

              {file ? (
                <Avatar
                  src={URL.createObjectURL(file)}
                  size={80}
                  radius={80}
                  mx="auto"
                  mt={-30}
                  className={classes.avatar}
                />
              ) : (
                <Avatar
                  src=""
                  size={80}
                  radius={80}
                  mx="auto"
                  mt={-30}
                  className={classes.avatar}
                />
              )}

              <Center className="pt-4">
                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                  {(props) => <Button {...props}>画像を変更する</Button>}
                </FileButton>
              </Center>

              <TextInput
                label="ユーザーネーム"
                placeholder="表示名を入力してください"
                className="pt-8"
                id="name"
                {...form.getInputProps("name")}
              />
              <Textarea
                label="自己紹介"
                placeholder="よろしくお願いします"
                className="pt-8"
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
                  variant="outline"
                  type="submit"
                >
                  変更する
                </Button>
              </Group>
            </Card>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
}
