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
import { type DistrictCreate, DistrictCreateSchema } from '@/validations/models/district-validation'
import { CreateDistrict } from '../districts/actions'
import { useDistrict } from '../districts/district-context'

function DistrictCreate() {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { appendData } = useDistrict()
  const form = useForm<DistrictCreate>({
    resolver: zodResolver(DistrictCreateSchema),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = async (values: DistrictCreate) => {
    setLoading(true)
    const res = await CreateDistrict(values)
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
        title='Create District'
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
                {loading ? <Loader /> : 'Add'}
              </Button>
            </div>

          </form>

        </Form>
      </SharedCreateDialog>
    </div>
  )
}

export default DistrictCreate