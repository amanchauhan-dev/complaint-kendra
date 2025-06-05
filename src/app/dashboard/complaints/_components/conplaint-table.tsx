'use client'
import { GeneralTable } from '@/components/shared/general-table'
import React, { useEffect } from 'react'
import type { Column } from '@/components/shared/general-table'
import { format } from "date-fns"
import Filter from '../../_components/shared/Filter';
import { useComplaints } from '../complaint-context';
import { ComplaintFetchschemaType } from '@/validations/models/complaint-validation';
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgressBarLink } from '@/contexts/progress-bar-provider'

function ComaplaintsTable() {

    const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refreshKey } = useComplaints()
    useEffect(() => {
        fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc" });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey])

    // useEffect(() => console.log(data), [data])

    const columns: Column<ComplaintFetchschemaType>[] = [
        { header: "Title", accessor: "title" },
        {
            header: "Category", accessor: "category", render: (_, row) => {
                return (
                    <Badge variant={'outline'}>{row.category?.name || "Other"}</Badge>
                )
            },
            alignment: "center"
        },
        {
            header: "Status", accessor: "status", render: (_, row) => {
                let comp = <Badge variant={'outline'} className='bg-yellow-600 border-yellow-600 text-white'>{row.status}</Badge>
                switch (row.status) {
                    case "IN_PROGRESS":
                        comp = <Badge variant={'outline'} className='bg-pink-600 border-pink-600 text-white'>{row.status}</Badge>
                        break;
                    case "REJECTED":
                        comp = <Badge variant={'outline'} className='bg-red-600 border-red-600 text-white'>{row.status}</Badge>
                        break;
                    case 'RESOLVED':
                        comp = <Badge variant={'outline'} className='bg-green-600 border-green-600 text-white'>{row.status}</Badge>
                        break;

                    default:
                        break;
                }
                return comp
            },
            alignment: "center"
        },
        {
            header: "Taluka", accessor: "address", render: (_, row) => {
                return (
                    <Badge variant={'outline'}>{row.address?.taluka?.name || "Unknow"}</Badge>
                )
            },
            alignment: "center"
        },
        {
            header: "Created At",
            accessor: "created_at",
            render: (value: string) => <span className="capitalize">{format(new Date(value), "dd MMMM yyyy")}</span>,
        },
        {
            header: "Updated At",
            accessor: "updated_at",
            render: (value: string) => <span className="capitalize">{format(new Date(value), "dd MMMM yyyy")}</span>,
        },
        {
            header: "Action",
            accessor: "complaint_id",
            render: (_, row) => <ProgressBarLink href={'/dashboard/complaints/' + row.complaint_id}><Button size={'icon'} variant={'ghost'}><Eye /></Button></ProgressBarLink>,
            alignment: "right"
        },
    ];

    return (
        <>
            {/* filters */}
            <div className="flex gap-2 items-center flex-wrap">
                <Filter
                    fields={[{ name: "name", value: "name" }, { name: "Created Date", value: "created_at" }, { name: "Updation Date", value: "updated_at" }]}
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
                rowId="complaint_id"
                // onSelectionChange={(rows) => {
                // console.log("Selected rows:", rows);
                // }}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                totalCount={totalData}
                page={currentPage}
                loading={loading}
            />
        </>
    )
}

export default ComaplaintsTable
