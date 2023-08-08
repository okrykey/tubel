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
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Session } from "next-auth";
import { LoginModal } from "~/components/LoginModal";

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
        ></meta>
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
              },
              primaryColor: "indigo",
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Toaster />
            <Component {...pageProps} />
            <LoginModal />
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
