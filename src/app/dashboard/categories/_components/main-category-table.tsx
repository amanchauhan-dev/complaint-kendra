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
import { useMainCategory } from '../main-categories/main-category-context';
import { DeleteCategory } from '../main-categories/actions';
import { Category } from '@/validations/models/category-validation'
import CategoryUpdate from './main-category-update'

function CategoryTable() {
  const [dataToEdit, setDataToEdit] = useState<Category>({
    category_id: "",
    name: "",
    parent_id: null,
    created_at: new Date(),
    updated_at: new Date()
  })
  const [idToDelete, setIdToDelete] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useMainCategory()
  useEffect(() => {
    fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc" });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey])


  const handleDeleteItem = async () => {
    const loading = toast.loading('Deleting...')
    const res = await DeleteCategory({ id: idToDelete })
    if (res.success) {
      toast.success("Deleted", { id: loading })
      refresh()
    }
    else { toast.error("Deleted", { id: loading }) }
    setOpenAlert(false)
  }

  const columns: Column<Category>[] = [
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
      accessor: "category_id",
      alignment: "right",
      render: (_, row) => {
        return <RowActions onDelete={() => {
          setIdToDelete(row.category_id)
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
        rowId="category_id"
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
        title="Update Category"
        description='Make sure to click on update button.'
      >
        <CategoryUpdate data={dataToEdit} setOpen={setOpenUpdate} />
      </SharedCreateDialog>
      <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
    </>
  )
}

export default CategoryTable
