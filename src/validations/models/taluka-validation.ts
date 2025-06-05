import { z } from "zod";

export const TalukaSchema = z.object({
    taluka_id: z.string().uuid(),
    subdivision_id: z.string().nullable(),
    district_id: z.string().uuid("Required"),
    name: z.string().min(1, "Required"),
    area_code: z.string().min(1, "Required"),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})


export type Taluka = z.infer<typeof TalukaSchema>

export const TalukaCreateSchema = TalukaSchema.omit({
    taluka_id: true,
    created_at: true,
    updated_at: true
})
export type TalukaCreate = z.infer<typeof TalukaCreateSchema>

export const TalukaUpdateSchema = TalukaSchema.omit({
    created_at: true,
    updated_at: true
})
export type TalukaUpdate = z.infer<typeof TalukaUpdateSchema>
