import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        const { searchParams } = req.nextUrl;
        const pageSize = parseInt(searchParams.get("pageSize") || "100", 10);
        const currentPage = parseInt(searchParams.get("currentPage") || "1", 10);
        const skip = (currentPage - 1) * pageSize;
        const [data, total] = await Promise.all([
            prisma.taluka.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    name: "asc"
                },
                where: {
                    district_id: id
                },
            }),
            prisma.taluka.count({
                where: {
                    district_id: id
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
        return NextResponse.json(
            { success: false, error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
};
