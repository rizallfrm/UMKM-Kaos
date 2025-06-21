import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

import { apolloClient } from "../lib/apolloClient";
function MyApp({ Component, pageProps: { session, ...pageProps } }) {


  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
