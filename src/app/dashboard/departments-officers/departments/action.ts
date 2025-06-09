'use server'
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { Department, DepartmentCreateSchemaType, DepartmentSelectType, DepartmentUpdateSchemaType } from "@/validations/models/department-validation";
import { prisma } from "@/lib/prisma"
import { JurisdictionLevelType } from "@/validations/enums";


export const CreateDepartment = async (department: DepartmentCreateSchemaType): Promise<GeneralResponse<DepartmentSelectType>> => {
    try {
        const data = await prisma.department.create({
            data: {
                jurisdiction_level: department.jurisdiction_level as JurisdictionLevelType,
                jurisdiction_id: department.jurisdiction_id,
                name: department.name,
                contact_person: department.contact_person,
                contact_number: department.contact_number,
                email: department.email
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating Category', error);
        return { success: false, error }
    }
}





export const FetchAllDepartments = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = []
}: FetchMultipleRequest & { search?: string }): Promise<FetchMultipleRespone<DepartmentSelectType[]>> => {
    try {
        const skip = (currentPage - 1) * pageSize;

        // Build Prisma `where` object dynamically
        const baseFilter: any = {};

        // Add search to filter
        if (search.trim().length > 0) {
            baseFilter.name = { contains: search.trim(), mode: 'insensitive' };
        }

        // Add custom filters
        if (where && where.length > 0) {
            for (const filter of where) {
                baseFilter[filter.key] = filter.value;
            }
        }

        const [data, total] = await Promise.all([
            prisma.department.findMany({
                skip,
                take: pageSize,
                include: {
                    district: true,
                    taluka: true,
                    subdivision: true
                },
                orderBy: {
                    [sortField]: sortOrder,
                },
                where: {
                    AND: [
                        baseFilter,
                    ]
                },
            }),
            prisma.department.count({ where: baseFilter }),
        ]);

        return {
            success: true,
            data,
            pagination: {
                currentPage,
                total,
                pageSize,
            },
        };
    } catch (error) {
        console.log('❌Error: Fetching departments', error);
        return { success: false, error };
    }
};




// <================================== Update One ==============================>


export const UpdateDepartment = async (department: DepartmentUpdateSchemaType): Promise<GeneralResponse<Department>> => {
    try {
        const data = await prisma.department.update({
            data: {
                jurisdiction_level: department.jurisdiction_level as JurisdictionLevelType,
                jurisdiction_id: department.jurisdiction_id,
                name: department.name,
                contact_person: department.contact_person,
                contact_number: department.contact_number,
                email: department.email
            },
            where: {
                department_id: department.department_id
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating District', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>


export const DeleteDepartment = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.department.delete({
            where: { department_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Deleting department', error);
        return { success: false, error }
    }
}


// <================================== Delete One ==============================>


export const DeleteManyDepartment = async ({ ids }: { ids: string[] }): Promise<GeneralResponse<Department>> => {
    try {
        await prisma.department.deleteMany({
            where: {
                department_id: {
                    in: ids
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: deleting departments', error);
        return { success: false, error }
    }
}