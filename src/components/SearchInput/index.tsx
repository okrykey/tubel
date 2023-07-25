import React, { useState, useEffect } from "react";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  SimpleGrid,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { api } from "~/utils/api";
import Post from "../Post";
import { debounce } from "lodash";
import { useRouter } from "next/router";

export function InputWithButton(props: TextInputProps) {
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const router = useRouter();

  const searchResult = api.post.search.useQuery(
    {
      query: debouncedQuery,
    },
    {
      enabled: !!debouncedQuery,
    }
  );

  useEffect(() => {
    const debounced = debounce(() => setDebouncedQuery(query), 500);
    debounced();
    return () => {
      debounced.cancel();
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?keyword=${query}`);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <TextInput
          icon={<IconSearch size="1.1rem" stroke={1.5} />}
          radius="xl"
          size="md"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          rightSection={
            <ActionIcon
              size={32}
              radius="xl"
              color="indigo"
              variant="outline"
              type="submit"
            >
              {theme.dir === "ltr" ? (
                <IconArrowRight size="1.1rem" stroke={1.5} />
              ) : (
                <IconArrowLeft size="1.1rem" stroke={1.5} />
              )}
            </ActionIcon>
          }
          placeholder="Search..."
          rightSectionWidth={42}
          {...props}
        />
      </form>
      <SimpleGrid
        cols={3}
        spacing="xl"
        verticalSpacing="xl"
        mt={50}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
        ]}
      >
        {searchResult.data?.SearchedPosts.map((post) => (
          <Post {...post} key={post.id} />
        ))}
      </SimpleGrid>
    </div>
  );
}
