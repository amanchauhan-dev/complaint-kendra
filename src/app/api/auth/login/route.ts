import { LoginSchem } from "@/validations/auth-validation"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createLoginToken } from "@/lib/server-utils"

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { email, password } = LoginSchem.parse(body)
        const user = await prisma.user.findUnique({
            where: { email, status: "active" },
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
        })
        if (!user) {
            throw new Error("Invalid email or password")
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password")
        }
        const token = createLoginToken({ user_id: user.user_id, email: user.email, role: user.role })

        return NextResponse.json({
            success: true,
            data: {
                token: token,
                user: { ...user, password: undefined }
            }
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