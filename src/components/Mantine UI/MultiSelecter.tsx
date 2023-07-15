import { MultiSelect } from "@mantine/core";
import { useState } from "react";

const tags = [
  { value: "react", label: "React" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter" },
  { value: "qiita", label: "Qiita" },
  { value: "zenn", label: "Zenn" },
  { value: "web", label: "Web" },
];

const categories = [
  { value: "react", label: "React" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter" },
  { value: "qiita", label: "Qiita" },
  { value: "zenn", label: "Zenn" },
  { value: "web", label: "Web" },
];

export const MultiSelecter = () => {
  const [tag, setTag] = useState(tags);
  const [category, setCategory] = useState(categories);
  return (
    <>
      <MultiSelect
        className="mb-4 w-1/2"
        label="カテゴリ"
        data={category}
        placeholder="入力または選択してください"
        nothingFound="Nothing found"
        searchable
        creatable
        getCreateLabel={(query) => `+ ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setCategory((current) => [...current, item]);
          return item;
        }}
      />
      <MultiSelect
        className="mb-4 w-1/2"
        label="タグ"
        data={tag}
        placeholder="入力または選択してください"
        nothingFound="Nothing found"
        searchable
        creatable
        getCreateLabel={(query) => `+ ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setTag((current) => [...current, item]);
          return item;
        }}
      />
    </>
  );
};
