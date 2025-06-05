'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useTaluka } from '../talukas/taluka-context'

function TalukaSearch() {
    const { search, setSearch } = useTaluka()
    return <SearchBox value={search} setValue={setSearch} />
}

export default TalukaSearch