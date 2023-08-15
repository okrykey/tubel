import { Image, Button, Text, useMantineTheme, Center } from "@mantine/core";
import Link from "next/link";
import { useAtom } from "jotai";
import Modal from "../Modal";
import { LoginModalAtom } from "~/state/Atoms";

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useAtom(LoginModalAtom);

  const theme = useMantineTheme();

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div>
        <Center>
          <Image
            width={140}
            height={60}
            src={
              theme.colorScheme === "dark"
                ? "/images/tubel-white-logo.png"
                : "/images/tubel-logo.png"
            }
            alt="Tubel"
          />
        </Center>
      </div>

      <div className="p-1">
        <Text color="gary" className="font-sans text-sm ">
          Tubelは学習に役立つYouTubeの動画を共有するサービスです。
          ログインすると、投稿やコメント、ブックマークなどの機能をお使いいただけます。
        </Text>

        <Button
          component={Link}
          href="/signin"
          className="mx-auto my-6 flex w-[200px] justify-center  py-[9px]"
          onClick={() => setIsOpen(false)}
        >
          ログインページへ
        </Button>

        <Text color="dimmed" className="font-sans text-xs">
          <span className="underline">
            <Link href="/terms" onClick={() => setIsOpen(false)}>
              利用規約
            </Link>
          </span>
          、
          <span className="underline">
            <Link href="/privacy" onClick={() => setIsOpen(false)}>
              プライバシーポリシー
            </Link>
          </span>
          に同意の上でご利用ください。
        </Text>
      </div>
    </Modal>
  );
};
