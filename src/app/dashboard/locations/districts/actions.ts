"use server"
import { prisma } from "@/lib/prisma";
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { District, DistrictCreate, DistrictUpdate } from "@/validations/models/district-validation"

// <================================== create ==============================>




export const CreateDistrict = async ({ name }: DistrictCreate): Promise<GeneralResponse<District>> => {
    try {
        const data = await prisma.district.create({
            data: {
                name: name
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating District', error);
        return { success: false, error }
    }
}

// <================================== Fetch All ==============================>

export const FetchAllDistrict = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = []
}: FetchMultipleRequest & { search?: string }): Promise<FetchMultipleRespone<District[]>> => {
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
            prisma.district.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
                },
                where: baseFilter,
            }),
            prisma.district.count({ where: baseFilter }),
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


export const UpdateDistrict = async ({ district_id, name }: DistrictUpdate): Promise<GeneralResponse<District>> => {
    try {
        const data = await prisma.district.update({
            where: { district_id },
            data: {
                name,
                updated_at: new Date()
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating District', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>


export const DeleteDistrict = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.district.delete({
            where: { district_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating District', error);
        return { success: false, error }
    }
}


// <================================== Delete One ==============================>


export const DeleteManyDistrict = async ({ ids }: { ids: string[] }): Promise<GeneralResponse<District>> => {
    try {
        await prisma.district.deleteMany({
            where: {
                district_id: {
                    in: ids
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating District', error);
        return { success: false, error }
    }
}