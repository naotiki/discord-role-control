import {NextPageWithLayout} from "@/pages/_app";
import {ReactElement, useEffect} from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {useRecoilState} from "recoil";
import {selectedGuildState} from "@/components/recoil/atoms";
import {useRouter} from "next/router";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/tabs";
import {Table, TableContainer, Tbody, Td, Thead, Tr} from "@chakra-ui/react";

const Tests: NextPageWithLayout = () => {
    const router = useRouter()
    const [selectedGuild, setSelectedGuild] = useRecoilState(selectedGuildState)
    useEffect(() => {
        if (!selectedGuild) {
            router.push('/dashboard')
        }
    }, [selectedGuild])
    if (!selectedGuild) {
        return <></>
    }
    return <>
        <Tabs isFitted defaultIndex={1}>
            <TabList>
                <Tab>ルール設定</Tab>
                <Tab>シュミレート</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>

                </TabPanel>
                <TabPanel>
                    <TableContainer>
                        <Table><Thead>
                            <Tr>
                                <th>名前</th>
                                <th>カテゴリ</th>
                                <th></th>
                            </Tr>
                        </Thead>
                            <Tbody>
                                {selectedGuild.categories.map(c => {
                                    if (!c.id) {
                                        return <> {c.children.map(chan => <Tr
                                            bgColor={"blue"}><Td>{chan.name}</Td><Td></Td><Td></Td></Tr>)}</>
                                    }


                                    return (<>
                                        <Tr bgColor={"grey"}>
                                            <Td>{c.name}</Td><Td>{c.id}</Td><Td></Td>
                                        </Tr>
                                        {c.children.map(chan => <Tr><Td>{chan.name}</Td><Td></Td><Td></Td></Tr>)}
                                    </>)
                                })}
                            </Tbody></Table>
                    </TableContainer>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </>
}
Tests.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    )
}

export default Tests