import { Button, Text } from "@mantine/core";
import Link from "next/link";
import { useAtom } from "jotai";
import Modal from "../Modal";
import { LoginModalAtom } from "~/pages/state/Atoms";

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useAtom(LoginModalAtom);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="mr-6 mt-2 flex items-center justify-center">
        <img
          alt=""
          width="30"
          height="30"
          className="xs:mr-2 xs:h-[46px] xs:w-[46px] ml-2 mr-1.5 h-[20px] w-[20px]"
          src="/header-logo.svg"
        />

        <Text
          variant="gradient"
          gradient={{ from: "grape", to: "gray", deg: 45 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
          className="text-2xl"
        >
          TubeLarn
        </Text>
      </div>

      <div className="px-1.5 py-5">
        <p className="font-sans text-sm text-gray-700">
          TubeLearnはYouTubeの動画で学習を共有できるサービスです。
          ログインすると、投稿やコメント、ブックマークなどの機能をお使いいただけます。
        </p>

        <Button
          component={Link}
          href="/login"
          variant="outline"
          color="grape"
          className="mx-auto my-6 flex w-[200px] justify-center bg-gray-50 py-[9px] text-sm text-gray-700 shadow-sm shadow-gray-400"
        >
          ログインページへ
        </Button>

        <p className="font-sans text-xs text-gray-700">
          <span className="underline">
            <Link href="/terms">利用規約</Link>
          </span>
          、
          <span className="underline">
            <Link href="/privacy">プライバシーポリシー</Link>
          </span>
          に同意の上でご利用ください。
        </p>
      </div>
    </Modal>
  );
};
