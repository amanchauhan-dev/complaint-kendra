import { Metadata } from "next"
import DistrictTable from "../_components/district-table"
import DistrictCreate from "../_components/district-create"
import { DistrictProvider } from "./district-context"
import DistrictSearch from "../_components/district-search"
import { FetchAllDistrict } from "./actions"


export const metadata: Metadata = {
    title: 'Districts'
}

function page() {
    return (
        <DistrictProvider fetchFunction={FetchAllDistrict}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <DistrictSearch />
                <div className="ml-auto">
                    <DistrictCreate />
                </div>
            </div>
            <DistrictTable />
        </DistrictProvider>
    )
}

export default page