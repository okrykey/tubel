import { createStyles, Text, SimpleGrid, Container, rem } from "@mantine/core";
import {
  IconTruck,
  IconCertificate,
  IconCoin,
  IconSearch,
  IconSend,
} from "@tabler/icons-react";
import { BiChat } from "react-icons/bi";

const useStyles = createStyles((theme) => ({
  feature: {
    position: "relative",
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: "absolute",
    height: rem(100),
    width: rem(160),
    top: 0,
    left: 0,
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 2,
  },

  icon: {
    color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
      .color,
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

interface FeatureProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.FC<any>;
  title: string;
  description: string;
}

function Feature({
  icon: Icon,
  title,
  description,
  className,
  ...others
}: FeatureProps) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.feature, className)} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={rem(38)} className={classes.icon} stroke={1.5} />
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const data = [
  {
    icon: IconSearch,
    title: "1.検索して見つける",
    description: "検索して動画を見つけよう。見たくなる動画が必ずここにある",
  },
  {
    icon: BiChat,
    title: "2.コメントして意見交換する",
    description:
      "投稿に対してコメントしよう。その動画のポイントや活用方法をシェアしよう。",
  },
  {
    icon: IconSend,
    title: "3.投稿して動画を共有する",
    description:
      "自分の「この動画みてよかった」を共有しよう。必ず他の人にも役立つはず",
  },
];

export function Features() {
  const items = data.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mt={30} mb={30} size="lg">
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        spacing={50}
      >
        {items}
      </SimpleGrid>
    </Container>
  );
}
