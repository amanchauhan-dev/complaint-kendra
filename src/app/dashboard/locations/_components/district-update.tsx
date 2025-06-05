'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import { District, type DistrictUpdate, DistrictUpdateSchema } from '@/validations/models/district-validation'
import { UpdateDistrict } from '../districts/actions'
import { useDistrict } from '../districts/district-context'


function DistrictUpdate({ data, setOpen }: { data: District, setOpen: (x: boolean) => void }) {
    const { refresh } = useDistrict()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<DistrictUpdate>({
        resolver: zodResolver(DistrictUpdateSchema),
        defaultValues: {
            name: data.name,
            district_id: data.district_id
        }
    })

    const onSubmit = async (values: DistrictUpdate) => {
        setLoading(true)
        const res = await UpdateDistrict(values)
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
            <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>District Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Name of district' {...field} />
                            </FormControl>
                            <FormDescription>Make sure to enter correct district name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button className='w-full'>
                        {loading ? <Loader /> : 'Update'}
                    </Button>
                </div>

            </form>

        </Form>

    )
}

export default DistrictUpdate