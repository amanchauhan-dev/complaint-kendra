'use server'
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { prisma } from "@/lib/prisma"
import { OfficerCreateSchemaType, OfficerSelectSchemaType, OfficerUpdateSchemaType } from "@/validations/models/officer-validation";


export const CreateOfficer = async (officer: OfficerCreateSchemaType): Promise<GeneralResponse<OfficerSelectSchemaType>> => {
    try {
        const data = await prisma.officer.create({
            data: {
                user_id: officer.user_id,
                department_id: officer.department_id,
                designation: officer.designation
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating officer', error);
        return { success: false, error }
    }
}





export const FetchAllOfficers = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = []
}: FetchMultipleRequest & { search?: string }): Promise<FetchMultipleRespone<OfficerSelectSchemaType[]>> => {
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
            prisma.officer.findMany({
                skip,
                take: pageSize,
                include: {
                    user: {
                        select: {
                            user_id: true,
                            full_name: true,
                            profile_picture: true,
                            email: true,
                            date_of_birth: true,
                            gender: true,
                            last_login: true,
                            created_at: true,
                            updated_at: true,
                            aadhaar_number: true,
                            contact_number: true,
                            status: true,
                            address_id: true,
                            role: true,
                        }
                    },
                    department: {
                        include: {
                            district: true,
                            taluka: true,
                            subdivision: true
                        }
                    }
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
            prisma.officer.count({ where: baseFilter }),
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
        console.log('❌Error: Fetching officer', error);
        return { success: false, error };
    }
};




// <================================== Update One ==============================>


export const UpdateOfficers = async (officer: OfficerUpdateSchemaType): Promise<GeneralResponse<OfficerSelectSchemaType>> => {
    try {
        const data = await prisma.officer.update({
            data: {
                user_id: officer.user_id,
                department_id: officer.department_id,
                designation: officer.designation,
                updated_at: new Date()
            },
            where: {
                officer_id: officer.officer_id
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating officer', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>


export const DeleteOfficer = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.officer.delete({
            where: { officer_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Deleting officer', error);
        return { success: false, error }
    }
}

