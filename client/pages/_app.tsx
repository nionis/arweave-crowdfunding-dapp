import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import Header from "../src/components/Header";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

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
