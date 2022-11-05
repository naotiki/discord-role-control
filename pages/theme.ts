// theme.ts

// 1. import `extendTheme` function
import {extendTheme, StyleFunctionProps, type ThemeConfig} from '@chakra-ui/react'
import {mode, Styles} from "@chakra-ui/theme-tools";
// 2. Add your color mode config
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}
const styles: Styles = {

    global: (props: StyleFunctionProps) => ({
        body: {
            fontFamily: 'body',
            color: mode('gray.800', 'whiteAlpha.900')(props),
            bg: mode('white', 'gray.800')(props),
            lineHeight: 'base',
        },
    }),
}
const fonts = {
    body:"'Inter','Noto Sans JP', sans-serif",
    heading:"'Inter','Noto Sans JP', sans-serif",
    mono: "Menlo, monospace",
}
// 3. extend the theme
const theme = extendTheme({config, styles,fonts})
export default theme