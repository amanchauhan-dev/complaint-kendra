import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createLoginToken } from "@/lib/server-utils"
import { SignUpSchema } from "@/validations/auth-validation"
import { GenderType } from "@/validations/enums"
import { UploadProfile } from "@/lib/cloudinary"

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const user = SignUpSchema.parse(body)
        const file = user.profile_picture
        let url = '';
        if (file) {
            const res = await UploadProfile(file)
            if (res.newUrl) {
                url = res.newUrl
            } else {
                throw new Error("Unable to upload Image")
            }
        }
        const hassedPassword = await bcrypt.hash(user.password, 10)
        const newUser = await prisma.user.create({
            data: {
                full_name: user.full_name,
                email: user.email,
                profile_picture: url,
                aadhaar_number: user.aadhaar_number,
                password: hassedPassword,
                contact_number: user.contact_number,
                date_of_birth: new Date(user.date_of_birth),
                gender: user.gender as GenderType,
                address: {
                    create: {
                        full_address: user.address.full_address,
                        taluka_id: user.address.taluka_id
                    }
                }
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
        })

        if (!newUser) {
            throw new Error('Unable to create user')
        }

        const token = createLoginToken({ user_id: newUser.user_id, email: newUser.email, role: newUser.role })

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