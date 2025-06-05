import { z } from "zod";

export const ComplaintResponseSchema = z.object({
    response_id: z.string().uuid(),
    complaint_id: z.string(),
    officer_id: z.string().nullable(),
    response: z.string(),
    created_at: z.coerce.date(),
})