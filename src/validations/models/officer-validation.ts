import { z } from "zod"

export const OfficerSchema = z.object({
    officer_id: z.string().uuid(),
    user_id: z.string(),
    designation: z.string(),
    department_id: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export type Officer = z.infer<typeof OfficerSchema>
