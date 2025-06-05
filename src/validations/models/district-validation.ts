import { z } from "zod";


export const DistrictSchema = z.object({
    district_id: z.string().uuid(),
    name: z.string().min(1, "Required"),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export type District = z.infer<typeof DistrictSchema>

export const DistrictCreateSchema = DistrictSchema.omit({
    district_id: true,
    created_at: true,
    updated_at: true
})
export type DistrictCreate = z.infer<typeof DistrictCreateSchema>

export const DistrictUpdateSchema = DistrictSchema.omit({
    created_at: true,
    updated_at: true
})
export type DistrictUpdate = z.infer<typeof DistrictUpdateSchema>
