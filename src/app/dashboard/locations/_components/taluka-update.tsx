'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import { Taluka, type TalukaUpdate as TalukaUpdateType, TalukaUpdateSchema } from '@/validations/models/taluka-validation'
import { useTaluka } from '../talukas/taluka-context'
import { UpdateTaluka } from '../talukas/actions'



function TalukaUpdate({ data, setOpen }: { data: Taluka, setOpen: (x: boolean) => void }) {
    const { refresh } = useTaluka()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<TalukaUpdateType>({
        resolver: zodResolver(TalukaUpdateSchema),
        defaultValues: {
            name: data.name,
            subdivision_id: data.subdivision_id,
            taluka_id: data.taluka_id,
            area_code: data.area_code
        }
    })

    const onSubmit = async (values: TalukaUpdateType) => {
        setLoading(true)
        const res = await UpdateTaluka(values)
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

export default TalukaUpdate