import { Button, Menu, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export const ProfileMenu = () => {
  return (
    <Menu position="bottom-end" offset={6}>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconSearch size={rem(14)} />} disabled>
          Search
        </Menu.Item>

        {/* Other items ... */}
      </Menu.Dropdown>
    </Menu>
  );
};
