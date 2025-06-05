'use client'
import { GeneralTable } from '@/components/shared/general-table'
import React, { useEffect, useState } from 'react'
import type { Column } from '@/components/shared/general-table'
import { format } from "date-fns"
import Filter from '../../_components/shared/Filter';
import RowActions from '../../_components/shared/row-actions';
import toast from 'react-hot-toast';
import SharedCreateDialog from '@/components/shared/shared-create-dialog';
import { DeleteAlert } from '../../_components/shared/delete-alert';
import { Subdivision } from '@/validations/models/sdm-validation'
import { useSubdivision } from '../subdivisions/subdivision-context'
import { DeleteSubdivision } from '../subdivisions/actions'
import SubdivisionsUpdate from './subdivision-update'
import DistrictSelector from '@/components/district-selector'
import { District } from '@/validations/models/district-validation'

function SubdivisionTable() {
  const [dataToEdit, setDataToEdit] = useState<Subdivision>({
    subdivision_id: "",
    name: "",
    district_id: "",
    created_at: new Date(),
    updated_at: new Date()
  })
  const [district, setDistrict] = useState<District | null>(null)
  const [idToDelete, setIdToDelete] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useSubdivision()
  useEffect(() => {
    const where = district ? [{ key: 'district_id', value: district.district_id }] : []
    fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc", where });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey, district])


  const handleDeleteItem = async () => {
    const loading = toast.loading('Deleting...')
    const res = await DeleteSubdivision({ id: idToDelete })
    if (res.success) {
      toast.success("Deleted", { id: loading })
      refresh()
    }
    else { toast.error("Deleted", { id: loading }) }
    setOpenAlert(false)
  }

  const columns: Column<Subdivision>[] = [
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
      accessor: "subdivision_id",
      alignment: "right",
      render: (_, row) => {
        return <RowActions onDelete={() => {
          setIdToDelete(row.subdivision_id)
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
        <DistrictSelector district={district} setDistrict={(x) => {
          setDistrict(x)
        }}
          clearCallBack={() => {
            setDistrict(null)
          }}
        />
      </div>
      <GeneralTable
        columns={columns}
        data={data}
        rowId='subdivision_id'
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
        title="Update Subdivision"
        description='Make sure to click on update button.'
      >
        <SubdivisionsUpdate data={dataToEdit} setOpen={setOpenUpdate} />
      </SharedCreateDialog>
      <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
    </>
  )
}

export default SubdivisionTable
