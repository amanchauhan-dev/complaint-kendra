'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useMainCategory } from '../main-categories/main-category-context'

function CategorySearch() {
    const { search, setSearch } = useMainCategory()
    return <SearchBox value={search} setValue={setSearch} />
}

export default CategorySearch