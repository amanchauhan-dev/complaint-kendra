'use client'
import { ComplaintFetchschemaType } from "@/validations/models/complaint-validation"
import { useEffect } from "react"
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import Link from "next/link";

type Attachment = {
    url: string;
    type: string;
};
function ViewComplaint({ data }: { data: ComplaintFetchschemaType }) {
    useEffect(() => console.log(data), [data])
    const {
        title,
        description,
        status,
        created_at,
        attachments,
        category,
        user,
        address,
    } = data;

    const complaintLocation = address?.full_address + ', ' +
        address?.taluka?.name + ', ' +
        address?.taluka?.subdivision?.name + ', ' +
        address?.taluka?.district?.name;

    const userLocation = user?.address?.full_address + ', ' +
        user?.address?.taluka?.name + ', ' +
        user?.address?.taluka?.subdivision?.name + ', ' +
        user?.address?.taluka?.district?.name;

    let comp = <Badge variant={'outline'} className='bg-yellow-600 border-yellow-600 text-white'>{status}</Badge>
    switch (status) {
        case "IN_PROGRESS":
            comp = <Badge variant={'outline'} className='bg-pink-600 border-pink-600 text-white'>{status}</Badge>
            break;
        case "REJECTED":
            comp = <Badge variant={'outline'} className='bg-red-600 border-red-600 text-white'>{status}</Badge>
            break;
        case 'RESOLVED':
            comp = <Badge variant={'outline'} className='bg-green-600 border-green-600 text-white'>{status}</Badge>
            break;

        default:
            break;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 bg-secondary">
            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold">Complaint Details</h1>
                <p className="text-muted-foreground">Filed on: {format(new Date(created_at), "dd MMMM yyyy")}</p>
                {comp}
            </div>

            <div className="grid gap-4 p-6">
                <div className="flex gap-1 flex-col">
                    <h2 className="text-lg font-bold">Title</h2>
                    <h2 className="text-lg">{title}</h2>
                </div>
                <div className="flex gap-1 flex-col">
                    <h2 className="text-lg font-bold">Description</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h2 className="text-lg font-bold">Category</h2>
                    <p className="text-muted-foreground"><Badge variant={'outline'}>{category?.name}</Badge></p>
                </div>

                <div className="grid gap-2">
                    <h3 className="text-lg font-medium">Location</h3>
                    <p className="text-muted-foreground">{complaintLocation}</p>
                </div>

                <div className="grid gap-2">
                    <h3 className="text-lg font-medium">Attachments</h3>
                    <div className="flex flex-wrap items-center justify-center gap-2 ">
                        {attachments?.map((att: any) => (
                            <div key={att.attachment_id} className="border rounded-lg p-2 relative">
                                {att.type === 'IMAGE' ? (
                                    <>
                                        <Image
                                            src={att.url}
                                            alt="Attachment"
                                            width={300}
                                            height={200}
                                            className="rounded-lg object-cover"
                                        />
                                        <Link href={att.url} target="_blank">
                                            <Button size="icon" variant={'outline'} className="absolute cursor-pointer bottom-2 right-12" >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <AttachmentDownloadButton att={att} />
                                    </>
                                ) : (
                                    <div
                                        className="flex justify-center items-center"
                                    >
                                        <span className="text-[200px]">📄</span>
                                        <Link href={att.url} target="_blank">
                                            <Button size="icon" variant={'outline'} className="absolute cursor-pointer bottom-2 right-12" >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <AttachmentDownloadButton att={att} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 grid gap-4">
                <h2 className="text-xl font-semibold">Complainant Details</h2>
                <div className="grid gap-1">
                    <p><strong>Name:</strong> {user?.full_name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Contact:</strong> {user?.contact_number}</p>
                    <p><strong>Gender:</strong> {user?.gender}</p>
                    {/* <p><strong>Date of Birth:</strong> {new Date(user?.date_of_birth).toLocaleDateString()}</p> */}
                    <p><strong>Aadhaar Number:</strong> {user?.aadhaar_number}</p>
                    <p><strong>Address:</strong> {userLocation}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>
            </div>
        </div>
    );
}

export default ViewComplaint


const AttachmentDownloadButton = ({ att }: { att: Attachment }) => {
    const fileName = att.url.split('/').pop() || 'download';
    const handleDownload = async () => {
        const response = await fetch(att.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
    };

    return (
        <Button size="icon" onClick={handleDownload} className="absolute cursor-pointer bottom-2 right-2" >
            <Download className="w-4 h-4" />
        </Button>
    );
};