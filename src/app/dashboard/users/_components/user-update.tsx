'use client'
import { Button } from '@/components/ui/button'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/shared/loader'
import { UpdateUserSchema, UpdateUserSchemaType, UserSelectSchemaType } from '@/validations/models/user-validation'
import { useUser } from '../user-context'
import { UpdateUser } from '../action'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import DistrictSelector from '@/components/district-selector'
import TalukaSelector from '@/components/taluka-selector'
import { District } from '@/validations/models/district-validation'
import { Taluka } from '@/validations/models/taluka-validation'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Edit2, ImagePlus, RotateCcw } from 'lucide-react'


function UserUpdate({ data, setOpen }: { data: UserSelectSchemaType, setOpen: (x: boolean) => void }) {
    const { refresh } = useUser()
    const [district, setDistrict] = useState<District | null>({
        district_id: data.address?.taluka?.district?.district_id || '',
        name: data.address?.taluka?.district?.name || '',
        created_at: data.address?.taluka?.district?.created_at || new Date(),
        updated_at: data.address?.taluka?.district?.updated_at || new Date(),
    })
    const [taluka, setTaluka] = useState<Taluka | null>({
        taluka_id: data.address?.taluka?.taluka_id || '',
        name: data.address?.taluka?.name || '',
        created_at: data.address?.taluka?.created_at || new Date(),
        updated_at: data.address?.taluka?.updated_at || new Date(),
        area_code: data.address?.taluka?.area_code || '',
        district_id: "",
        subdivision_id: ""
    })
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<UpdateUserSchemaType>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            user_id: data.user_id,
            gender: data.gender,
            role: data.role || undefined,
            full_name: data.full_name,
            email: data.email,
            contact_number: data.contact_number,
            date_of_birth: data.date_of_birth.toDateString(),
            profile_picture: null,
            old_picture: data.profile_picture || null,
            aadhaar_number: data.aadhaar_number,
            address: {
                full_address: data.address?.full_address || '',
                taluka_id: data.address?.taluka_id || '',
                district_id: data.address?.taluka?.district_id || ''
            },
        }
    })

    const onSubmit = async (values: UpdateUserSchemaType) => {
        setLoading(true)
        const res = await UpdateUser(values)
        if (res.success && res.data) {
            setOpen(false)
            refresh()
        } else {
            console.log(res.error);
        }
        setLoading(false)
    }

    const [url, setUrl] = useState<string | null>(data.profile_picture)
    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const image = e.target.files[0]
            setUrl(URL.createObjectURL(image))
            form.setValue("profile_picture", image)
        }
    }
    const handleDeleteImage = () => {
        setUrl(data.profile_picture)
        form.setValue("profile_picture", null)
    }
    return (
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
                            {url && <div className="flex gap-3 justify-center items-center mt-2">
                                <Button type="button" className="cursor-pointer" onClick={handleDeleteImage} variant={'destructive'} size={'icon'}><RotateCcw /></Button>
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
                        {loading ? <Loader /> : "Update"}
                    </Button>
                </div>
            </form>
        </Form>

    )
}

export default UserUpdate