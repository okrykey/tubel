import { api } from "~/utils/api";
import React from "react";
import { Button, SimpleGrid } from "@mantine/core";
import { CommentCard } from "~/components/CommentCard";
import dayjs from "dayjs";

const Comments = ({ postId }: { postId: string }) => {
  const commentGetAll = api.comment.all.useQuery({ postId });

  return (
    <div>
      <SimpleGrid
        cols={2}
        spacing="xl"
        verticalSpacing="xl"
        mt={50}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
        ]}
      >
        {commentGetAll.data?.map((comment) => (
          <div
            key={comment.id}
            className="mb-4 w-full overflow-hidden bg-white shadow sm:rounded-lg"
          >
            <CommentCard
              postedAt={dayjs(comment.createdAt).fromNow()}
              content={comment.content}
              user={{
                name: `${comment.user.name}`,
                image: `${comment.user.image}`,
              }}
            />
          </div>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Comments;
