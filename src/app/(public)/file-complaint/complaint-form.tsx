'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, createRef, useState } from 'react';

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ComplaintCreateSchema, ComplaintCreateSchemaType } from '@/validations/models/complaint-validation';
import Loader from '@/components/shared/loader';
import TalukaSelector from '@/components/taluka-selector';
import DistrictSelector from '@/components/district-selector';
import { District } from '@/validations/models/district-validation';
import { Taluka } from '@/validations/models/taluka-validation';
import { Category } from '@/validations/models/category-validation';
import ParentCategorySelector from '@/components/parent-category-selector';
import SubCategorySelector from '@/components/sub-category-selector';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Plus, X } from 'lucide-react';
import { AttachmentTypeType } from '@/validations/enums';
import Image from 'next/image';
import { handleFileComplaint } from './actions';
import toast from 'react-hot-toast';

export const IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
];

export const DOCUMENT_TYPES = [
    "application/pdf"
];


type FileType = {
    file: File,
    type: AttachmentTypeType,
    url: string
}


export default function ComplaintForm() {
    const { user_id } = useAuth()
    const inputRef = createRef<HTMLInputElement>()
    const [files, setFiles] = useState<FileType[]>([])
    const [disableAdd, setDisableAdd] = useState<boolean>(true)
    const [errorFile, setErrorFile] = useState<string | null>(null)
    const [district, setDistrict] = useState<District | null>(null)
    const [taluka, setTaluka] = useState<Taluka | null>(null)
    const [parentCategory, setParentCategory] = useState<Category | null>(null)
    const [subCategory, setSubCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(false);
    const form = useForm<ComplaintCreateSchemaType>({
        resolver: zodResolver(ComplaintCreateSchema),
        defaultValues: {
            user_id: user_id || '',
            category_id: '',
            parent_category_id: '',
            title: '',
            attachments: [],
            description: '',
            address: {
                full_address: '',
                taluka_id: '',
                district_id: '',
            },
        },
    });

    const onSubmit = async (values: ComplaintCreateSchemaType) => {
        if (!user_id) {
            return
        }
        form.setValue("user_id", user_id);
        setLoading(true);
        const res = await handleFileComplaint({ ...values, user_id })
        if (res.success) {
            toast.success("Comaplaint Filed")
            form.reset()
            setSubCategory(null)
            setParentCategory(null)
            setFiles([])
            setDistrict(null)
            setTaluka(null)
            setDisableAdd(true)
        } else {
            toast.error("Something went wrong, try app")
        }
        setLoading(false);
    };

    if (!user_id) {
        return null
    }

    const handleChangeFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (!files || files.length === 0) { return }
        const file = files[0]

        if (!IMAGE_TYPES.includes(file.type) && !DOCUMENT_TYPES.includes(file.type)) {
            setErrorFile("Only .jpg,.png, .jpeg and .pdf are allowed")
        }
        else if (file.size > 2 * 1024 * 1024) {
            setErrorFile("Size should be less than 2 mb")
        } else {
            setErrorFile(null)
            setDisableAdd(false)
        }
    };

    const deleteFile = (index: number) => {
        const newSet = files.filter((__, i) => i !== index)
        if (newSet.length == 0) {
            setErrorFile('Required')
        }
        setFiles(newSet)
        form.setValue("attachments", newSet.map(item => ({ ...item, url: undefined })))
    }

    const onAddFile = () => {
        if (!inputRef.current) { return }
        const filesArr = inputRef.current.files
        if (!filesArr || filesArr.length === 0) { return }
        Array.from(filesArr).forEach((file) => {
            if (IMAGE_TYPES.includes(file.type)) {
                setFiles((prev) => ([...prev, { file: file, type: "IMAGE", url: URL.createObjectURL(file) }]))
                form.setValue("attachments", [...form.getValues("attachments"), { type: "IMAGE", file: file }])

            } else if (DOCUMENT_TYPES.includes(file.type)) {
                setFiles((prev) => ([...prev, { file: file, type: "PDF", url: URL.createObjectURL(file) }]))
                form.setValue("attachments", [...form.getValues("attachments"), { type: "PDF", file: file }])
            }
            form.clearErrors("attachments")
            setDisableAdd(true)
            if (inputRef.current) {
                inputRef.current.files = null
                inputRef.current.value = ''
            }
        })
    }

    return (
        <div className='max-w-[600px] mx-auto my-5 px-2 pr-4'>
            <div>
                <h1 className='text-center font-bold text-2xl'>📄 File Complaint</h1>
                <p className='text-center text-sm my-2 mb-4 text-muted-foreground'>
                    👉 Make sure to fill correct details, these details will help us resolving this issue
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Write a short title " {...field} />
                                </FormControl>
                                <FormDescription>Title should reflect your problem</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name="parent_category_id"
                            render={() => (
                                <FormItem className="col-span-1">
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <ParentCategorySelector
                                            parentCategory={parentCategory}
                                            setParentCategory={(x) => {
                                                setParentCategory(x)
                                                form.setValue('parent_category_id', x?.category_id || '')
                                                form.clearErrors("parent_category_id")
                                            }}
                                            clearCallBack={() => {
                                                setSubCategory(null)
                                                form.setValue('parent_category_id', '')
                                                form.setValue("category_id", '')
                                                form.setError("parent_category_id", { message: "Required" })
                                                form.setError("category_id", { message: "Required" })
                                            }}
                                            className={cn('w-full text-left', {
                                                "border-destructive": form.formState.errors.parent_category_id
                                            })}
                                        />
                                    </FormControl>
                                    <FormDescription>Choose relevent category</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={() => (
                                <FormItem className="col-span-1">
                                    <FormLabel>Sub Categoy</FormLabel>
                                    <FormControl>
                                        <SubCategorySelector
                                            category={subCategory}
                                            setCategory={(x) => {
                                                setSubCategory(x)
                                                form.setValue("category_id", x?.category_id || '')
                                                form.clearErrors("category_id")
                                            }}
                                            parent_id={parentCategory?.category_id || ''}
                                            disable={!parentCategory}
                                            clearCallBack={() => {
                                                setSubCategory(null)
                                                form.setValue("category_id", '')
                                                form.setError("category_id", { message: "Required" })
                                            }}
                                            className={cn('w-full text-left', {
                                                "border-destructive": form.formState.errors.category_id
                                            })}
                                        />
                                    </FormControl>
                                    <FormDescription>Choose a valid sub category</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* files */}
                    <div className='space-y-2'>
                        <div className='flex flex-wrap gap-2 items-center'>
                            {files.map((item, index) => {
                                return <ShowFile onDelete={() => deleteFile(index)} key={index} file={item} />
                            })}
                        </div>
                        <h1 className={cn({
                            "text-destructive": !!errorFile || form.formState.errors.attachments
                        })}>Add Attachments</h1>
                        <div className="flex gap-2">
                            <div className='w-full space-y-1.5'>
                                <Input
                                    disabled={files.length > 1}

                                    ref={inputRef} type='file' onChange={handleChangeFileInput} className={cn("border-2", {
                                        "border-destructive": !!errorFile || form.formState.errors.attachments
                                    })} />
                                <p className='text-sm text-muted-foreground'>Add Relevent document or image</p>
                                <p className={cn("text-destructive text-sm")}>{errorFile} {form.formState.errors.attachments && form.formState.errors.attachments.message}</p>
                            </div>
                            <Button disabled={disableAdd} type='button' size={'icon'} onClick={onAddFile}><Plus /></Button>
                        </div>
                    </div>
                    {/* description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter a detailed description " className='min-h-[300px]' {...field} />
                                </FormControl>
                                <FormDescription>Explain your problem in detail, include every minute details revelent to your problem</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="address.full_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Complete address" {...field} />
                                    </FormControl>
                                    <FormDescription>Write address of problem if its location base else select your district</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-2 gap-4'>
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
                                                form.clearErrors("address.district_id")
                                            }}
                                                clearCallBack={() => {
                                                    form.setValue("address.district_id", '')
                                                    form.setValue("address.taluka_id", '')
                                                    setDistrict(null)
                                                    setTaluka(null)
                                                    form.setError("address.district_id", { message: "Required" })
                                                    form.setError("address.taluka_id", { message: "Required" })
                                                }}
                                                className={cn('w-full text-left', {
                                                    "border-destructive": form.formState.errors.address?.district_id
                                                })}
                                            />
                                        </FormControl>
                                        <FormDescription>Choose district of problem if its location base else select your district</FormDescription>
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
                                                className={cn('w-full text-left', {
                                                    "border-destructive": form.formState.errors.address?.taluka_id
                                                })}
                                                clearCallBack={() => {
                                                    form.setValue("address.taluka_id", '')
                                                    setTaluka(null)
                                                    form.setError("address.taluka_id", { message: "Required" })
                                                }}
                                                taluka={taluka}
                                                disable={!district}
                                                setTaluka={(x) => {
                                                    form.setValue("address.taluka_id", x?.taluka_id || '')
                                                    setTaluka(x)
                                                    form.clearErrors("address.taluka_id")
                                                }}
                                                district_id={district?.district_id}
                                            />
                                        </FormControl>
                                        <FormDescription>Choose district of problem if its location base else select your taluk</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader /> : 'Submit Complaint'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}


const ShowFile = ({ file, onDelete }: { file: FileType, onDelete: () => void }) => {
    if (file.type == 'IMAGE') {
        return (
            <div className='h-24 relative'>
                <span className='absolute -top-2 right-0 bg-destructive w-6 h-6 flex items-center justify-center rounded-full' onClick={onDelete}><X className='size-4' /></span>
                <Image src={file.url} height={200} width={200} alt='Attachment' className='w-full m-auto h-full object-contain' />
            </div>
        )
    }
    return (
        <div className='space-y-2 flex flex-col items-center justify-center relative'>
            <span className='absolute -top-2 right-0 bg-destructive w-6 h-6 flex items-center justify-center rounded-full' onClick={onDelete}><X className='size-4' /></span>
            <div className='text-9xl'>
                📄
            </div>
            <h1 className='text-sm text-muted-foreground w-[90px] whitespace-nowrap overflow-hidden text-ellipsis'>{file.file.name}</h1>
        </div>
    )

}