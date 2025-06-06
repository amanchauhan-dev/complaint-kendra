import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = req.nextUrl;
        const pageSize = parseInt(searchParams.get("pageSize") || "100", 10);
        const currentPage = parseInt(searchParams.get("currentPage") || "1", 10);
        const skip = (currentPage - 1) * pageSize;
        const [data, total] = await Promise.all([
            prisma.category.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    name: "asc"
                },
                where: {
                    parent_id: null
                }
            }),
            prisma.category.count({
                where: {
                    parent_id: null
                }
            }),
        ]);

        return NextResponse.json({
            success: true,
            data,
            total,
            pageSize,
            currentPage
        });
    } catch (error: any) {
        console.error("Error in catgeory GET:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
};
