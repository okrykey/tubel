import { IconBrandYoutube } from "@tabler/icons-react";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
import YouTube from "react-youtube";

export const PutUrl = () => {
  const [showInput, setShowInput] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewUrl(e.target.value);
  };

  const handleAdd = () => {
    const id = new URLSearchParams(new URL(newUrl).search).get("v");
    setVideoId(id || "");
  };

  const handleCancel = () => {
    setShowInput(true);
    setNewUrl("");
    setVideoId("");
  };

  return (
    <>
      {showInput ? (
        <Button
          className="m-4 flex-none"
          type="submit"
          variant="outline"
          color="indigo"
          onClick={() => setShowInput(false)}
          leftIcon={<IconBrandYoutube size="1rem" />}
        >
          Post your favorite YouTube video
        </Button>
      ) : (
        <div className="spaxe-y-4 flex w-full flex-col items-center justify-center">
          <Input
            value={newUrl}
            type="text"
            placeholder="https://www.youtube.com/xxxxxxxx"
            name="new-title"
            id="new-title"
            className="m-4 w-full"
            onChange={handleChange}
          />

          <Button
            className="m-4"
            size="xs"
            type="submit"
            variant="outline"
            color="indigo"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          {videoId && <YouTube videoId={videoId} />}
        </div>
      )}
    </>
  );
};
