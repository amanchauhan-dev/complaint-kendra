'use client'
import { Button } from '@/components/ui/button'
import { Edit2, ImagePlus, Plus, Trash } from 'lucide-react'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import SharedCreateDialog from '@/components/shared/shared-create-dialog'
import { CreateUserSchema, CreateUserSchemaType } from '@/validations/models/user-validation'
import { useUser } from '../user-context'
import { CreateUser } from '../action'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DistrictSelector from '@/components/district-selector'
import TalukaSelector from '@/components/taluka-selector'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import { checkUniqueFields } from '@/app/(auth)/action'
import { District } from '@/validations/models/district-validation'
import { Taluka } from '@/validations/models/taluka-validation'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
function UserCreate() {
  const [loading, setLoading] = useState<boolean>(false)
  const [district, setDistrict] = useState<District | null>(null)
  const [taluka, setTaluka] = useState<Taluka | null>(null)

  const [open, setOpen] = useState<boolean>(false)
  const { appendData } = useUser()
  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      full_name: "",
      email: "",
      profile_picture: null,
      password: "",
      confirmPassword: "",
      date_of_birth: '',
      role: "citizen",
      contact_number: "",
      aadhaar_number: '',
      address: {
        full_address: "",
        taluka_id: '',
        district_id: ""
      },
      gender: ''
    }
  })

  const onSubmit = async (values: CreateUserSchemaType) => {
    if (form.getValues("profile_picture") == null) {
      toast.error("All fields are reuired")
      form.setError("profile_picture", { message: "Required" })
      return
    }
    setLoading(true)
    const uniqueRes = await checkUniqueFields(form.getValues('email'), form.getValues("aadhaar_number"));
    if (!uniqueRes.success && uniqueRes.data) {
      uniqueRes.data.forEach(e => {
        if (e == 'email') { form.setError(e, { message: "Email is in use." }) }
        if (e == 'aadhaar_number') { form.setError(e, { message: "Aadhaar number is in use." }) }
      })
      setLoading(false)
      return
    }
    const res = await CreateUser(values)
    if (res.success && res.data) {
      appendData(res.data);
      toast.success('Created');
      setOpen(false)
      form.reset()
      setDistrict(null)
      setTaluka(null)
    } else {
      toast.error(res.error);
    }
    setLoading(false)
  }

  const [file, setFile] = useState<File | null>(form.getValues("profile_picture"))
  const [url, setUrl] = useState<string | null>(
    form.getValues("profile_picture") != null ? URL.createObjectURL(form.getValues("profile_picture") as File) : null)
  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0]
      setUrl(URL.createObjectURL(image))
      setFile(e.target.files[0])
      form.setValue("profile_picture", image)
    }
  }
  const handleDeleteImage = () => {
    setUrl(null)
    setFile(null)
    form.setValue("profile_picture", null)
    form.setError("profile_picture", { message: 'Required' })
  }

  return (
    <div className='w-full flex'>
      <SharedCreateDialog
        open={open}
        setOpen={setOpen}
        title='Create User'
        className='!max-w-[90vw]'
        openNode={
          <Button variant={'outline'} size={"icon"}>
            <Plus />
          </Button>
        }
      >
        <Form {...form}>
          <form className={cn("flex flex-col gap-6 w-full")} onSubmit={form.handleSubmit(onSubmit)}>

            <div className="grid gap-6">
              {/* image & detail */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* image */}
                <div className="flex-auto">
                  <Input type='file' onChange={handleChangeFile} accept="image/*" id="selectImage" className="hidden" />
                  {/* image preview */}
                  <div className={cn("w-40 m-auto h-40  rounded-full overflow-hidden bg-secondary border", {
                    'border-2 border-destructive': form.formState.errors.profile_picture,
                    'border-1 border-accent': !form.formState.errors.profile_picture
                  })}>
                    {url ? <Image src={url} alt="Profile" width={100} height={100} className="rounded-full object-cover  h-full w-full" /> :
                      <Label htmlFor="selectImage" className="w-full h-full flex justify-center cursor-pointer items-center">
                        <ImagePlus className="size-20 text-muted-foreground" />
                      </Label>
                    }
                  </div>
                  <p className="text-sm text-destructive text-center">{form.formState.errors.profile_picture && form.formState.errors.profile_picture.message}</p>
                  {/* image actions */}
                  {file && <div className="flex gap-3 justify-center items-center mt-2">
                    <Button type="button" className="cursor-pointer" onClick={handleDeleteImage} variant={'destructive'} size={'icon'}><Trash /></Button>
                    <Button type="button" variant={"default"} className="cursor-pointer" asChild size={'icon'}>
                      <Label htmlFor="selectImage">
                        <Edit2 />
                      </Label>
                    </Button>
                  </div>}
                </div>
                {/* details */}
                <div className='flex-auto grid gap-2 grid-cols-1 md:grid-cols-2 '>
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Full Name' {...field} />
                        </FormControl>
                        <FormDescription>As per your Adhar Card.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter your email' {...field} />
                        </FormControl>
                        <FormDescription>Make sure to enter correct email.</FormDescription>
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
                          <Input placeholder='Enter your contact number' {...field} />
                        </FormControl>
                        <FormDescription>Make sure to enter correct number.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" placeholder='Enter your date of birth' {...field} value={field?.value?.toString().substring(0, 10)} />
                        </FormControl>
                        <FormDescription>As per your Adhar Card.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2">
                <FormField
                  control={form.control}
                  name="aadhaar_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adhar Number</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder='Enter your adhhar number' {...field} />
                      </FormControl>
                      <FormDescription>12 gidit number on your adhar card.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full mt-0">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select your gender.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="off" placeholder='Enter your password' {...field} />
                      </FormControl>
                      <FormDescription>Make sure to enter strong & rememberable password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />       <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="off" placeholder='Re-Enter your password' {...field} />
                      </FormControl>
                      <FormDescription>This is to ensure you have entered correct password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.full_address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>full Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Enter your full address' {...field} />
                      </FormControl>
                      <FormDescription>12 gidit number on your adhar card.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.district_id"
                  render={() => (
                    <FormItem className="col-span-1">
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <DistrictSelector district={district}
                          setDistrict={(x) => {
                            form.setValue("address.district_id", x?.district_id || '')
                            setDistrict(x)
                          }}
                          clearCallBack={() => {
                            form.setValue("address.district_id", '')
                            form.setValue("address.taluka_id", '')
                            setDistrict(null)
                            setTaluka(null)
                          }}
                          className='w-full text-left'

                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.taluka_id"
                  render={() => (
                    <FormItem className="col-span-1">
                      <FormLabel>Taluka</FormLabel>
                      <FormControl>
                        <TalukaSelector
                          className="w-full text-left"
                          clearCallBack={() => {
                            form.setValue("address.taluka_id", '')
                            setTaluka(null)
                          }}
                          taluka={taluka}
                          disable={!district}
                          setTaluka={(x) => {
                            form.setValue("address.taluka_id", x?.taluka_id || '')
                            setTaluka(x)
                          }}
                          district_id={district?.district_id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full mt-0">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="citizen">Citizen</SelectItem>
                          <SelectItem value="department_officer">Department officer</SelectItem>
                          <SelectItem value="mamlatdar_office">Mamlatdar officer</SelectItem>
                          <SelectItem value="sdm_office">Subdivision Officer</SelectItem>
                          <SelectItem value="collectorate_office">Collectorate Officer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-fit ml-auto">
                {loading ? <Loader /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </SharedCreateDialog>
    </div>
  )
}

export default UserCreate