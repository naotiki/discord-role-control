import {NextPageWithLayout} from "@/pages/_app";
import {ReactElement, useState} from "react";
import DashboardLayout, {dashBoardLayout, Pages} from "@/components/layouts/dashboard-layout";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import {selectedGuildState, userGuildState} from "@/components/recoil/atoms";
import {useRouter} from "next/router";
import {redirect} from "next/navigation";

const Overview: NextPageWithLayout = () => {
    const userGuild = useRecoilValueLoadable(userGuildState)
    const router = useRouter()
    if (userGuild.state != "hasValue") return <></>
    const guild = userGuild.contents.find(g => g.id == router.query.guildId)
    if (!guild) router.push('/dashboard')
    return <>
        {guild?.icon?.toString()}
    </>
}
Overview.getLayout = dashBoardLayout

export default Overview