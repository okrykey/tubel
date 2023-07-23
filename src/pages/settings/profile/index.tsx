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
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import MainLayout from "~/layouts/Mainlayout";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
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

export default function ForgotPassword() {
  const router = useRouter();
  const { classes } = useStyles();

  return (
    <MainLayout>
      <Container size="lg" py="xl">
        <Title className={classes.title} align="center" my="lg">
          ユーザー編集
        </Title>
        <Card withBorder padding="xl" radius="md" className={classes.card}>
          <Card.Section sx={{ height: 60 }} />

          <Avatar
            src=""
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
            className={classes.avatar}
          />
          <Center>
            <Button variant="subtle">画像を変更する</Button>
          </Center>

          <TextInput
            label="ユーザーネーム"
            placeholder="表示名を入力してください"
            required
          />
          <Textarea
            label="自己紹介"
            placeholder="よろしくお願いします"
            required
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
            <Button className={classes.control} variant="outline">
              変更する
            </Button>
          </Group>
        </Card>
      </Container>
    </MainLayout>
  );
}
