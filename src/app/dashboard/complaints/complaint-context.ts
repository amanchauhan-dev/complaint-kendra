'use client'

import { ComplaintFetchschemaType } from "@/validations/models/complaint-validation"
import { createGenericContext } from "../_components/shared/generic-context"



export const {
    useGenericContext: useComplaints,
    GenericProvider: ComplaintProvider

} = createGenericContext<ComplaintFetchschemaType>()