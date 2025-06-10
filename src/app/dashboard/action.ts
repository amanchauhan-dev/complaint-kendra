'use server'
import { prisma } from "@/lib/prisma"

import { GeneralResponse } from "@/lib/server-types"
import {
    startOfMonth,
    endOfMonth,
    subMonths,
} from 'date-fns';

type FetchUsersReportType = GeneralResponse<{
    total: number;
    growth: number;
}>
export const FetchUsersReport = async (): Promise<FetchUsersReportType> => {
    try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        const [
            totalUsers,
            usersThisMonth,
            usersLastMonth
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    created_at: {
                        gte: thisMonthStart,
                        lte: thisMonthEnd,
                    },
                },
            }),
            prisma.user.count({
                where: {
                    created_at: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                },
            }),
        ]);
        const growth = usersLastMonth === 0
            ? 100
            : ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100;
        return {
            success: true,
            data: {
                total: totalUsers,
                growth,
            }
        }
    } catch (error: any) {
        console.log('Error in fetching users report');
        return {
            success: false,
            error: error.message
        }
    }
}