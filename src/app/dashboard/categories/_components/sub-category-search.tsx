'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useSubCategory } from '../sub-categories/sub-category-context'

function SubCategorySearch() {
    const { search, setSearch } = useSubCategory()
    return <SearchBox value={search} setValue={setSearch} />
}

export default SubCategorySearch