import { z } from "zod";


export const SubdivisionSchema = z.object({
    subdivision_id: z.string().uuid(),
    district_id: z.string().uuid("Reuired"),
    name: z.string().min(1, "Required"),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})
export type Subdivision = z.infer<typeof SubdivisionSchema>

export const SubdivisionCreateSchema = SubdivisionSchema.omit({
    subdivision_id: true,
    created_at: true,
    updated_at: true
})
export type SubdivisionCreate = z.infer<typeof SubdivisionCreateSchema>

export const SubdivisionUpdateSchema = SubdivisionSchema.omit({
    district_id: true,
    created_at: true,
    updated_at: true
})
export type SubdivisionUpdate = z.infer<typeof SubdivisionUpdateSchema>
