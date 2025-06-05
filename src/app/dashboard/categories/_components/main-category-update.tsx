'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import { Category, CategoryUpdateSchema, CategoryUpdateSchemaType } from '@/validations/models/category-validation'
import { UpdateCategory } from '../main-categories/actions'
import { useMainCategory } from '../main-categories/main-category-context'


function CategoryUpdate({ data, setOpen }: { data: Category, setOpen: (x: boolean) => void }) {
    const { refresh } = useMainCategory()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<CategoryUpdateSchemaType>({
        resolver: zodResolver(CategoryUpdateSchema),
        defaultValues: {
            name: data.name,
            category_id: data.category_id
        }
    })

    const onSubmit = async (values: CategoryUpdateSchemaType) => {
        setLoading(true)
        const res = await UpdateCategory(values)
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
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Name of category' {...field} />
                            </FormControl>
                            <FormDescription>Make sure to enter correct category name.</FormDescription>
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

export default CategoryUpdate