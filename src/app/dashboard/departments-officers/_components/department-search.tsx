'use client'
import React from 'react'
import SearchBox from '../../_components/search-box'
import { useDepartment } from '../departments/department-context'

function DepartmentSearch() {
    const { search, setSearch } = useDepartment()
    return <SearchBox value={search} setValue={setSearch} />
}

export default DepartmentSearch