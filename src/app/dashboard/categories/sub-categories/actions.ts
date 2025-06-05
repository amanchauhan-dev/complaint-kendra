"use server"
import { prisma } from "@/lib/prisma";
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { Category, SubCategory, SubCategoryCreateSchemaType, SubCategoryUpdateSchemaType } from "@/validations/models/category-validation";

// <================================== create ==============================>

export const CreateSubCategory = async ({ name, parent_id }: SubCategoryCreateSchemaType): Promise<GeneralResponse<SubCategory>> => {
    try {
        const data = await prisma.category.create({
            data: {
                name: name,
                parent_id: parent_id
            }
        })
        return { success: true, data: data as any }
    } catch (error) {
        console.log('❌Error: Creating SubCategory', error);
        return { success: false, error }
    }
}

// <================================== Fetch All ==============================>

export const FetchAllSubCategory = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = []
}: FetchMultipleRequest & { search?: string }): Promise<FetchMultipleRespone<SubCategory[]>> => {
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
            prisma.category.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
                },
                where: {
                    AND: [
                        baseFilter,
                        { parent_id: { not: null } }
                    ]
                },
            }),
            prisma.category.count({ where: baseFilter }),
        ]);

        return {
            success: true,
            data: data as any,
            pagination: {
                currentPage,
                total,
                pageSize,
            },
        };
    } catch (error) {
        console.log('❌Error: Fetching SubCategory', error);
        return { success: false, error };
    }
};

// <================================== Update One ==============================>


export const UpdateSubCategory = async ({ category_id, name, parent_id }: SubCategoryUpdateSchemaType): Promise<GeneralResponse<Category>> => {
    try {
        const data = await prisma.category.update({
            where: { category_id },
            data: {
                name,
                updated_at: new Date(),
                parent_id
            }
        })
        return { success: true, data }
    } catch (error) {
        console.log('❌Error: Creating SubCategory', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>




export const DeleteSubCategory = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.category.delete({
            where: { category_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating Category', error);
        return { success: false, error }
    }
}


// <================================== Delete One ==============================>


export const DeleteManySubCategory = async ({ ids }: { ids: string[] }): Promise<GeneralResponse<Category>> => {
    try {
        await prisma.category.deleteMany({
            where: {
                category_id: {
                    in: ids
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating Category', error);
        return { success: false, error }
    }
}