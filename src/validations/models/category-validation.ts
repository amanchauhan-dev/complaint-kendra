import { z } from "zod";

export const CategorySchema = z.object({
    category_id: z.string().uuid(),
    name: z.string().min(1, "Required"),
    parent_id: z.string().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export type Category = z.infer<typeof CategorySchema>

export const CategoryCreateSchema = CategorySchema.omit({
    category_id: true,
    created_at: true,
    updated_at: true,
    parent_id: true
})

export type CategoryCreateSchemaType = z.infer<typeof CategoryCreateSchema>

export const CategoryUpdateSchema = CategorySchema.omit({
    created_at: true,
    updated_at: true,
    parent_id: true
})

export type CategoryUpdateSchemaType = z.infer<typeof CategoryUpdateSchema>



//  sub category


export const SubCategorySchema = z.object({
    category_id: z.string().uuid(),
    name: z.string().min(1, "Required"),
    parent_id: z.string().min(1, "Requered"),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export type SubCategory = z.infer<typeof SubCategorySchema>

export const SubCategoryCreateSchema = SubCategorySchema.omit({
    category_id: true,
    created_at: true,
    updated_at: true,
})

export type SubCategoryCreateSchemaType = z.infer<typeof SubCategoryCreateSchema>

export const SubCategoryUpdateSchema = SubCategorySchema.omit({
    created_at: true,
    updated_at: true,
})

export type SubCategoryUpdateSchemaType = z.infer<typeof SubCategoryUpdateSchema>
