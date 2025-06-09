'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import { useDepartment } from '../departments/department-context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DistrictSelector from '@/components/district-selector'
import { District } from '@/validations/models/district-validation'
import { Subdivision } from '@/validations/models/sdm-validation'
import { Taluka } from '@/validations/models/taluka-validation'
import SubdivionSelector from '@/components/subdivision-selector'
import TalukaSelector from '@/components/taluka-selector'
import { JurisdictionLevelType } from '@/validations/enums'
import { DepartmentSelectType, DepartmentUpdateSchema, DepartmentUpdateSchemaType } from '@/validations/models/department-validation'
import { UpdateDepartment } from '../departments/action'


function DepartmentUpdate({ data, setOpen }: { data: DepartmentSelectType, setOpen: (x: boolean) => void }) {
    const { refresh } = useDepartment()
    const [loading, setLoading] = useState<boolean>(false)



    // jusrictions
    const [level, setLevel] = useState<JurisdictionLevelType>(data.jurisdiction_level)
    const [district, setDistrict] = useState<District | null>(data?.district || null)
    const [sdm, setSdm] = useState<Subdivision | null>(data?.subdivision || null)
    const [taluka, setTaluka] = useState<Taluka | null>(data?.taluka || null)



    const form = useForm<DepartmentUpdateSchemaType>({
        resolver: zodResolver(DepartmentUpdateSchema),
        defaultValues: {
            name: data.name,
            department_id: data.department_id,
            contact_number: data.contact_number,
            contact_person: data.contact_person,
            email: data.email,
            jurisdiction_level: data.jurisdiction_level,
            jurisdiction_id: data.jurisdiction_id
        }
    })

    const onSubmit = async (values: DepartmentUpdateSchemaType) => {
        setLoading(true)
        const res = await UpdateDepartment(values)
        if (res.success && res.data) {
            setOpen(false)
            refresh()
        } else {
            console.log(res.error);
        }
        setLoading(false)
    }


    return (
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
                                    form.setValue("jurisdiction_id", '')
                                    setLevel(x as JurisdictionLevelType)
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
                        {loading ? <Loader /> : 'UPDATE'}
                    </Button>
                </div>
            </form>
        </Form>

    )
}

export default DepartmentUpdate