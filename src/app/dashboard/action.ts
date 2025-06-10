'use server'
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { GeneralResponse } from "@/lib/server-types"
import {
    startOfMonth,
    endOfMonth,
    subMonths,
    subYears
} from 'date-fns';

type FetchUsersReportType = GeneralResponse<{
    total: number;
    growth: number;
    new: number;
}>


export const FetchUsersReport = async (): Promise<FetchUsersReportType> => {
    try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 12));
        const lastMonthEnd = endOfMonth(subMonths(now, 12));
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
                growth: parseFloat(growth.toFixed(2)),
                new: usersThisMonth
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


export const FetchNewComplaintsReport = async (): Promise<FetchUsersReportType> => {
    try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 12));
        const lastMonthEnd = endOfMonth(subMonths(now, 12));
        const [
            total,
            thisMonth,
            lastMonth
        ] = await Promise.all([
            prisma.complaint.count(),
            prisma.complaint.count({
                where: {
                    created_at: {
                        gte: thisMonthStart,
                        lte: thisMonthEnd,
                    },
                },
            }),
            prisma.complaint.count({
                where: {
                    created_at: {
                        gte: lastMonthStart,
                        lte: lastMonthEnd,
                    },
                },
            }),
        ]);
        const growth = lastMonth === 0
            ? 100
            : ((thisMonth - lastMonth) / lastMonth) * 100;
        return {
            success: true,
            data: {
                total: total,
                growth: parseFloat(growth.toFixed(2)),
                new: thisMonth
            }
        }
    } catch (error: any) {
        console.log('Error in fetching new complaints report');
        return {
            success: false,
            error: error.message
        }
    }
}


export const FetchResolvedComplaintsReport = async (): Promise<FetchUsersReportType> => {
    try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 12));
        const lastMonthEnd = endOfMonth(subMonths(now, 12));
        const [
            total,
            thisMonth,
            lastMonth
        ] = await Promise.all([
            prisma.complaint.count({ where: { status: "RESOLVED" } }),
            prisma.complaint.count({
                where: {
                    AND: [
                        {
                            created_at: {
                                gte: thisMonthStart,
                                lte: thisMonthEnd,
                            },
                        },
                        { status: "RESOLVED" }
                    ]
                },
            }),
            prisma.complaint.count({
                where: {
                    AND: [
                        {
                            created_at: {
                                gte: lastMonthStart,
                                lte: lastMonthEnd,
                            },
                        },
                        { status: "RESOLVED" }
                    ]

                },
            }),
        ]);
        const growth = lastMonth === 0
            ? 100
            : ((thisMonth - lastMonth) / lastMonth) * 100;
        return {
            success: true,
            data: {
                total: total,
                growth: parseFloat(growth.toFixed(2)),
                new: thisMonth
            }
        }
    } catch (error: any) {
        console.log('Error in fetching resolved complaints report');
        return {
            success: false,
            error: error.message
        }
    }
}

export const FetchRejectedComplaintsReport = async (): Promise<FetchUsersReportType> => {
    try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 12));
        const lastMonthEnd = endOfMonth(subMonths(now, 12));
        const [
            total,
            thisMonth,
            lastMonth
        ] = await Promise.all([
            prisma.complaint.count({ where: { status: "REJECTED" } }),
            prisma.complaint.count({
                where: {
                    AND: [
                        {
                            created_at: {
                                gte: thisMonthStart,
                                lte: thisMonthEnd,
                            },
                        },
                        { status: "REJECTED" }
                    ]
                },
            }),
            prisma.complaint.count({
                where: {
                    AND: [
                        {
                            created_at: {
                                gte: lastMonthStart,
                                lte: lastMonthEnd,
                            },
                        },
                        { status: "REJECTED" }
                    ]

                },
            }),
        ]);
        const growth = lastMonth === 0
            ? 100
            : ((thisMonth - lastMonth) / lastMonth) * 100;
        return {
            success: true,
            data: {
                total: total,
                growth: parseFloat(growth.toFixed(2)),
                new: thisMonth
            }
        }
    } catch (error: any) {
        console.log('Error in fetching reected complaints report');
        return {
            success: false,
            error: error.message
        }
    }
}



type DataSetType = {
    month: string;
    count: number;
}
type ComplaintGraphDataType = {
    length: number;
    dataSet: DataSetType[]
}
export const FetchComplaintGraphData = async (): Promise<GeneralResponse<ComplaintGraphDataType>> => {
    try {

        const endDate = new Date();
        const startDate = subYears(endDate, 5);

        const result: DataSetType[] = await prisma.$queryRaw`
      SELECT
          DATE_TRUNC('month', created_at) AS month,
          COUNT(user_id) AS count
      FROM
          "User"
      WHERE
          created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY
          DATE_TRUNC('month', created_at)
      ORDER BY
          month;
    `;
        const newData = result.map(row => ({
            month: format(row.month, 'yyyy-MM'),
            count: Number(row.count), // <--- This line converts BigInt to Number
        }));
        return {
            success: true,
            data: {
                dataSet: newData,
                length: newData.length
            }

        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message
        }

    }
}



export const CountDistricts = async (): Promise<GeneralResponse<number>> => {
    try {
        const count = await prisma.district.count()
        return {
            success: true,
            data: count
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message
        }
    }
}
export const CountTalukas = async (): Promise<GeneralResponse<number>> => {
    try {
        const count = await prisma.taluka.count()
        return {
            success: true,
            data: count
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message
        }
    }
}