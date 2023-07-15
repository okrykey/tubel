import { Tabs } from "@mantine/core";

export const TabsList = () => {
  return (
    <Tabs color="teal" defaultValue="first">
      <Tabs.List>
        <Tabs.Tab value="first">Posts</Tabs.Tab>
        <Tabs.Tab value="second" color="blue">
          Questions
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="first" pt="xs">
        First tab color is teal, it gets this value from context
      </Tabs.Panel>

      <Tabs.Panel value="second" pt="xs">
        Second tab color is blue, it gets this value from props, props have the
        priority and will override context value
      </Tabs.Panel>
    </Tabs>
  );
};
