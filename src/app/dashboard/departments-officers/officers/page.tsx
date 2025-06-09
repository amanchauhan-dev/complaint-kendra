import { Metadata } from 'next'
import React from 'react'
import { OfficerProvider } from './officer-context'
import { FetchAllOfficers } from './action'
import OfficerTable from '../_components/officer-table'
import OfficerSearch from '../_components/officer-search'
import OfficerCreate from '../_components/officer-create'

export const metadata: Metadata = {
    title: "Officers"
}
function page() {
    return (
        <OfficerProvider fetchFunction={FetchAllOfficers}>

            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <OfficerSearch />
                <div className="ml-auto">
                    <OfficerCreate />
                </div>
            </div>
            <OfficerTable />
        </OfficerProvider>
    )
}

export default page