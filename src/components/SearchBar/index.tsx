import React, { useState, useEffect } from "react";
import {
  TextInput,
  useMantineTheme,
  SimpleGrid,
  Divider,
  Box,
  Text,
} from "@mantine/core";
import type { TextInputProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { api } from "~/utils/api";
import { debounce } from "lodash";
import Post from "~/components/Post";
import { NotFoundImage } from "../ResultImage/NotFoundImage";
import { NotFoundResult } from "../ResultImage/NotFoundResult";

export const SearchBar = (props: TextInputProps) => {
  const theme = useMantineTheme();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const searchResult = api.post.search.useQuery(
    {
      query: debouncedQuery,
    },
    {
      enabled: !!debouncedQuery,
    }
  );

  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedQuery(
        query
          .toLowerCase()
          .replace(/\s{2,}/g, " ")
          .trim()
      );
    }, 500);
    debounced();
    return () => {
      debounced.cancel();
    };
  }, [query]);

  return (
    <div className="w-full">
      <TextInput
        icon={<IconSearch size="1.1rem" stroke={1.5} />}
        radius="xl"
        size="md"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="Search..."
        rightSectionWidth={42}
        {...props}
      />
      {debouncedQuery && (
        <Text
          component="h3"
          color={theme.colorScheme === "dark" ? "white" : "dark"}
          className="pt-8 text-lg font-bold  sm:text-lg md:text-xl lg:text-xl"
        >
          「{debouncedQuery}」の検索結果
        </Text>
      )}

      {debouncedQuery ? (
        (searchResult?.data?.SearchedPosts?.length ?? 0) > 0 ? (
          <>
            <Divider
              mt="xl"
              labelPosition="left"
              label={
                <>
                  <IconSearch size={14} />
                  <Box ml={5} className="text-sm">
                    {searchResult?.data?.SearchedPosts?.length}
                    件の記事がヒットしました
                  </Box>
                </>
              }
            />
            <SimpleGrid
              cols={3}
              spacing="xl"
              verticalSpacing="xl"
              mt={24}
              breakpoints={[
                { maxWidth: "sm", cols: 1 },
                { maxWidth: "md", cols: 2 },
              ]}
            >
              {searchResult?.data?.SearchedPosts?.map((post) => (
                <Post
                  category={null}
                  {...post}
                  searchKeyword={debouncedQuery}
                  key={post?.id}
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <>
            <NotFoundResult />
          </>
        )
      ) : (
        <NotFoundImage />
      )}
    </div>
  );
};
