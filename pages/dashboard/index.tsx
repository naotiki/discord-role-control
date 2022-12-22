import type {JSXElementConstructor, ReactElement} from 'react'
import type {NextPageWithLayout} from '../_app'
import DashboardLayout, {dashBoardLayout} from "../../components/layouts/dashboard-layout";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import {selectedGuildState, userGuildState} from "@/components/recoil/atoms";
import {
    Avatar,
    Button, IconButton,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr
} from "@chakra-ui/react";
import {CopyIcon} from "@chakra-ui/icons";
import Link from "next/link";
import {useRouter} from "next/router";

const Dashboard: NextPageWithLayout = () => {
    const userGuild = useRecoilValueLoadable(userGuildState)
    const [selectedGuild] = useRecoilState(selectedGuildState)
    const router = useRouter()
    if (selectedGuild) {
        return <></>
    } else if (userGuild.state == "hasValue") {
        return <>
            <Text fontSize="xl">
                サーバーを選びましょう
            </Text>
            <TableContainer width={"container.md"}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>アイコン</Th>
                            <Th>サーバー名</Th>
                            <Th>ID</Th>
                            <Th>開く</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            userGuild.contents.map(g => {
                                return (<Tr>
                                    <Td><Avatar name={g.name}
                                                src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon!!}.png`}></Avatar></Td>
                                    <Td>{g.name}</Td>
                                    <Td>{g.id}
                                        <IconButton aria-label={"copy"} icon={<CopyIcon/>} onClick={
                                            () => {
                                                navigator.clipboard.writeText(g.id);
                                            }
                                        }></IconButton></Td>
                                    <Td>
                                        <Link href={"/dashboard/" + g.id}><Button>開く</Button></Link>
                                    </Td>
                                </Tr>)
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    } else {
        return <>
            <Skeleton height={300}>

            </Skeleton>
        </>
    }
}

Dashboard.getLayout = dashBoardLayout

export default Dashboard
