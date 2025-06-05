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
import { useMainCategory } from '../main-categories/main-category-context'
import { CategoryCreateSchema, CategoryCreateSchemaType } from '@/validations/models/category-validation'
import { CreateCategory } from '../main-categories/actions'


function CategoryCreate() {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { appendData } = useMainCategory()
  const form = useForm<CategoryCreateSchemaType>({
    resolver: zodResolver(CategoryCreateSchema),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = async (values: CategoryCreateSchemaType) => {
    setLoading(true)
    const res = await CreateCategory(values)
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
        title='Create Category'
        className='max-w-[400px]'
        openNode={
          <Button variant={'outline'} size={"icon"}>
            <Plus />
          </Button>
        }
      >
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
                {loading ? <Loader /> : 'Add'}
              </Button>
            </div>

          </form>

        </Form>
      </SharedCreateDialog>
    </div>
  )
}

export default CategoryCreate