'use client'
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context"
import { OfficerSelectSchemaType } from "@/validations/models/officer-validation"



export const {
    useGenericContext: useOfficer,
    GenericProvider: OfficerProvider,
} = createGenericContext<OfficerSelectSchemaType>()