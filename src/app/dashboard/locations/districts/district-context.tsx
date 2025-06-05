'use client'
// district-context.ts
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context";
import { District } from "@/validations/models/district-validation";



export const {
    useGenericContext: useDistrict,
    GenericProvider: DistrictProvider,
} = createGenericContext<District>();
