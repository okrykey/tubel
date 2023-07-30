import { Container } from "@mantine/core";
import { NextPage } from "next";

import { Hero } from "~/components/Hero";
import PostFormModal from "~/components/PostFormModal";
import { HeaderTabs } from "~/components/Header";
import { PostsList } from "~/components/PostsList";
import { SearchBar } from "~/components/SearchBar";
import { NotFoundImage } from "~/components/NotFoundImage";

const Search: NextPage = () => {
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <HeaderTabs />

        <Container size="lg" className="flex h-screen w-full flex-col p-10">
          <PostFormModal></PostFormModal>
          <SearchBar></SearchBar>
        </Container>
      </div>
    </>
  );
};

export default Search;
