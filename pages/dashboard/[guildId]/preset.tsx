import {NextPageWithLayout} from "@/pages/_app";
import {ReactElement, useState} from "react";
import DashboardLayout, {Pages} from "@/components/layouts/dashboard-layout";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import {selectedGuildState, userGuildState} from "@/components/recoil/atoms";
import {useRouter} from "next/router";
import {redirect} from "next/navigation";

const Preset: NextPageWithLayout = () => {
    const userGuild = useRecoilValueLoadable(userGuildState)
    const router = useRouter()
    if (userGuild.state != "hasValue") return <></>
    const guild = userGuild.contents.find(g => g.id == router.query.guildId)
    if (!guild) router.push('/dashboard')
    return <>

    </>
}
Preset.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    )
}

export default Preset