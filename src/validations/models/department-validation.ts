import { z } from "zod"
import { JurisdictionLevelSchema } from "../enums"

export const DepartmentSchema = z.object({
    jurisdiction_level: JurisdictionLevelSchema,
    department_id: z.string().uuid(),
    name: z.string(),
    jurisdiction_id: z.string(),
    contact_person: z.string(),
    contact_number: z.string().nullable(),
    email: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export type Department = z.infer<typeof DepartmentSchema>
