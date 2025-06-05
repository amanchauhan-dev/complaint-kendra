'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useSubdivision } from '../subdivisions/subdivision-context'

function SubdivisonSearch() {
    const { search, setSearch } = useSubdivision()
    return <SearchBox value={search} setValue={setSearch} />
}

export default SubdivisonSearch