import React from 'react'
import { ComplaintProvider } from './complaint-context'
import { FetchAllComplaints } from './action'
import ComaplaintsTable from './_components/conplaint-table'
import ComplaintSearch from './_components/complaint-search'

function page() {
    return (
        <ComplaintProvider fetchFunction={FetchAllComplaints}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <ComplaintSearch />
            </div>
            <ComaplaintsTable />
        </ComplaintProvider>
    )
}

export default page