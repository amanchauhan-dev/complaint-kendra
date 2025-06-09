"use server"
import { UploadProfile } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { FetchMultipleRequest, FetchMultipleRespone, GeneralResponse } from "@/lib/server-types";
import { GenderType, RoleType } from "@/validations/enums";
import { CreateUserSchemaType, UpdateUserSchemaType, UserSelectMultipleSchemaType, UserSelectSchemaType, UserSingleSelectType } from "@/validations/models/user-validation";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// <================================== create ==============================>


export const CreateUser = async (user: CreateUserSchemaType): Promise<GeneralResponse<UserSelectSchemaType>> => {
    try {
        const file = user.profile_picture
        let url = '';
        if (file) {
            const res = await UploadProfile(file)
            if (res.newUrl && !res.error) {
                url = res.newUrl
            }
        }
        let role = {}
        if (user.role && user.role !== 'superadmin') {
            role = { role: user.role }
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
                ...role,
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

        return {
            success: true,
            data: { ...newUser, password: undefined }
        }
    } catch (error: any) {
        console.log('❌Error in createion', error);
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


// <================================== Fetch All ==============================>

export const FetchAllUser = async ({
    pageSize = 10,
    currentPage = 1,
    sortOrder = 'desc',
    sortField = "created_at",
    search = '',
    where = [],
}: FetchMultipleRequest): Promise<FetchMultipleRespone<UserSelectMultipleSchemaType[]>> => {
    try {
        const skip = (currentPage - 1) * pageSize;

        // Build Prisma `where` object dynamically
        const baseFilter: any = {};

        // Add search to filter
        if (search.trim().length > 0) {
            baseFilter.full_name = { contains: search.trim(), mode: 'insensitive' };
        }

        // Add custom filters
        if (where && where.length > 0) {
            for (const filter of where) {
                baseFilter[filter.key] = filter.value;
            }
        }

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
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
                },
                where: {
                    AND: [
                        baseFilter,
                        { role: { not: "superadmin" } }
                    ]
                },
            }),
            prisma.user.count({ where: baseFilter }),
        ]);
        const newData = data.map(e => ({ ...e, password: undefined }))
        return {
            success: true,
            data: newData,
            pagination: {
                currentPage,
                total,
                pageSize,
            },
        };
    } catch (error) {
        console.log('❌Error: Fetching Users', error);
        return { success: false, error };
    }
};

//  fetch user by email 

export const FetchUserByEmail = async ({ email, role = "citizen" }: { email: string, role?: RoleType }): Promise<GeneralResponse<UserSingleSelectType>> => {
    try {
        const user = await prisma.user.findUnique({
            where: { email, role: role }
        })
        if (user) {
            return {
                success: true,
                data: { ...user }
            }
        }
        return {
            success: false,
            error: 'User not found'
        }
    } catch (error: any) {
        console.log('Error: fetching user by email');
        return {
            success: false,
            error: error.message || 'Failed to fetch user'
        }

    }
}

// <================================== Update One ==============================>


export const UpdateUser = async (user: UpdateUserSchemaType): Promise<GeneralResponse<UserSelectSchemaType>> => {
    try {
        const file = user.profile_picture
        const oldURL = user.old_picture
        let url = undefined;
        if (file) {
            const res = await UploadProfile(file, oldURL)
            if (res.newUrl && !res.error) {
                url = res.newUrl
            }
        }
        let role = {}
        if (user.role) {
            role = { role: user.role }
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: user.user_id }
            ,
            data: {
                full_name: user.full_name,
                email: user.email,
                aadhaar_number: user.aadhaar_number,
                profile_picture: url || undefined,
                contact_number: user.contact_number,
                date_of_birth: new Date(user.date_of_birth),
                gender: user.gender as GenderType,
                updated_at: new Date(),
                ...role,
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

        return { success: true, data: { ...updatedUser, password: undefined } }
    } catch (error) {
        console.log('❌Error: Creating User', error);
        return { success: false, error }
    }
}

// <================================== Delete One ==============================>


export const DeleteUser = async ({ id }: { id: string }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.user.delete({
            where: { user_id: id }
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating User', error);
        return { success: false, error }
    }
}


// <================================== Delete One ==============================>


export const DeleteManyUser = async ({ ids }: { ids: string[] }): Promise<GeneralResponse<null>> => {
    try {
        await prisma.user.deleteMany({
            where: {
                user_id: {
                    in: ids
                }
            },
        })
        return { success: true }
    } catch (error) {
        console.log('❌Error: Creating User', error);
        return { success: false, error }
    }
}