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
import { Category, SubCategory } from '@/validations/models/category-validation'
import { useSubCategory } from '../sub-categories/sub-category-context'
import { DeleteSubCategory } from '../sub-categories/actions'
import SubCategoryUpdate from './sub-category-update'
import ParentCategorySelector from '@/components/parent-category-selector'

function SubCategoryTable() {
  const [dataToEdit, setDataToEdit] = useState<SubCategory>({
    category_id: "",
    name: "",
    parent_id: '',
    created_at: new Date(),
    updated_at: new Date()
  })
  const [parent, setParent] = useState<Category | null>(null)
  const [idToDelete, setIdToDelete] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useSubCategory()

  useEffect(() => {
    const where = []
    if (parent) {
      where.push({ key: "parent_id", value: parent.category_id })
    }
    fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc", where });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey, parent])


  const handleDeleteItem = async () => {
    const loading = toast.loading('Deleting...')
    const res = await DeleteSubCategory({ id: idToDelete })
    if (res.success) {
      toast.success("Deleted", { id: loading })
      refresh()
    }
    else { toast.error("Deleted", { id: loading }) }
    setOpenAlert(false)
  }

  const columns: Column<SubCategory>[] = [
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
        <ParentCategorySelector parentCategory={parent} setParentCategory={setParent} />
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
        title="Update Sub Category"
        description='Make sure to click on update button.'
      >
        <SubCategoryUpdate data={dataToEdit} setOpen={setOpenUpdate} />
      </SharedCreateDialog>
      <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
    </>
  )
}

export default SubCategoryTable
