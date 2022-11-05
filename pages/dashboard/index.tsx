import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'
import DashboardLayout from "../../components/layouts/dashboard-layout";

const Dashboard: NextPageWithLayout = () => {
    return <p>あア亜hello world</p>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    )
}

export default Dashboard