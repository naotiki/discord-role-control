import React, {
    ComponentType,
    PropsWithChildren,
    ReactComponentElement,
    ReactElement,
    ReactNode, useCallback,
    useEffect,
    useState
} from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Spacer,
    StackDivider,
    VStack
} from "@chakra-ui/react";
import {useSession} from "next-auth/react";
import DiscordUserInfo from "../discord-user-info";
import GuildSelector from "../guild-selector";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import {selectedGuildState, userGuildState} from "@/components/recoil/atoms";
import Link from "next/link";
import Dashboard from "@/pages/dashboard";
import {useRouter} from "next/router";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;
import * as Path from "path";

export enum Pages {
    Overview = "/",
    Rule = "/rules",
    TestSimulate = "/tests",
    Others = ""
}

export default function DashboardLayout({children,}: PropsWithChildren) {

    const {data: session} = useSession()
    const userGuild = useRecoilValueLoadable(userGuildState)
    const [selectedGuild, setSelectedGuild] = useRecoilState(selectedGuildState)
    const router = useRouter()
    useEffect(() => {
        if (userGuild.state == "hasValue") {
            setSelectedGuild(userGuild.contents.find(g => g.id == router.query.guildId) ?? null)
        } else {
            setSelectedGuild(null)
        }

    }, [userGuild.state, router.query.guildId])
    const createDashboardRoute = useCallback((path: string) => {
        if (!selectedGuild) return "/dashboard"
        return Path.join("/dashboard", selectedGuild.id, path)
    }, [selectedGuild])
    return (<Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={'60px 1fr 30px'}
        gridTemplateColumns={'250px 1fr'}
        h="100vh"
        gap='1'
    >
        <GridItem alignSelf={"center"} m={5} area={'header'}>

            <Flex alignItems='center'
                  justifyContent='center'>


                <Heading as="i" paddingX={5}>ろーるかんりくん ver.{Number.MIN_VALUE}</Heading>

                <GuildSelector userGuilds={userGuild.state == "hasValue" ? userGuild.contents : []}/>
                <Spacer/>
                <DiscordUserInfo/>
            </Flex>
        </GridItem>
        <GridItem pl='2' area={'nav'}>
            <Link href={"/dashboard"}><Box padding={5}>ホーム</Box></Link>
            <Link href={createDashboardRoute("/")}><Box paddingY={2}>
                概要
            </Box></Link>
            <Accordion allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                ロール管理
                            </Box>
                            <AccordionIcon/>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <VStack
                            divider={<StackDivider borderColor='gray.200'/>}
                            align='stretch'
                        >
                            <Link href={createDashboardRoute("/preset")}>
                                <Box paddingY={2}>
                                    ルールプリセット
                                </Box></Link>
                            <Link href={createDashboardRoute("/tests")}>
                                <Box paddingY={2}>
                                    テスト/シュミレーション
                                </Box></Link>
                            <Link href={createDashboardRoute("/")}>
                                <Box paddingY={2}>
                                    なんかそういうページ
                                </Box></Link>

                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                設定
                            </Box>
                            <AccordionIcon/>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </GridItem>
        <GridItem pl='2' area={'main'}>
            {children}
        </GridItem>
        <GridItem pl='2' area={'footer'}>

            &copy; naotikiKt
        </GridItem>
    </Grid>);
}
export const dashBoardLayout = (page: ReactElement) => {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    )
}