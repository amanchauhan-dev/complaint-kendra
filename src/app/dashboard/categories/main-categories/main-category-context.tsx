'use client'
import { type Category } from "@/validations/models/category-validation"
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context"



export const {
  useGenericContext: useMainCategory,
  GenericProvider: MainCategoryProvider,
} = createGenericContext<Category>()