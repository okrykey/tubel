import { Container } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { Footer } from "~/components/Footer";
import MainLayout from "~/layouts/Mainlayout";

const Privacy = () => {
  return (
    <MainLayout>
      <Container size="sm" p="md">
        <section className="leading-relaxed tracking-wide">
          <h1 className=" my-4 text-2xl font-bold">プライバシーポリシー</h1>
          <p className="mb-4">
            当方は、本ウェブサイト上で提供するサービス(以下、「本サービス」といいます。)におけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー(以下、「本ポリシー」といいます。)を定めます。
          </p>

          <h2 className="mb-2 mt-8 text-xl font-semibold">
            お客様から取得する情報
          </h2>
          <p className="mb-4">当方は、お客様から以下の情報を取得します。</p>
          <ol>
            <li>氏名(ニックネームやペンネームも含む)</li>
            <li>
              外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報
            </li>
            <li>Cookie(クッキー)を用いて生成された識別情報</li>
            <li>
              OSが生成するID、端末の種類、端末識別子等のお客様が利用するOSや端末に関する情報
            </li>
            <li>
              当方ウェブサイトの滞在時間、入力履歴、購買履歴等の当方ウェブサイトにおけるお客様の行動履歴
            </li>
          </ol>

          <h2 className="mb-2 mt-8 text-xl font-semibold">
            お客様の情報を利用する目的
          </h2>
          <p className="mb-4">
            当方は、お客様から取得した情報を、以下の目的のために利用します。
          </p>
          <ol>
            <li>本サービスに関する登録の受付、お客様の本人確認、認証のため</li>
            <li>お客様の本サービスの利用履歴を管理するため</li>
            <li>
              本サービスにおけるお客様の行動履歴を分析し、本サービスの維持改善に役立てるため
            </li>
            <li>当方のサービスに関するご案内をするため</li>
            <li>お客様からのお問い合わせに対応するため</li>
            <li>当方の規約や法令に違反する行為に対応するため</li>
            <li>本サービスの変更、提供中止、終了、契約解除をご連絡するため</li>
            <li>当方規約の変更等を通知するため</li>
            <li>以上の他、本サービスの提供、維持、保護及び改善のため</li>
          </ol>

          <h2 className="mb-2 mt-8 text-xl font-semibold">
            お客様から取得する情報
          </h2>
          <p className="mb-4">当方は、お客様から以下の情報を取得します。</p>
          <ol>
            <li>氏名(ニックネームやペンネームも含む)</li>
            <li>
              外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報
            </li>
            <li>Cookie(クッキー)を用いて生成された識別情報</li>
            <li>
              OSが生成するID、端末の種類、端末識別子等のお客様が利用するOSや端末に関する情報
            </li>
            <li>
              当方ウェブサイトの滞在時間、入力履歴、購買履歴等の当方ウェブサイトにおけるお客様の行動履歴
            </li>
          </ol>

          <h2 className="mb-2 mt-8 text-xl font-semibold">第三者提供</h2>
          <p className="mb-4">
            当方は、お客様から取得する情報のうち、個人データ(個人情報保護法第2条第6項)に該当するものついては、あらかじめお客様の同意を得ずに、第三者(日本国外にある者を含みます。)に提供しません。但し、次の場合は除きます。
          </p>
          <ol>
            <li>個人データの取扱いを外部に委託する場合</li>
            <li>当方や本サービスが買収された場合</li>
            <li>
              事業パートナーと共同利用する場合(具体的な共同利用がある場合は、その内容を別途公表します。)
            </li>
            <li>その他、法律によって合法的に第三者提供が許されている場合</li>
          </ol>

          <h2 className="mb-2 mt-8 text-xl font-semibold">
            Cookie（クッキー）について
          </h2>
          <p className="mb-4">
            cookieとは、WebサーバーからWebブラウザに送信されるデータのことです。Webサーバーがcookieを参照することで利用者のパソコンを識別でき、効率的に当サイトを利用することができます。当サイトがcookieとして送るファイルは、個人を特定するような情報は含んでおりません。お使いのWebブラウザの設定により、cookieを無効にすることも可能です。
          </p>

          <h2 className="mb-2 mt-8 text-xl font-semibold">著作権について</h2>
          <p className="mb-4">
            当社Webサイト内の文章や画像、すべてのコンテンツは著作権・肖像権等により保護されています。無断での使用や転用は禁止されています。
          </p>

          <h2 className="mb-2 mt-8 text-xl font-semibold">
            アクセス解析ツール
          </h2>
          <p className="mb-4">
            当方は、お客様のアクセス解析のために「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。
          </p>

          <h2 className="mb-2 mt-8 text-xl font-semibold">
            プライバシーポリシーの変更
          </h2>
          <p className="mb-4">
            当方は、必要に応じて、本ポリシーの内容を変更します。本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、お客様に通知することなく、変更することができるものとします。当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
          </p>

          <h2 className="mb-2 mt-8 text-xl font-semibold">お問い合わせ</h2>
          <p>
            お客様の情報の開示、情報の訂正、利用停止、削除をご希望の場合は、以下のお問い合わせまでご連絡ください。
          </p>
        </section>
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSdytwlDnLWjiRZmmdilnyo-j8nrpmUsl5swNDLDfcBkHrlhSA/viewform"
          className="text-right underline"
        >
          お問い合わせ
        </Link>
      </Container>
      <Footer
        links={[
          { link: "/privacy", label: "プライバシーポリシー" },
          { link: "/terms", label: "利用規約" },
          { link: "/", label: "お問い合わせ" },
        ]}
      />
    </MainLayout>
  );
};

export default Privacy;
