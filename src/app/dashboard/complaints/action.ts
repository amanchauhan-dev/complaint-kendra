"use server"
import { prisma } from "@/lib/prisma";
import { FetchMultipleRequest, FetchMultipleRespone } from "@/lib/server-types";
import { ComplaintFetchschemaType } from "@/validations/models/complaint-validation";

// <================================== create ==============================>






// <================================== Fetch All ==============================>

export const FetchAllComplaints = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = []
}: FetchMultipleRequest & { search?: string }): Promise<FetchMultipleRespone<ComplaintFetchschemaType[]>> => {
    try {
        const skip = (currentPage - 1) * pageSize;

        // Build Prisma `where` object dynamically
        const baseFilter: any = {};

        // Add search to filter
        if (search.trim().length > 0) {
            baseFilter.title = { contains: search.trim(), mode: 'insensitive' };
        }

        // Add custom filters
        if (where && where.length > 0) {
            for (const filter of where) {
                baseFilter[filter.key] = filter.value;
            }
        }

        const [data, total] = await Promise.all([
            prisma.complaint.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
                },
                where: baseFilter,
                include: {
                    category: true,
                    department: true,
                    attachments: true,
                    address: {
                        include: {
                            taluka: {
                                include: {
                                    subdivision: true,
                                    district: true,
                                }
                            }
                        }
                    },
                },
            }),
            prisma.complaint.count({ where: baseFilter }),
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
