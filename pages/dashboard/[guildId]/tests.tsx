import {NextPageWithLayout} from "@/pages/_app";
import {ReactElement, useState} from "react";
import DashboardLayout, {Pages} from "@/components/layouts/dashboard-layout";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import {selectedGuildState, userGuildState} from "@/components/recoil/atoms";
import {useRouter} from "next/router";
import {redirect} from "next/navigation";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/tabs";

const Tests: NextPageWithLayout = () => {
    const userGuild = useRecoilValueLoadable(userGuildState)
    const router = useRouter()
    if (userGuild.state != "hasValue") return <></>
    const guild = userGuild.contents.find(g => g.id == router.query.guildId)
    if (!guild) router.push('/dashboard')
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