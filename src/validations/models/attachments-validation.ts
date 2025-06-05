import { z } from "zod"
import { AttachmentTypeSchema } from "../enums"

export const AttachmentsSchema = z.object({
    type: AttachmentTypeSchema,
    attachment_id: z.string().uuid(),
    url: z.string(),
    complaint_id: z.string(),
})

export type Attachments = z.infer<typeof AttachmentsSchema>
