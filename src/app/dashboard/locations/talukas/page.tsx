import { Metadata } from "next"
import { TalukaProvider } from "./taluka-context"
import { FetchAllTaluka } from "./actions"
import TalukaTable from "../_components/taluka-table"
import TalukaCreate from "../_components/taluka-create"
import TalukaSearch from "../_components/taluka-search"


export const metadata: Metadata = {
    title: 'Districts'
}

function page() {
    return (
        <TalukaProvider fetchFunction={FetchAllTaluka}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <TalukaSearch />
                <div className="ml-auto">
                    <TalukaCreate />
                </div>
            </div>
            <TalukaTable />
        </TalukaProvider>
    )
}

export default page