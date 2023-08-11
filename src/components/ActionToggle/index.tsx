import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export const ActionToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    toggleColorScheme(colorScheme);
  };

  return (
    <Group>
      <ActionIcon
        onClick={handleToggle}
        size="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],
        })}
      >
        {colorScheme === "dark" ? (
          <IconSun size="1.2rem" />
        ) : (
          <IconMoonStars size="1.2rem" />
        )}
      </ActionIcon>
    </Group>
  );
};
