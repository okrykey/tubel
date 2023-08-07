import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

const tags = [
  { value: "react", label: "React" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter" },
  { value: "qiita", label: "Qiita" },
  { value: "zenn", label: "Zenn" },
  { value: "web", label: "Web" },
];

export const modalOpenAtom = atom(false);
export const LoginModalAtom = atom(false);
export const tagsAtom = atom(tags);
