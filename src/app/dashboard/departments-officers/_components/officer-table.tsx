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
import { OfficerSelectSchemaType } from '@/validations/models/officer-validation'
import { useOfficer } from '../officers/officer-context'
import { DeleteOfficer } from '../officers/action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OfficerUpdate from './officer-update'

function OfficerTable() {
    const [dataToEdit, setDataToEdit] = useState<OfficerSelectSchemaType>({
        department_id: "",
        officer_id: "",
        user_id: '',
        designation: "",
        created_at: new Date(),
        updated_at: new Date(),
    })
    const [idToDelete, setIdToDelete] = useState<string>('')
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useOfficer()
    useEffect(() => {
        fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc" });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey])


    const handleDeleteItem = async () => {
        const loading = toast.loading('Deleting...')
        const res = await DeleteOfficer({ id: idToDelete })
        if (res.success) {
            toast.success("Deleted", { id: loading })
            refresh()
        }
        else { toast.error("Deleted", { id: loading }) }
        setOpenAlert(false)
    }

    const columns: Column<OfficerSelectSchemaType>[] = [
        {
            header: "Image", accessor: "user", render: (_, row) => {
                return <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage loading="lazy" src={row.user?.profile_picture || ''} alt={row?.user?.full_name} className="object-center" />
                    <AvatarFallback className="rounded-full bg-primary/90 dark:bg-primary/60 text-white">{
                        row.user?.full_name?.charAt(0)
                    }</AvatarFallback>
                </Avatar>
            }
        },
        {
            header: "Name", accessor: "user", render: (_, row) => {
                return row.user?.full_name
            }
        },
        {
            header: "Designation", alignment: "center", accessor: "designation", render: (value) => {
                return <Badge variant={'outline'} >
                    {value}
                </Badge>
            }
        },
        {
            header: "Department", alignment: "center", accessor: "department", render: (_, row) => {
                return <Badge variant={'outline'} >
                    {row.department?.name}
                </Badge>
            }
        },
        {
            header: "Jurisdiction", alignment: "center", accessor: "designation", render: (_, row) => {
                return <Badge variant={'outline'} >
                    {row.department?.district?.name}
                    {row.department?.subdivision?.name}
                    {row.department?.taluka?.name}
                </Badge>
            }
        },
        {
            header: "Jurisdiction Level", alignment: "center", accessor: "designation", render: (_, row) => {
                return <Badge variant={'outline'} >
                    {row.department?.jurisdiction_level}
                </Badge>
            }
        },
        {
            header: "Actions",
            accessor: "officer_id",
            alignment: "right",
            render: (_, row) => {
                return <RowActions onDelete={() => {
                    setIdToDelete(row.officer_id)
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
                rowId="officer_id"
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
                title="Update Officer"
                description='Make sure to click on update button.'
            >
                <OfficerUpdate data={dataToEdit} setOpen={setOpenUpdate} />
            </SharedCreateDialog>
            <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
        </>
    )
}

export default OfficerTable
