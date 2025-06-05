'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useDistrict } from '../districts/district-context'

function MainCategorySearch() {
    const { search, setSearch } = useDistrict()
    return <SearchBox value={search} setValue={setSearch} />
}

export default MainCategorySearch