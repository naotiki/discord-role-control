import {PropsWithChildren} from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem, AccordionPanel, Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Spacer
} from "@chakra-ui/react";
import {useSession} from "next-auth/react";
import DiscordUserInfo from "../discord-user-info";
import GuildSelector from "../guild-selector";
import {GetServerSideProps} from "next";

export default function DashboardLayout({children}: PropsWithChildren) {
    const {data: session} = useSession()
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
                <Heading as="i" paddingX={5}>DREAMS α</Heading>
                <GuildSelector/>
                <Spacer/>
                <DiscordUserInfo/>
            </Flex>
        </GridItem>
        <GridItem pl='2' bg='pink.300' area={'nav'}>
            <Accordion allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                Section 1 title
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                Section 2 title
                            </Box>
                            <AccordionIcon />
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
        <GridItem pl='2' bg='green.300' area={'main'}>
            {children}
        </GridItem>
        <GridItem pl='2'  area={'footer'}>
            Created by naotikiKt
        </GridItem>
    </Grid>);
}
