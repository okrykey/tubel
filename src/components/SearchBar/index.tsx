import React, { useState, useEffect } from "react";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  SimpleGrid,
  Divider,
  Box,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { api } from "~/utils/api";
import { debounce } from "lodash";
import Post from "~/components/Post";
import { NotFoundImage } from "../ResultImage/NotFoundImage";
import { NotFoundContent } from "../ResultImage/NotFoundContent";

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
      setDebouncedQuery(query.replace(/\s{2,}/g, " ").trim());
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
        <h1 className="pt-8 text-lg font-bold text-gray-700 sm:text-lg md:text-xl lg:text-xl">
          「{debouncedQuery}」の検索結果
        </h1>
      )}

      {debouncedQuery ? (
        (searchResult?.data?.SearchedPosts?.length ?? 0) > 0 ? (
          <>
            <Divider
              my="xs"
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
                <Post {...post} searchKeyword={debouncedQuery} key={post?.id} />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <>
            <NotFoundContent />
          </>
        )
      ) : (
        <NotFoundImage />
      )}
    </div>
  );
};
