import * as kuromoji from "kuromoji";
import path from "path";

type KuromojiToken = {
  surface_form: string;
  pos: string;
  word_type: string;
};

type KuromojiTokenizer = {
  tokenize: (text: string) => KuromojiToken[];
};

export const getKeywords = (text: string): Promise<string[]> => {
  const pathToDict = path.join(process.cwd(), "public/dict/");
  const builder = kuromoji.builder({ dicPath: pathToDict });

  return new Promise((resolve, reject) => {
    builder.build((err: Error | null, tokenizer: KuromojiTokenizer) => {
      if (err) {
        console.error("Error in kuromoji.builder:", err.message);
        return reject(err);
      }
      const tokens: KuromojiToken[] = tokenizer.tokenize(text);
      const keywords = tokens
        .filter((token) => token.pos === "名詞" && token.word_type === "KNOWN")
        .map((token) => token.surface_form);
      resolve(keywords);
    });
  });
};
