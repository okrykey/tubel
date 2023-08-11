import { useState } from "react";
import NextApp, { AppProps, AppContext } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Session } from "next-auth";
import { LoginModal } from "~/components/LoginModal";
import PostFormModal from "~/components/PostFormModal";

function MyApp(
  props: AppProps & { colorScheme: ColorScheme; session: Session | null }
) {
  const { Component, pageProps, session } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Tubel - Watch, Learn, Share -</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="TubelはYouTubeの動画で学習を共有できるサービスです。"
        />
        <meta property="og:title" content="Tubel - Watch, Learn, Share -" />
        <meta
          property="og:description"
          content="TubelはYouTubeの動画で学習を共有できるサービスです。"
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta property="og:url" content="URL_TO_YOUR_PAGE" />
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <SessionProvider session={session}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{
              colorScheme,
              colors: {
                indigo: [
                  "#EDF2FF",
                  "#DBE4FF",
                  "#BAC8FF",
                  "#91A7FF",
                  "#748FFC",
                  "#5C7CFA",
                  "#4C6EF5",
                  "#4263EB",
                  "#3B5BDB",
                  "#364FC7",
                ],
                teal: [
                  "#E6FCF5",
                  "#C3FAE8",
                  "#96F2D7",
                  "#63E6BE",
                  "#38D9A9",
                  "#20C997",
                  "#12B886",
                  "#0CA678",
                  "#099268",
                  "#087F5B",
                ],
              },
              primaryColor: colorScheme === "dark" ? "teal" : "indigo",
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Component {...pageProps} />
            <LoginModal />
            <PostFormModal />
            <Notifications position="top-right" />
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};

export default api.withTRPC(MyApp);
