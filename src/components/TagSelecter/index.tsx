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

export const TagSelecter = () => {
  const [tag, setTag] = useState(tags);
  return (
    <>
      <MultiSelect
        className=" w-full"
        data={tag}
        placeholder="タグを入力または選択してください"
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
