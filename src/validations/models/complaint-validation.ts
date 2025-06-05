import { z } from "zod";
import { AttachmentTypeSchema, ComplaintStatusSchema } from "../enums";
import { CategorySchema } from "./category-validation";
import { DepartmentSchema } from "./department-validation";
import { AddressSelectSchema } from "./address-validation";
import { AttachmentsSchema } from "./attachments-validation";
import { UserSelectSchema } from "./user-validation";
import { ComplaintResponseSchema } from "./complaint-response-validation";


export const ComplaintSchema = z.object({
    status: ComplaintStatusSchema,
    complaint_id: z.string().uuid(),
    user_id: z.string(),
    category_id: z.string().nullable(),
    department_id: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    address_id: z.string().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})


export type Complaint = z.infer<typeof ComplaintSchema>



//  complaint select


export const ComplaintFetchSchema = ComplaintSchema.extend({
    category: CategorySchema.optional().nullable(),
    department: DepartmentSchema.optional().nullable(),
    address: AddressSelectSchema.optional().nullable(),
    attachments: z.array(AttachmentsSchema).optional().nullable(),
    user: UserSelectSchema.optional().nullable(),
    responses: z.array(ComplaintResponseSchema).optional().nullable()
})

export type ComplaintFetchschemaType = z.infer<typeof ComplaintFetchSchema>




//  complaint create

export const ComplaintCreateSchema = z.object({
    user_id: z.string(),
    category_id: z.string().min(1, "Required"),
    parent_category_id: z.string().min(1, "Required"),
    title: z.string().min(10, "Title must be at least 10 characters"),
    attachments: z.array(
        z.object({
            file: z.instanceof(File),
            type: AttachmentTypeSchema
        })
    ).min(1, "Minimum 1 file attachment is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    address: z.object({
        full_address: z.string().min(10, "Address must be at least 10 characters long"),
        taluka_id: z.string().min(1, "Taluka is required"),
        district_id: z.string().min(1, "District is required")
    })
});

export type ComplaintCreateSchemaType = z.infer<typeof ComplaintCreateSchema>;

