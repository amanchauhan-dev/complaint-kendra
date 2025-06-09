import { z } from "zod"
import { JurisdictionLevelSchema } from "../enums"
import { District } from "./district-validation"
import { Taluka } from "./taluka-validation"
import { Subdivision } from "./sdm-validation"

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

export const DepartmentCreateSchema = z.object({
    jurisdiction_level: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    jurisdiction_id: z.string().min(1, "Required"),
    contact_person: z.string().min(1, "Required"),
    contact_number: z.string().nullable(),
    email: z.string().email(),
})

export type DepartmentCreateSchemaType = z.infer<typeof DepartmentCreateSchema>

export const DepartmentUpdateSchema = z.object({
    department_id: z.string().uuid(),
    jurisdiction_level: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    jurisdiction_id: z.string().min(1, "Required"),
    contact_person: z.string().min(1, "Required"),
    contact_number: z.string().nullable(),
    email: z.string().email(),
})

export type DepartmentUpdateSchemaType = z.infer<typeof DepartmentUpdateSchema>


export type DepartmentSelectType = Department & {
    district?: District | null,
    subdivision?: Subdivision | null,
    taluka?: Taluka | null,
}