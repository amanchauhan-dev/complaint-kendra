'use client'
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context"
import { SubCategory } from "@/validations/models/category-validation"



export const {
  useGenericContext: useSubCategory,
  GenericProvider: SubCategoryProvider,
} = createGenericContext<SubCategory>()