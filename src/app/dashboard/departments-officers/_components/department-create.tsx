'use client'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import SharedCreateDialog from '@/components/shared/shared-create-dialog'
import { useDepartment } from '../departments/department-context'
import { CreateDepartment } from '../departments/action'
import { DepartmentCreateSchema, DepartmentCreateSchemaType } from '@/validations/models/department-validation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DistrictSelector from '@/components/district-selector'
import { District } from '@/validations/models/district-validation'
import { Subdivision } from '@/validations/models/sdm-validation'
import { Taluka } from '@/validations/models/taluka-validation'
import SubdivionSelector from '@/components/subdivision-selector'
import TalukaSelector from '@/components/taluka-selector'
import { JurisdictionLevelType } from '@/validations/enums'

function DepartmentCreate() {
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const { appendData } = useDepartment()


    // jusrictions
    const [level, setLevel] = useState<JurisdictionLevelType>("Taluka")
    const [district, setDistrict] = useState<District | null>(null)
    const [sdm, setSdm] = useState<Subdivision | null>(null)
    const [taluka, setTaluka] = useState<Taluka | null>(null)


    const form = useForm<DepartmentCreateSchemaType>({
        resolver: zodResolver(DepartmentCreateSchema),
        defaultValues: {
            name: "",
            contact_number: "",
            contact_person: '',
            email: "",
            jurisdiction_level: '',
            jurisdiction_id: ''
        }
    })

    const onSubmit = async (values: DepartmentCreateSchemaType) => {
        setLoading(true)
        const res = await CreateDepartment(values)
        if (res.success && res.data) {
            appendData(res.data);
            setOpen(false)
            form.reset()
        } else {
            console.log(res.error);
        }
        setLoading(false)
    }


    return (
        <div className='w-full flex'>
            <SharedCreateDialog
                open={open}
                setOpen={setOpen}
                title='Create Department'
                className='!max-w-[700px]'
                openNode={
                    <Button variant={'outline'} size={"icon"}>
                        <Plus />
                    </Button>
                }
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid gap-4 grid-cols-2 my-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter name of department' {...field} />
                                        </FormControl>
                                        <FormDescription>Make sure to enter correct department name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact_person"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Person Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter name of contact person' {...field} />
                                        </FormControl>
                                        <FormDescription>A persone who belongs to this department.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter email' {...field} />
                                        </FormControl>
                                        <FormDescription>Email of contact person.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter name of department' type='number' {...field} value={field?.value?.toString()} />
                                        </FormControl>
                                        <FormDescription>Phone number of contact person.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="jurisdiction_level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Juridiction</FormLabel>
                                        <Select onValueChange={(x) => {
                                            field.onChange(x)
                                            setLevel(x as JurisdictionLevelType)
                                            form.setValue("jurisdiction_id", '')
                                        }} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Choose Juridictiion" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="District">District</SelectItem>
                                                <SelectItem value="Subdivision">Subdivision</SelectItem>
                                                <SelectItem value="Taluka">Taluka</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Make sure to enter correct department level.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {level === "District" ? <FormField
                                control={form.control}
                                name="jurisdiction_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Juridoction</FormLabel>
                                        <FormControl>
                                            <DistrictSelector
                                                className='w-full text-left'
                                                district={district}
                                                setDistrict={(x) => {
                                                    setDistrict(x)
                                                    field.onChange(x?.district_id || '')
                                                }}
                                                clearCallBack={() => {
                                                    setDistrict(null)
                                                    field.onChange('')
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>Make sure to enter correct department name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                : level === "Subdivision" ? <FormField
                                    control={form.control}
                                    name="jurisdiction_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Juridoction</FormLabel>
                                            <FormControl>
                                                <SubdivionSelector
                                                    className='w-full text-left'
                                                    subdivion={sdm}
                                                    setSubdivion={(x) => {
                                                        setSdm(x)
                                                        field.onChange(x?.subdivision_id || '')
                                                    }}
                                                    clearCallBack={() => {
                                                        setSdm(null)
                                                        field.onChange('')
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>Make sure to enter correct department name.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> : <FormField
                                    control={form.control}
                                    name="jurisdiction_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Juridoction</FormLabel>
                                            <FormControl>
                                                <TalukaSelector
                                                    className='w-full text-left'
                                                    taluka={taluka}
                                                    setTaluka={(x) => {
                                                        setTaluka(x)
                                                        field.onChange(x?.taluka_id || '')
                                                    }}
                                                    clearCallBack={() => {
                                                        setTaluka(null)
                                                        field.onChange('')
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>Make sure to enter correct department name.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />}
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

export default DepartmentCreate