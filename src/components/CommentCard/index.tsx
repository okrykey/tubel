import {
  createStyles,
  Text,
  Avatar,
  Group,
  rem,
  ActionIcon,
  Menu,
  Modal,
  Button,
  Input,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { BsThreeDots } from "react-icons/bs";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import React, { useState } from "react";
import toast from "react-hot-toast";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
  },
}));

interface CommentSimpleProps {
  id: string;
  postedAt: string;
  content: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export function CommentCard({
  id,
  postedAt,
  content,
  user,
}: CommentSimpleProps) {
  const { data: session } = useSession();
  const { classes } = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [opened, { open, close }] = useDisclosure(false);
  const trpc = api.useContext();

  const isUser = session && session.user && session.user.id === user.id;

  const deleteComment = api.comment.delete.useMutation({
    onSettled: async () => {
      await trpc.comment.all.invalidate();
    },
  });

  const editComment = api.comment.update.useMutation({
    onSuccess: () => {
      toast.success("コメントを編集しました！");
    },
    onSettled: async () => {
      await trpc.comment.all.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <Group position="apart">
        <Group>
          <Avatar src={user.image} alt={user.name} radius="xl" />
          <div>
            <Text size="sm">{user.name}</Text>
            <Text size="xs" color="dimmed">
              {postedAt}
            </Text>
          </div>
        </Group>
        {isUser && (
          <>
            <Menu position="bottom-end" shadow="md" offset={6} width={80}>
              <Menu.Target>
                <ActionIcon>
                  <BsThreeDots />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  className="font-bold"
                  onClick={() => setIsEditing(true)}
                >
                  編集
                </Menu.Item>

                <Menu.Divider />
                <Menu.Item
                  className="font-bold text-red-500"
                  onClick={() => open()}
                >
                  削除
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        )}
      </Group>
      {isEditing ? (
        <>
          <Input.Wrapper
            className={classes.body}
            error={
              currentContent.length >= 3
                ? null
                : "※コメントは3文字以上である必要があります。"
            }
          >
            <Input
              variant="unstyled"
              value={currentContent}
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentContent(e.target.value)
              }
            />
          </Input.Wrapper>
          <Group spacing={8} m="xs" position="right">
            <Button
              size="xs"
              variant="outline"
              color="red"
              onClick={() => {
                setIsEditing(false);
              }}
            >
              キャンセル
            </Button>
            <Button
              disabled={currentContent.length < 3}
              onClick={() => {
                editComment.mutate({ id, content: currentContent });
                setIsEditing(false);
              }}
              size="xs"
              variant="outline"
            >
              変更を保存
            </Button>
          </Group>
        </>
      ) : (
        <Text className={classes.body} size="sm">
          {content}
        </Text>
      )}

      <Modal opened={opened} onClose={close} centered title="削除">
        <Group position="apart" mb="xs">
          <Text fz="sm" className="py-4">
            本当に削除しますか？
          </Text>
        </Group>
        <Group position="right" mt="md">
          <Button variant="default" size="xs" onClick={close}>
            キャンセル
          </Button>
          <Button
            variant="outline"
            size="xs"
            color="red"
            onClick={() => {
              deleteComment.mutate(id);
              close();
            }}
          >
            削除する
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
