'use server'

import { UploadFileGeneric } from "@/lib/cloudinary"
import { GeneralResponse } from "@/lib/server-types"
import { ComplaintCreateSchemaType } from "@/validations/models/complaint-validation"
import { prisma } from '@/lib/prisma'

export const handleFileComplaint = async (data: ComplaintCreateSchemaType): Promise<GeneralResponse<string>> => {
    try {
        const files: {
            file: File,
            type: 'IMAGE' | "PDF",
            url?: string
        }[] = data.attachments
        for (let i = 0; i < files.length; i++) {
            const res = await UploadFileGeneric(files[i].file)
            if (res.newUrl && !res.error) {
                files[i].url = res.newUrl
            }
        }
        await prisma.$transaction(async (tx) => {
            const address = await tx.address.create({
                data: {
                    full_address: data.address.full_address,
                    taluka_id: data.address.taluka_id
                }
            })
            await tx.complaint.create({
                data: {
                    title: data.title,
                    description: data.description,
                    user_id: data.user_id,
                    address_id: address.address_id,
                    category_id: data.category_id,
                    attachments: {
                        createMany: {
                            data: files.map(item => ({ type: item.type, url: item.url || '' }))
                        }
                    },
                }
            })
        })
        return {
            success: true,
            data: "Complaint filed successfully"
        }

    } catch (error: any) {
        return { success: false, error: error }
    }
}