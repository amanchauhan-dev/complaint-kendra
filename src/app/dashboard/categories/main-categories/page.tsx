import { Metadata } from 'next'
import React from 'react'
import { MainCategoryProvider } from './main-category-context'
import { FetchAllCategory } from './actions'
import CategorySearch from '../_components/main-category-search'
import CategoryCreate from '../_components/main-category-create'
import CategoryTable from '../_components/main-category-table'

export const metadata: Metadata = {
    title: "Sub Categories"
}

function page() {
    return (
        <MainCategoryProvider fetchFunction={FetchAllCategory}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <CategorySearch />
                <div className="ml-auto">
                    <CategoryCreate />
                </div>
            </div>
            <CategoryTable />
        </MainCategoryProvider>
    )
}

export default page