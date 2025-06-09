'use client'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import SharedCreateDialog from '@/components/shared/shared-create-dialog'
import { useOfficer } from '../officers/officer-context'
import { OfficerCreateSchema, OfficerCreateSchemaType } from '@/validations/models/officer-validation'
import { CreateOfficer } from '../officers/action'
import DepartmentSelector from '@/components/department-selector'
import { Department } from '@/validations/models/department-validation'
import { Skeleton } from '@/components/ui/skeleton'
import { UserSingleSelectType } from '@/validations/models/user-validation'
import { FetchUserByEmail } from '../../users/action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function OfficerCreate() {
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const { refresh } = useOfficer()
    const [department, setDepartment] = useState<Department | null>(null)
    const [user, setUser] = useState<UserSingleSelectType | null>(null)
    const [email, setEmail] = useState<string>('')
    const [loadingUser, setLoadingUser] = useState<boolean>(false)

    const form = useForm<OfficerCreateSchemaType>({
        resolver: zodResolver(OfficerCreateSchema),
        defaultValues: {
            user_id: '',
            designation: "",
            department_id: ""
        }
    })

    const onSubmit = async (values: OfficerCreateSchemaType) => {
        setLoading(true)
        const res = await CreateOfficer(values)
        if (res.success && res.data) {
            refresh()
            setOpen(false)
            form.reset()
        } else {
            console.log(res.error);
        }
        setLoading(false)
    }

    const fetchUser = async () => {
        setLoadingUser(true)
        const res = await FetchUserByEmail({ email, role: "department_officer" })
        if (res.success && res.data) {
            setUser(res.data)
            form.setValue("user_id", res.data.user_id || '')
            form.clearErrors("user_id")
        } else {
            setUser(null)
            form.setValue("user_id", '')
            form.setError("user_id", { message: "Required" })
        }
        setLoadingUser(false)
    }

    return (
        <div className='w-full flex'>
            <SharedCreateDialog
                open={open}
                setOpen={setOpen}
                title='Create Officer'
                className='!max-w-[700px]'
                openNode={
                    <Button variant={'outline'} size={"icon"}>
                        <Plus />
                    </Button>
                }
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className='text-sm text-muted-foreground'>Note: Admins can&apos;t become officer.</h1>
                        <div className='grid gap-4 grid-cols-2 my-4'>
                            <div className='col-span-2'>
                                <div className={cn(' h-56 border-2 rounded-lg flex flex-wrap items-center p-4 gap-3', {
                                    "border-destructive": form.formState.errors.user_id
                                })}>
                                    {loadingUser ?
                                        <>
                                            <Skeleton className='w-36 h-36 rounded-full' />
                                            <div className='flex-auto flex flex-col gap-3'>
                                                <Skeleton className='w-[50%] h-8 rounded-md' />
                                                <Skeleton className='w-full h-4 rounded-md' />
                                                <Skeleton className='w-full h-4 rounded-md' />
                                                <Skeleton className='w-[20%] h-4 rounded-md' />
                                            </div>
                                        </>
                                        : user ?
                                            <>
                                                <Avatar className="h-36 w-36 rounded-full">
                                                    <AvatarImage loading="lazy" src={user.profile_picture || ''} alt={user.full_name} className="object-center" />
                                                    <AvatarFallback className="rounded-full bg-primary/90 text-4xl dark:bg-primary/60 text-white">{
                                                        user.full_name?.charAt(0)
                                                    }</AvatarFallback>
                                                </Avatar>
                                                <div className='flex-auto flex flex-col gap-1'>
                                                    <h1>{user.full_name}</h1>
                                                    <h1 className='text-muted-foreground text-sm'>{user.email}</h1>
                                                    <h1 className='text-muted-foreground text-sm'>{user.contact_number}</h1>
                                                    <p className="space-x-2.5">
                                                        <Badge variant={'outline'}>
                                                            {user.gender.toLocaleUpperCase()}
                                                        </Badge>
                                                        <Badge variant={'outline'}>
                                                            {user.role.toLocaleUpperCase()}
                                                        </Badge>
                                                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                                            {user.status.toLocaleUpperCase()}
                                                        </Badge>
                                                    </p>
                                                </div>
                                            </>
                                            : <Badge variant={"destructive"} className='m-auto'>User Not Found</Badge>
                                    }
                                </div>
                                {form.formState.errors.user_id && <p className='text-sm text-destructive'>{form.formState.errors.user_id.message}</p>}
                            </div>

                            <div className='col-span-2 flex gap-2 items-center'>
                                <Input placeholder='Email of Officer' value={email} onChange={(x) => setEmail(x.target.value)} />
                                <Button type='button' size={'icon'} onClick={fetchUser}><Search /></Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="designation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter designation of officer' {...field} />
                                        </FormControl>
                                        <FormDescription>Post of officer</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <DepartmentSelector
                                                className='w-full text-left'
                                                department={department}
                                                setDepartment={(x) => {
                                                    setDepartment(x)
                                                    field.onChange(x?.department_id || '')
                                                }}
                                                clearCallBack={() => {
                                                    field.onChange('')
                                                    setDepartment(null)
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>Make sure to select correct department name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <Button className='w-full'>
                                {loading ? <Loader /> : 'Add'}
                            </Button>
                        </div>

                    </form>

                </Form>
            </SharedCreateDialog>
        </div>
    )
}

export default OfficerCreate