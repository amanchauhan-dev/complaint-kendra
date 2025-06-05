'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import { Subdivision, SubdivisionUpdate, SubdivisionUpdateSchema } from '@/validations/models/sdm-validation'
import { UpdateSubdivision } from '../subdivisions/actions'
import { useSubdivision } from '../subdivisions/subdivision-context'


function SubdivisionsUpdate({ data, setOpen }: { data: Subdivision, setOpen: (x: boolean) => void }) {
    const { refresh } = useSubdivision()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<SubdivisionUpdate>({
        resolver: zodResolver(SubdivisionUpdateSchema),
        defaultValues: {
            name: data.name,
            subdivision_id: data.subdivision_id
        }
    })

    const onSubmit = async (values: SubdivisionUpdate) => {
        setLoading(true)
        const res = await UpdateSubdivision(values)
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

export default SubdivisionsUpdate