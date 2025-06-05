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
import { useSubdivision } from '../subdivisions/subdivision-context'
import { type SubdivisionCreate, SubdivisionCreateSchema } from '@/validations/models/sdm-validation'
import { CreateSubdivision } from '../subdivisions/actions'
import DistrictSelector from '@/components/district-selector'
import { District } from '@/validations/models/district-validation'

function SubdivisionCreate() {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { appendData } = useSubdivision()
  const [district, setDistrict] = useState<District | null>(null)
  const form = useForm<SubdivisionCreate>({
    resolver: zodResolver(SubdivisionCreateSchema),
    defaultValues: {
      name: "",
      district_id: ""
    }
  })

  const onSubmit = async (values: SubdivisionCreate) => {
    setLoading(true)
    const res = await CreateSubdivision(values)
    if (res.success && res.data) {
      appendData(res.data);

      setOpen(false)
      form.reset()
      setDistrict(null)
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
        title='Create Sub-Divison'
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
              <DistrictSelector district={district} setDistrict={(x) => {
                setDistrict(x)
                form.setValue('district_id', x?.district_id || '')
              }}
                clearCallBack={() => {
                  form.setValue("district_id", '')
                  setDistrict(null)
                }}
              />
              {form.formState.errors.district_id && <p className='text-sm text-destructive'>{form.formState.errors.district_id.message}</p>}
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

export default SubdivisionCreate