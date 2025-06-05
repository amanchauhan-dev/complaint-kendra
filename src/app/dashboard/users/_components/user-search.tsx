'use client'

import SearchBox from "@/app/dashboard/_components/search-box"
import { useUser } from "../user-context"

function CitizenSearch() {
    const { search, setSearch } = useUser()
    return <SearchBox value={search} setValue={setSearch} />
}

export default CitizenSearch