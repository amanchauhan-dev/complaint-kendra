'use client'
import { GeneralTable } from '@/components/shared/general-table'
import React, { useEffect, useState } from 'react'
import type { Column } from '@/components/shared/general-table'
import { District } from '@/validations/models/district-validation';
import { format } from "date-fns"
import { useDistrict } from '../districts/district-context';
import Filter from '../../_components/shared/Filter';
import RowActions from '../../_components/shared/row-actions';
import { DeleteDistrict } from '../districts/actions';
import toast from 'react-hot-toast';
import SharedCreateDialog from '@/components/shared/shared-create-dialog';
import DistrictUpdate from './district-update';
import { DeleteAlert } from '../../_components/shared/delete-alert';

function DistrictTable() {
  const [dataToEdit, setDataToEdit] = useState<District>({
    district_id: "",
    name: "",
    created_at: new Date(),
    updated_at: new Date()
  })
  const [idToDelete, setIdToDelete] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useDistrict()
  useEffect(() => {
    fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc" });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey])


  const handleDeleteItem = async () => {
    const loading = toast.loading('Deleting...')
    const res = await DeleteDistrict({ id: idToDelete })
    if (res.success) {
      toast.success("Deleted", { id: loading })
      refresh()
    }
    else { toast.error("Deleted", { id: loading }) }
    setOpenAlert(false)
  }

  const columns: Column<District>[] = [
    { header: "Name", accessor: "name" },
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
      header: "Actions",
      accessor: "district_id",
      alignment: "right",
      render: (_, row) => {
        return <RowActions onDelete={() => {
          setIdToDelete(row.district_id)
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
        rowId='district_id'
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
        setOpen={setOpenUpdate}
        openNode={<span></span>}
        title="Update District"
        description='Make sure to click on update button.'
      >
        <DistrictUpdate data={dataToEdit} setOpen={setOpenUpdate} />
      </SharedCreateDialog>
      <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
    </>
  )
}

export default DistrictTable
