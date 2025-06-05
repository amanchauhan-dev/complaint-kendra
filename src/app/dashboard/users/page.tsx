import { Metadata } from "next"
import { UserProvider } from "./user-context"
import { FetchAllUser } from "./action"
import UserSearch from "./_components/user-search"
import UserCreate from "./_components/user-create"
import UserTable from "./_components/user-table"

export const metadata: Metadata = {
    title: "Users"
}
function page() {
    return (
        <UserProvider fetchFunction={FetchAllUser}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <UserSearch />
                <div className="ml-auto">
                    <UserCreate />
                </div>
            </div>
            <UserTable />
        </UserProvider>
    )
}

export default page