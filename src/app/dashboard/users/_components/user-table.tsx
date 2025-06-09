'use client'
import { GeneralTable } from '@/components/shared/general-table'
import React, { useEffect, useState } from 'react'
import type { Column } from '@/components/shared/general-table'
import { UserSelectMultipleSchemaType } from '@/validations/models/user-validation'
import { useUser } from '../user-context'
import { DeleteUser } from '../action'
import toast from 'react-hot-toast'
import RowActions from '@/app/dashboard/_components/shared/row-actions'
import Filter from '@/app/dashboard/_components/shared/Filter'
import SharedCreateDialog from '@/components/shared/shared-create-dialog'
import { DeleteAlert } from '@/app/dashboard/_components/shared/delete-alert'
import UserUpdate from './user-update'
import { Badge } from '@/components/ui/badge'
import { Mars, Transgender, Venus } from 'lucide-react'
import { RoleSchema, RoleType } from '@/validations/enums'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function UserTable() {
  const [dataToEdit, setDataToEdit] = useState<UserSelectMultipleSchemaType>({
    user_id: "",
    full_name: "",
    email: "",
    contact_number: "",
    gender: 'male',
    status: 'active',
    date_of_birth: new Date(),
    address_id: "",
    aadhaar_number: "",
    role: "citizen",
    last_login: new Date(),
    profile_picture: '',
    created_at: new Date(),
    updated_at: new Date(),
    address: null
  })
  const [idToDelete, setIdToDelete] = useState<string>('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const { loading, fetchData, search, data, pageSize, sortField, setSortFiled, sortOrder, setSortOrder, setPageSize, currentPage, totalData, setCurrentPage, refresh, refreshKey } = useUser()
  const [role, setRole] = useState<RoleType | 'all'>('all')
  useEffect(() => {
    const where = []
    if (role && role !== 'all') {
      where.push({ key: "role", value: role })
    }
    fetchData({ pageSize, search, currentPage, sortField, sortOrder: sortOrder == 'asc' ? "asc" : "desc", where });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortOrder, sortField, currentPage, search, refreshKey, role])


  const handleDeleteItem = async () => {
    const loading = toast.loading('Deleting...')
    const res = await DeleteUser({ id: idToDelete })
    if (res.success) {
      toast.success("Deleted", { id: loading })
      refresh()
    }
    else { toast.error("Deleted", { id: loading }) }
    setOpenAlert(false)
  }

  const columns: Column<UserSelectMultipleSchemaType>[] = [
    {
      header: "Image", accessor: "profile_picture", render: (((value, row) => {
        return (
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage loading="lazy" src={value || ''} alt={row.full_name} className="object-contain" />
            <AvatarFallback className="rounded-full bg-primary/90 dark:bg-primary/60 text-white">{
              row.full_name.charAt(0)
            }</AvatarFallback>
          </Avatar>
        )
      }))
    },
    { header: "Name", accessor: "full_name" },
    { header: "Email", accessor: "email" },
    {
      header: "Gender", accessor: "gender", render: ((_, row) => {
        return (
          <Badge variant={'outline'}>
            {row.gender == 'male' ? <Mars />
              : row.gender == 'female' ? <Venus />
                : <Transgender />}{row.gender}</Badge>)
      })
    },
    {
      header: "Role", accessor: "role", render: ((_, row) => {
        return (
          <Badge variant={'outline'}
            className={
              row.role == 'admin' ? 'bg-red-600' :
                row.role == "superadmin" ? 'bg-indigo-600' :
                  row.role == "mamlatdar_office" ? 'bg-green-600' :
                    row.role == "department_officer" ? 'bg-blue-600' :
                      row.role == "collectorate_office" ? 'bg-pink-600' :
                        row.role == "sdm_office" ? 'bg-cyan-600' : 'bg-transparent'
            }
          >
            {row.role}
          </Badge>
        )
      })
    },
    {
      header: "Status", accessor: "status", render: ((_, row) => {
        return (
          <Badge className={
            row.status == 'active' ? 'bg-green-600/30'
              : 'bg-destructive/30'}>
            {row.status}
          </Badge>
        )
      })
    },

    {
      header: "Actions",
      accessor: "user_id",
      alignment: "right",
      render: (_, row) => {
        return <RowActions onDelete={() => {
          setIdToDelete(row.user_id)
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
              { name: "Name", value: "full_name" },
              { name: "Email", value: "email" },
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
        <Filter
          fields={
            [
              { name: "All", value: "all" },
              { name: "Cirizen", value: "citizen" },
              { name: "Department Officer", value: "department_officer" },
              { name: "Mamlatdar Officer", value: "mamlatdar_office" },
              { name: "Subdivision Officer", value: "sdm_office" },
              { name: "Collectorate Officer", value: "collectorate_office" },
              { name: "Admins", value: "admin" },
            ]
          }
          label='Roles'
          placeholder='Select By Role'
          value={role || ''}
          setValue={(x) => {
            if (x !== null && x !== 'all' && RoleSchema.options.includes(x as RoleType)) {
              setRole(x as RoleType)
            } else {
              setRole('all')
            }
          }}
        />
      </div>
      <GeneralTable
        columns={columns}
        data={data}
        rowId="user_id"
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
        className='!max-w-[90vw]'
        setOpen={setOpenUpdate}
        openNode={<span></span>}
        title="Update User"
        description='Make sure to click on update button.'
      >
        <UserUpdate data={dataToEdit} setOpen={setOpenUpdate} />
      </SharedCreateDialog>
      <DeleteAlert openNode={<span></span>} setOpen={setOpenAlert} open={openAlert} onAggre={handleDeleteItem} />
    </>
  )
}

export default UserTable
