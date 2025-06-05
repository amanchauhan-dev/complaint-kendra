'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import { UseFormReturn } from "react-hook-form"
import { type SignUpSchemaType } from "@/validations/auth-validation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import TalukaSelector from "@/components/taluka-selector"
import DistrictSelector from "@/components/district-selector"
import { ChangeEvent, useState } from "react"
import Loader from "@/components/shared/loader"
import { District } from '@/validations/models/district-validation'
import { Taluka } from '@/validations/models/taluka-validation'
import Image from "next/image"
import { Edit2, ImagePlus, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"



export function SignUpForm({ form, onSubmit, loading = false }: { setTab: (x: 'signup' | 'otp') => void, form: UseFormReturn<SignUpSchemaType>, onSubmit: (values: SignUpSchemaType) => void; loading?: boolean; }) {
    const [district, setDistrict] = useState<District | null>(null)
    const [taluka, setTaluka] = useState<Taluka | null>(null)


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
        <Form {...form}>
            <form className={cn("flex flex-col gap-6")} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create a new account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>
                {/* image & detail */}
                <div className="flex gap-2">
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
                    <div className="flex-auto">
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
                    </div>
                </div>
                {/* detail */}
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2  gap-2">
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
                                        <DistrictSelector district={district} setDistrict={(x) => {
                                            form.setValue("address.district_id", x?.district_id || '')
                                            setDistrict(x)
                                        }}
                                            clearCallBack={() => {
                                                form.setValue("address.district_id", '')
                                                form.setValue("address.taluka_id", '')
                                                setDistrict(null)
                                                setTaluka(null)
                                            }}
                                            className="w-full text-left"
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
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader /> : "Login"}
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <ProgressBarLink href="/login" className="underline underline-offset-4">
                        login
                    </ProgressBarLink>
                </div>
            </form>
        </Form>

    )
}
