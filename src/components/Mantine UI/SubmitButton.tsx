import { IconBrandYoutube } from "@tabler/icons-react";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
import YouTube from "react-youtube";

export const SubmitButton = () => {
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
        <div className="flex w-full items-center justify-center">
          <Input
            value={newUrl}
            type="text"
            placeholder="https://www.youtube.com/xxxxxxxx"
            name="new-title"
            id="new-title"
            className="m-4 w-1/3"
            onChange={handleChange}
          />
          <Button
            className="m-4"
            type="submit"
            variant="outline"
            color="indigo"
            onClick={handleAdd}
          >
            反映
          </Button>
          <Button
            className="m-4"
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
