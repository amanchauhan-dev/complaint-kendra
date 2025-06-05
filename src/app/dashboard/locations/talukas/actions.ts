"use server"
import { prisma } from "@/lib/prisma";
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { Taluka, TalukaCreate, TalukaUpdate } from "@/validations/models/taluka-validation";

// <================================== create ==============================>




export const CreateTaluka = async ({ name, subdivision_id, area_code, district_id }: TalukaCreate): Promise<GeneralResponse<Taluka>> => {
    try {
        if (subdivision_id?.length == 0) {
            subdivision_id = null
        }
        const data = await prisma.taluka.create({
            data: { name, subdivision_id: subdivision_id || undefined, area_code, district_id }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating Taluka', error);
        return { success: false, error }
    }
}

// <================================== Fetch All ==============================>

export const FetchAllTaluka = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = [],
}: FetchMultipleRequest): Promise<FetchMultipleRespone<Taluka[]>> => {
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
            prisma.taluka.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
                },
                where: baseFilter,
            }),
            prisma.taluka.count({ where: baseFilter }),
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
        console.log('❌Error: Fetching Talukas', error);
        return { success: false, error };
    }
};

// <================================== Update One ==============================>


export const UpdateTaluka = async ({ taluka_id, name }: TalukaUpdate): Promise<GeneralResponse<Taluka>> => {
    try {
        const data = await prisma.taluka.update({
            where: { taluka_id },
            data: {
                name,
                updated_at: new Date(),
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating Taluka', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>


export const DeleteTaluka = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.taluka.delete({
            where: { taluka_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating Taluka', error);
        return { success: false, error }
    }
}


// <================================== Delete One ==============================>


export const DeleteManyTaluka = async ({ ids }: { ids: string[] }): Promise<GeneralResponse<Taluka>> => {
    try {
        await prisma.taluka.deleteMany({
            where: {
                taluka_id: {
                    in: ids
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating Taluka', error);
        return { success: false, error }
    }
}