import { Metadata } from 'next'
import React from 'react'
import { SubCategoryProvider } from './sub-category-context'
import { FetchAllSubCategory } from './actions'
import SubCategorySearch from '../_components/sub-category-search'
import SubCategoryCreate from '../_components/sub-category-create'
import SubCategoryTable from '../_components/sub-category-table'

export const metadata: Metadata = {
    title: "Sub Categories"
}

function page() {
    return (
        <SubCategoryProvider fetchFunction={FetchAllSubCategory}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <SubCategorySearch />
                <div className="ml-auto">
                    <SubCategoryCreate />
                </div>
            </div>
            <SubCategoryTable />
        </SubCategoryProvider>
    )
}

export default page