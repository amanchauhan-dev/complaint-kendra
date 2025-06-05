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
import { useSubCategory } from '../sub-categories/sub-category-context'
import { Category, SubCategoryCreateSchema, SubCategoryCreateSchemaType } from '@/validations/models/category-validation'
import { CreateSubCategory } from '../sub-categories/actions'
import ParentCategorySelector from '@/components/parent-category-selector'

function SubCategoryCreate() {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [category, setcategory] = useState<Category | null>(null)
  const { appendData } = useSubCategory()
  const form = useForm<SubCategoryCreateSchemaType>({
    resolver: zodResolver(SubCategoryCreateSchema),
    defaultValues: {
      name: "",
      parent_id: ""
    }
  })

  const onSubmit = async (values: SubCategoryCreateSchemaType) => {
    setLoading(true)
    const res = await CreateSubCategory(values)
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
        title='Create Sub Category'
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
                  <FormLabel>Sub Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name of sub category' {...field} />
                  </FormControl>
                  <FormDescription>Make sure to enter correct sub category name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <ParentCategorySelector parentCategory={category} setParentCategory={(x) => {
                setcategory(x)
                form.setValue("parent_id", x?.category_id || '')
                form.clearErrors("parent_id")
              }}
                clearCallBack={() => {
                  form.setError("parent_id", { message: "Required" })
                }}
              />
              {form.formState.errors.parent_id && <p className='text-sm text-red-600'>{form.formState.errors.parent_id.message}</p>}
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

export default SubCategoryCreate