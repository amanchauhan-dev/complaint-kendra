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
import DistrictSelector from '@/components/district-selector'
import { useTaluka } from '../talukas/taluka-context'
import { CreateTaluka } from '../talukas/actions'
import { type TalukaCreate as TalukaCreateType, TalukaCreateSchema } from '@/validations/models/taluka-validation'
import SubdivionSelector from '@/components/subdivision-selector'
import { District } from '@/validations/models/district-validation'
import { Subdivision } from '@/validations/models/sdm-validation'

function TalukaCreate() {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { appendData } = useTaluka()
  const [district, setDistrict] = useState<District | null>(null)
  const [sdm, setSdm] = useState<Subdivision | null>(null)

  const form = useForm<TalukaCreateType>({
    resolver: zodResolver(TalukaCreateSchema),
    defaultValues: {
      name: "",
      subdivision_id: "",
      district_id: "",
      area_code: ""
    }
  })

  const onSubmit = async (values: TalukaCreateType) => {
    console.log(values);

    setLoading(true)
    const res = await CreateTaluka(values)
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
                  <FormLabel>Taluka Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name of taluka' {...field} />
                  </FormControl>
                  <FormDescription>Make sure to enter correct taluka name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area Code</FormLabel>
                  <FormControl>
                    <Input placeholder='Pincode or Area Code' {...field} />
                  </FormControl>
                  <FormDescription>Make sure to enter correct to code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <DistrictSelector district={district} setDistrict={(x) => {
                form.setValue("district_id", x?.district_id || '')
                setDistrict(x)
              }}
                clearCallBack={() => {
                  form.setValue("district_id", '')
                  form.setValue("subdivision_id", '')
                  setDistrict(null)
                  setSdm(null)
                }}
              />
              {form.formState.errors.district_id && <p className='text-sm text-destructive'>{form.formState.errors.district_id.message}</p>}
            </div>
            <div>
              <SubdivionSelector
                clearCallBack={() => {
                  form.setValue("subdivision_id", '')
                  setSdm(null)
                }}
                subdivion={sdm}
                disable={!district}
                setSubdivion={(x) => {
                  form.setValue("subdivision_id", x?.subdivision_id || '')
                  setSdm(x)
                }}
                district_id={district?.district_id}
              />
              {form.formState.errors.subdivision_id && <p className='text-sm text-destructive'>{form.formState.errors.subdivision_id.message}</p>}
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

export default TalukaCreate