'use client'
// district-context.ts
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context";
import { Subdivision } from "@/validations/models/sdm-validation";



export const {
    useGenericContext: useSubdivision,
    GenericProvider: SubDivisionProvider,
} = createGenericContext<Subdivision>();
