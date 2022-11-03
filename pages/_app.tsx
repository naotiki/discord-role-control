import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme"
import {SessionProvider} from "next-auth/react";

function MyApp({ Component, pageProps :{session,...pageProps} }: AppProps) {
  return (
      <SessionProvider session={session}><ChakraProvider theme={theme}>
          <Component {...pageProps} />
      </ChakraProvider></SessionProvider>
  )
}
export default MyApp