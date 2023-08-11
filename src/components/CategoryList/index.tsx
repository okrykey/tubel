import {
  Group,
  Text,
  createStyles,
  Image,
  ThemeIcon,
  rem,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";
import {
  IconAtom,
  IconBook,
  IconCode,
  IconGlobe,
  IconUsers,
  IconBrush,
  IconMovie,
  IconShirt,
} from "@tabler/icons-react";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  badge: {
    "&:hover": {
      boxShadow: theme.shadows.xs,
      transform: "scale(1.01)",
    },
  },

  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },
  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
    [theme.fn.smallerThan("sm")]: {
      border: `0.5px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[6]
      }`,
    },
  },
  image: {
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6]
    }`,
    borderRadius: theme.radius.xs,
  },
}));

const categoryData = [
  {
    id: 1,
    icon: IconCode,
    title: "プログラミング",
    value: "programming",
    description: "分からない疑問を解決。サクッと動画で分かりやすく学ぼう",
  },
  {
    id: 2,
    icon: IconGlobe,
    title: "カルチャー",
    value: "culture",
    description:
      "世界中の文化が集まる。動画から多様な文化と世界の広さを感じよう",
  },

  {
    id: 3,
    icon: IconBook,
    title: "英語",
    value: "english",
    description: "見るだけで世界中へ。場所を問わずグローバル化しよう",
  },
  {
    id: 4,
    icon: IconAtom,
    title: "科学",
    value: "science",
    description: "自然科学からコンピュータ科学まで、幅広い知識を学ぼう",
  },
  {
    id: 5,
    icon: IconUsers,
    title: "社会",
    value: "society",
    description: "社会に関する興味深いトピックや議論を探索しよう",
  },
  {
    id: 6,
    icon: IconBrush,
    title: "芸術",
    value: "art",
    description: "美術、音楽、舞台など、芸術の多様な形を楽しもう",
  },
  {
    id: 7,
    icon: IconMovie,
    title: "映画",
    value: "movie",
    description:
      "制作の裏話から最新情報まで。映画の魅力や背後にあるストーリーを探求しよう",
  },
  {
    id: 8,
    icon: IconShirt,
    title: "ファッション",
    value: "fashion",
    description:
      "著名人のファッションや最新の流行まで。最新のトレンドやファッションの歴史を学ぼう",
  },
];

export function CategoryList() {
  const { classes, theme } = useStyles();

  const categoryNames = categoryData.map((item) => item.value);
  const { data: allPostsData } = api.post.getCategorizedPosts.useQuery(
    {
      categoryNames,
    },
    {
      enabled: true,
    }
  );

  return (
    <>
      {categoryData.map((item) => {
        const CategorizedPosts =
          allPostsData?.CategorizedPosts.filter(
            (post) => post.category && post.category.name === item.value
          ) ?? [];

        return (
          <Link href={`/category/${item.value}`} key={item.id}>
            <UnstyledButton className={classes.subLink} key={item.title}>
              <Group noWrap align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                  <item.icon
                    size={rem(22)}
                    color={theme.colorScheme === "dark" ? "white" : "black"}
                  />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={500}>
                    {item.title}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {item.description}
                  </Text>
                  <Group spacing={4} pt="sm">
                    <div className="flex space-x-[-20px]">
                      {CategorizedPosts.length > 0 ? (
                        CategorizedPosts.slice(0, 3).map((post, i) => {
                          const YouTubeVideoId = new URLSearchParams(
                            new URL(post.videoId).search
                          ).get("v");
                          return (
                            <Image
                              key={i}
                              width={64}
                              height={36}
                              className={`${classes.image} relative z-${
                                20 - i * 10
                              }`}
                              src={`https://i.ytimg.com/vi/${YouTubeVideoId}/maxresdefault.jpg`}
                              alt={post.title}
                            />
                          );
                        })
                      ) : (
                        <Text size="sm" color="dimmed">
                          Not Found
                        </Text>
                      )}
                    </div>
                    {CategorizedPosts.length > 2 && (
                      <Text color="dimmed" size="sm">
                        +more
                      </Text>
                    )}
                  </Group>
                </div>
              </Group>
            </UnstyledButton>
          </Link>
        );
      })}
    </>
  );
}