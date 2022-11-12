import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "./theme"
import {SessionProvider} from "next-auth/react";
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import {RecoilRoot} from "recoil";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({Component, pageProps: {session, ...pageProps}}: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)
    return (
        <RecoilRoot>
            <SessionProvider session={session}>
                <ChakraProvider theme={theme}>
                    {getLayout(<Component {...pageProps} />)}
                </ChakraProvider>
            </SessionProvider>
        </RecoilRoot>
    )

}

export default MyApp