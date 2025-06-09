'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useOfficer } from '../officers/officer-context'

function OfficerSearch() {
    const { search, setSearch } = useOfficer()
    return <SearchBox value={search} setValue={setSearch} />
}

export default OfficerSearch