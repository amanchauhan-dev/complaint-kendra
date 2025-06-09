import { Metadata } from 'next'
import React from 'react'
import { DepartmentProvider } from './department-context'
import { FetchAllDepartments } from './action'
import DepartmentCreate from '../_components/department-create'
import DepartmentsTable from '../_components/department-table'
import DepartmentSearch from '../_components/department-search'

export const metadata: Metadata = {
    title: "Department"
}
function page() {
    return (
        <DepartmentProvider fetchFunction={FetchAllDepartments}>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                <DepartmentSearch />
                <div className="ml-auto">
                    <DepartmentCreate />
                </div>
            </div>
            <DepartmentsTable />
        </DepartmentProvider>
    )
}

export default page