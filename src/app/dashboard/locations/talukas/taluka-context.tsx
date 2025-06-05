'use client'
// district-context.ts
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context";
import { Taluka } from "@/validations/models/taluka-validation";



export const {
    useGenericContext: useTaluka,
    GenericProvider: TalukaProvider,
} = createGenericContext<Taluka>();
