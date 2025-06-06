import { verifyLoginToken } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { z, ZodError } from "zod";

const TokenSchema = z.object({
    token: z.string()
})

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { token } = TokenSchema.parse(body)

        const decoded = verifyLoginToken(token);
        if (decoded == null) {
            throw new Error("Invalid or expired token")
        }
        const user = await prisma.user.findUnique({
            where: {
                user_id: decoded.user_id, status: "active"
            },
            include: {
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
            }
        });
        if (!user) {
            throw new Error("Unauthorized")
        }
        return NextResponse.json({
            success: true,
            data: { ...user, password: undefined }
        })

    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                success: false,
                error: error.flatten().fieldErrors
            })
        }
        return NextResponse.json({
            success: false,
            error: error.message
        })
    }

}
