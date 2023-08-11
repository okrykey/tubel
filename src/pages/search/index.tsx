import { Container } from "@mantine/core";
import { NextPage } from "next";
import { HeaderTabs } from "~/components/Header";
import { SearchBar } from "~/components/SearchBar";

const Search: NextPage = () => {
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />

        <Container
          size="lg"
          p="xl"
          className="flex h-screen w-full flex-col py-10"
        >
          <SearchBar></SearchBar>
        </Container>
      </div>
    </>
  );
};

export default Search;
