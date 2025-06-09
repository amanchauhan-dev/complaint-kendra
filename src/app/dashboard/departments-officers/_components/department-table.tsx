'use client'
import { GeneralTable } from '@/components/shared/general-table'
import React, { useEffect, useState } from 'react'
import type { Column } from '@/components/shared/general-table'
import toast from 'react-hot-toast'
import RowActions from '@/app/dashboard/_components/shared/row-actions'
import Filter from '@/app/dashboard/_components/shared/Filter'
import SharedCreateDialog from '@/components/shared/shared-create-dialog'
import { DeleteAlert } from '@/app/dashboard/_components/shared/delete-alert'
import { Badge } from '@/components/ui/badge'
import { Department, DepartmentSelectType } from '@/validations/models/department-validation'
import { useDepartment } from '../departments/department-context'
import { DeleteDepartment } from '../departments/action'
import { cn } from '@/lib/utils'
import DepartmentUpdate from './department-update'

function DepartmentsTable() {
    const [dataToEdit, setDataToEdit] = useState<Department>({
        department_id: "",
        name: "",
        contact_person: "",
        jurisdiction_level: "Taluka",
        jurisdiction_id: "",
        email: "",
        contact_number: "",
        created_at: new Date(),
        updated_at: new Date(),
    })
    const [idToDelete, setIdToDelete] = useState<string>('')
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useDepartment()
    useEffect(() => {
        fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc" });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey])


    const handleDeleteItem = async () => {
        const loading = toast.loading('Deleting...')
        const res = await DeleteDepartment({ id: idToDelete })
        if (res.success) {
            toast.success("Deleted", { id: loading })
            refresh()
        }
        else { toast.error("Deleted", { id: loading }) }
        setOpenAlert(false)
    }

    const columns: Column<DepartmentSelectType>[] = [
        { header: "Name", accessor: "name", },
        {
            header: "Juridiction", accessor: "jurisdiction_id", render: (_, row) => {
                return <Badge variant={'outline'} >
                    {row.district && row.district.name}
                    {row.subdivision && row.subdivision.name}
                    {row.taluka && row.taluka.name}
                </Badge>
            }
        },
        {
            header: "Juridiction", accessor: "jurisdiction_level", render: (value) => {
                return <Badge

                    className={cn({
                        "bg-green-600": value === 'District',
                        "bg-yellow-600": value === 'Taluka',
                        "bg-pink-600": value === 'Subdivision',
                    })}
                >
                    {value}
                </Badge>
            }
        },
        { header: "Contact Person", accessor: "contact_person" },
        {
            header: "Email", accessor: "email", render: ((value) => {
                return (
                    <Badge variant={'outline'}>{value}</Badge>)
            })
        },

        {
            header: "Actions",
            accessor: "department_id",
            alignment: "right",
            render: (_, row) => {
                return <RowActions onDelete={() => {
                    setIdToDelete(row.department_id)
                    setOpenAlert(true)
                }}
                    onEdit={() => {
                        setDataToEdit(row)
                        setOpenUpdate(true)
                    }}
                />
            },
        },
    ];

    return (
        <>
            {/* filters */}
            <div className="flex gap-2 items-center flex-wrap">
                <Filter
                    fields={
                        [
                            { name: "Name", value: "name" },
                            { name: "Created Date", value: "created_at" },
                            { name: "Updation Date", value: "updated_at" }
                        ]}
                    label='Fields'
                    placeholder='Order By Fields'
                    value={sortField}
                    setValue={setSortFiled}
                />

                <Filter
                    fields={[{ name: "Ascending", value: "asc" }, { name: "Descending", value: "desc" }]}
                    label='Orders'
                    placeholder='Order By Sequence'
                    value={sortOrder}
                    setValue={setSortOrder}
                />
                <Filter
                    fields={[{ name: "10", value: "10" }, { name: "25", value: "25" }, { name: "50", value: "50" }, { name: "100", value: "100" }]}
                    label='Rows'
                    placeholder='Number Of Rows'
                    value={pageSize.toString()}
                    setValue={(x: string) => setPageSize(Number(x))}
                />
            </div>
            <GeneralTable
                columns={columns}
                data={data}
                rowId="department_id"
                // onSelectionChange={(rows) => {
                // console.log("Selected rows:", rows);
                // }}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                totalCount={totalData}
                page={currentPage}
                loading={loading}
            />
            <SharedCreateDialog
                open={openUpdate}
                className='!max-w-[700px]'
                setOpen={setOpenUpdate}
                openNode={<span></span>}
                title="Update Department"
                description='Make sure to click on update button.'
            >
                <DepartmentUpdate data={dataToEdit} setOpen={setOpenUpdate} />
            </SharedCreateDialog>
            <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
        </>
    )
}

export default DepartmentsTable
