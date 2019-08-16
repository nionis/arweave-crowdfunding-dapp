import React from "react";
import { observer } from "mobx-react";
import App, { Container } from "next/app";
import Head from "next/head";
import Header from "../src/components/Header";
import Home from "../src/Home";
import Create from "../src/Create";
import View from "../src/View";
import router from "../src/stores/router";

@observer
class MyApp extends App {
  public render() {
    const { pageProps } = this.props;
    const Component = (() => {
      if (router.page === "Home") return Home;
      else if (router.page === "Create") return Create;
      else return View;
    })();

    return (
      <Container>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
            rel="stylesheet"
            key="google-font-cabin"
          />
        </Head>

        <Header />
        <Component {...pageProps} />

        <style global jsx>{`
          body {
            margin: 0;
            padding: 0;
            font-family: "Roboto", sans-serif;
          }
        `}</style>
      </Container>
    );
  }
}

export default MyApp;
