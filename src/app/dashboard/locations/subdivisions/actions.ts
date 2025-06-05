"use server"
import { prisma } from "@/lib/prisma";
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { Subdivision, SubdivisionCreate, SubdivisionUpdate } from "@/validations/models/sdm-validation"

// <================================== create ==============================>




export const CreateSubdivision = async ({ name, district_id }: SubdivisionCreate): Promise<GeneralResponse<Subdivision>> => {
    try {
        const data = await prisma.subdivision.create({
            data: {
                name: name,
                district_id: district_id
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating Subdivision', error);
        return { success: false, error }
    }
}

// <================================== Fetch All ==============================>


export const FetchAllSubdivisions = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = [],
}: FetchMultipleRequest): Promise<FetchMultipleRespone<Subdivision[]>> => {
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
            prisma.subdivision.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
                },
                where: baseFilter,
            }),
            prisma.subdivision.count({ where: baseFilter }),
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
        console.log('❌Error: Fetching Districts', error);
        return { success: false, error };
    }
};

// <================================== Update One ==============================>


export const UpdateSubdivision = async ({ subdivision_id, name }: SubdivisionUpdate): Promise<GeneralResponse<Subdivision>> => {
    try {
        const data = await prisma.subdivision.update({
            where: { subdivision_id },
            data: {
                name,
                updated_at: new Date()
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating Subdivision', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>


export const DeleteSubdivision = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.subdivision.delete({
            where: { subdivision_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating Subdivision', error);
        return { success: false, error }
    }
}


// <================================== Delete One ==============================>


export const DeleteManySubdivision = async ({ ids }: { ids: string[] }): Promise<GeneralResponse<Subdivision>> => {
    try {
        await prisma.subdivision.deleteMany({
            where: {
                subdivision_id: {
                    in: ids
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating Subdivision', error);
        return { success: false, error }
    }
}