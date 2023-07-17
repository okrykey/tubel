import { ScrollArea, Tabs } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";
import { BiBookOpen } from "react-icons/bi";

export const TabsList = () => {
  return (
    <Tabs color="teal" defaultValue="first">
      <Tabs.List>
        <Tabs.Tab icon={<IconBrandYoutube size="0.8rem" />} value="1">
          Prigraming
        </Tabs.Tab>
        <Tabs.Tab icon={<BiBookOpen size="0.8rem" />} value="2" color="blue">
          English
        </Tabs.Tab>
        <Tabs.Tab value="3" color="grape">
          Fashion
        </Tabs.Tab>
        <Tabs.Tab value="4" color="orange">
          Movie
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="1" pt="xs">
        ここにプログラミング関連を置く
      </Tabs.Panel>

      <Tabs.Panel value="2" pt="xs">
        English
      </Tabs.Panel>
      <Tabs.Panel value="3" pt="xs">
        Fashion
      </Tabs.Panel>
      <Tabs.Panel value="4" pt="xs">
        Fashion
      </Tabs.Panel>
    </Tabs>
  );
};
