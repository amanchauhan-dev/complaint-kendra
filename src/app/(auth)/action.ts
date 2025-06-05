'use server'

import { GeneralResponse } from "@/lib/server-types"
import { LoginSchemaType, SignUpSchemaType } from "@/validations/auth-validation"
import { prisma } from "@/lib/prisma"
import { GenderType } from "@/validations/enums"
import { UserSelectSchemaType } from "@/validations/models/user-validation"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { createLoginToken, verifyLoginToken } from "@/lib/server-utils"
import { cookies } from "next/headers"
import { UploadProfile } from "@/lib/cloudinary"

export const checkUniqueFields = async (email: string, aadhaar_number: string): Promise<GeneralResponse<string[]>> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { aadhaar_number }
                ]
            }
        })

        if (user) {
            const data = []
            if (user.email === email) {
                data.push('email')
            }
            if (user.aadhaar_number === aadhaar_number) {
                data.push('aadhaar_number')
            }

            return {
                success: false, data
            }
        }
        return {
            success: true,
        }
    } catch (error: any) {
        return {
            success: false,
            error
        }

    }
}


export const handleSignIn = async (user: SignUpSchemaType): Promise<GeneralResponse<UserSelectSchemaType>> => {
    try {
        const file = user.profile_picture
        let url = '';
        if (file) {
            const res = await UploadProfile(file)
            if (res.newUrl && !res.error) {
                url = res.newUrl
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

        const token = createLoginToken({ user_id: newUser.user_id, email: newUser.email, role: newUser.role })

            ; (await cookies()).set("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            })

        return {
            success: true,
            data: { ...newUser, password: undefined }
        }
    } catch (error: any) {
        console.log('❌Error in Signing in', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return {
                success: false,
                error: "Email already exits"
            }
        }
        return {
            success: false,
            error
        }
    }
}



export const checkAuth = async (): Promise<GeneralResponse<UserSelectSchemaType>> => {
    try {
        const token = (await cookies()).get("auth_token");
        if (!token) {
            return {
                success: false,
                error: "Unauthorized"
            }
        }
        const decoded = verifyLoginToken(token.value);
        if (decoded == null) {
            return { success: false }
        }
        const user = await prisma.user.findUnique({
            where: {
                user_id: decoded.user_id
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
            return {
                success: false,
                error: "Unauthorized"
            }
        }
        if (!user || !user.gender) {
            return {
                success: false,
                error: "Invalid user data"
            }
        }
        return {
            success: true,
            data: { ...user, password: undefined, gender: user.gender as "male" | "female" | "other" }
        }

    } catch (error) {
        console.log('❌Error: Checking auth', error);
        return {
            success: false,
            error
        }
    }

}



export const handleLogin = async ({ email, password }: LoginSchemaType): Promise<GeneralResponse<UserSelectSchemaType>> => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
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

            ; (await cookies()).set("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            })
        return {
            success: true,
            data: { ...user, password: undefined }
        }
    } catch (error: any) {
        return {
            success: false,
            error
        }
    }
}




export const handleLogout = async (): Promise<GeneralResponse<null>> => {
    try {
        ; ((await cookies()).set('auth_token', '', { maxAge: -1 }))
        return {
            success: true,
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
} 