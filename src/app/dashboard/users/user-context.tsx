'use client'
import { UserSelectMultipleSchemaType } from "@/validations/models/user-validation";
import { createGenericContext } from "../_components/shared/generic-context";


export const {
    useGenericContext: useUser,
    GenericProvider: UserProvider
} = createGenericContext<UserSelectMultipleSchemaType>() 