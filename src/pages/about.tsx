import {
  createStyles,
  Title,
  Container,
  Accordion,
  rem,
  Text,
  Divider,
} from "@mantine/core";
import MainLayout from "~/layouts/Mainlayout";
import { IconPlus } from "@tabler/icons-react";
import { Features } from "~/components/Features";
import { Footer } from "~/components/Footer";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    minHeight: rem(820),
    backgroundImage: ``,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top left",
    position: "relative",
    color: theme.black,
  },

  title: {
    fontWeight: 800,
    fontSize: rem(50),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily || "sans-serif"}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  description: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[6],
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      fontSize: theme.fontSizes.md,
      textAlign: "left",
    },
  },

  item: {
    borderBottom: 0,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
    overflow: "hidden",
    backgroundColor: theme.colorScheme === "dark" ? theme.black : theme.white,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.gray[6],
  },
}));

const purposeContent =
  "このサービスの目的は、インターネット上での学習を支援することです。インターネット上には山ほど情報がありますが、そこから本当に有益な情報を見つけるのは難しいです。そんな有益な情報と出会いやすく最短経路で学習できる場があればいいなという考えでこのサービスを作成しました。";

const why =
  "共有するコンテンツを「YouTube」に限定している理由は、動画によって学習のハードルが低く、楽しく学ぶことができるためです。YouTube上の有益な動画で効率よく、場所を問わずどこでも気軽に見て学習を進めることができます。";

export default function About() {
  const { classes, theme } = useStyles();
  return (
    <MainLayout>
      <div className={classes.wrapper}>
        <Title className={classes.title}>
          YouTubeでつながる
          <Text
            component="span"
            inherit
            color={theme.colorScheme === "dark" ? "teal" : "indigo"}
          >
            W.L.S.
          </Text>
        </Title>

        <Container py="lg" className="space-y-16">
          <Text size="lg" className={classes.description}>
            本サイトはYouTube上の有益な動画があつまるプラットフォームを目指しています。他の人にも有益になる動画を共有しよう。
          </Text>

          <Features />
          <div>
            <Divider mb="xl" />
            <Accordion
              chevronPosition="right"
              chevronSize={50}
              variant="separated"
              disableChevronRotation
              chevron={<IconPlus size="1.05rem" stroke={1.5} />}
            >
              <Accordion.Item className={classes.item} value="searvice-purpose">
                <Accordion.Control>サービスの目的は？</Accordion.Control>
                <Accordion.Panel>{purposeContent}</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="why">
                <Accordion.Control>「YouTube」を選ぶ理由は？</Accordion.Control>
                <Accordion.Panel>{why}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        </Container>
        <Footer
          links={[
            { link: "/privacy", label: "プライバシーポリシー" },
            { link: "/terms", label: "利用規約" },
            {
              link: "https://docs.google.com/forms/d/e/1FAIpQLSdytwlDnLWjiRZmmdilnyo-j8nrpmUsl5swNDLDfcBkHrlhSA/viewform",
              label: "お問い合わせ",
            },
          ]}
        />
      </div>
    </MainLayout>
  );
}
