'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useComplaints } from '../complaint-context'

function ComplaintSearch() {
    const { search, setSearch } = useComplaints()
    return <SearchBox value={search} setValue={setSearch} />
}

export default ComplaintSearch