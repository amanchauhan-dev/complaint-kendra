'use client'
import { createGenericContext } from "@/app/dashboard/_components/shared/generic-context"
import { DepartmentSelectType } from "@/validations/models/department-validation"



export const {
    useGenericContext: useDepartment,
    GenericProvider: DepartmentProvider,
} = createGenericContext<DepartmentSelectType>()