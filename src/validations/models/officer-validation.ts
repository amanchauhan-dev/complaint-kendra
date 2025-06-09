import { z } from "zod"
import { UserSingleSelect } from "./user-validation"
import { DepartmentSelectType } from "./department-validation"

export const OfficerSchema = z.object({
    officer_id: z.string().uuid(),
    user_id: z.string(),
    designation: z.string(),
    department_id: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export type Officer = z.infer<typeof OfficerSchema>

export const OfficerCreateSchema = z.object({
    user_id: z.string().min(1, "Required"),
    designation: z.string().min(1, "Required"),
    department_id: z.string().min(1, "Required"),
})

export type OfficerCreateSchemaType = z.infer<typeof OfficerCreateSchema>

export const OfficerUpdateSchema = z.object({
    officer_id: z.string().uuid(),
    user_id: z.string().min(1, "Required"),
    designation: z.string().min(1, "Required"),
    department_id: z.string().min(1, "Required"),
})

export type OfficerUpdateSchemaType = z.infer<typeof OfficerUpdateSchema>

export const OfficerSelectSchema = OfficerSchema.extend({
    user: UserSingleSelect.optional().nullable(),
})

export type OfficerSelectSchemaType = z.infer<typeof OfficerSelectSchema> & {
    department?: DepartmentSelectType | null
}