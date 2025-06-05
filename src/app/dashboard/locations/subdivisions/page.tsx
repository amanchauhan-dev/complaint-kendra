import { Metadata } from "next"
import { FetchAllSubdivisions } from "./actions"
import { SubDivisionProvider } from "./subdivision-context"
import SubdivisionTable from "../_components/subdivision-table"
import SubdivisionCreate from "../_components/subdivision-create"
import SubdivisonSearch from "../_components/subdivision-search"


export const metadata: Metadata = {
    title: 'Subdivisons'
}

function page() {
    return (
        <SubDivisionProvider fetchFunction={FetchAllSubdivisions}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <SubdivisonSearch />
                <div className="ml-auto">
                    <SubdivisionCreate />
                </div>
            </div>
            <SubdivisionTable />
        </SubDivisionProvider>
    )
}

export default page