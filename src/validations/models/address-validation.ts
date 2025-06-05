import { z } from "zod"
import { TalukaSchema } from "./taluka-validation"
import { SubdivisionSchema } from "./sdm-validation"
import { DistrictSchema } from "./district-validation"

export const AddressSchema = z.object({
    address_id: z.string().uuid(),
    full_address: z.string(),
    created_at: z.coerce.date(),
    taluka_id: z.string(),
    updated_at: z.coerce.date(),
})

export type Address = z.infer<typeof AddressSchema>




export const AddressSelectSchema = AddressSchema.extend({
    taluka: TalukaSchema.extend({
        subdivision: SubdivisionSchema.optional().nullable(),
        district: DistrictSchema.optional().nullable(),
    }).optional().nullable()
})

export type AddressSelectSchemaType = z.infer<typeof AddressSelectSchema>