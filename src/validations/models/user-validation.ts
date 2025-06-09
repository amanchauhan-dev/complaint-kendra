import { z } from "zod"
import { GenderSchema, RoleSchema, StatusSchema } from "../enums"
import { AddressSelectSchema } from "./address-validation";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const UserSchema = z.object({
    gender: GenderSchema,
    status: StatusSchema,
    role: RoleSchema,
    user_id: z.string().uuid(),
    full_name: z.string(),
    email: z.string(),
    password: z.string(),
    contact_number: z.string(),
    date_of_birth: z.date(),
    profile_picture: z.string().nullable(),
    aadhaar_number: z.string(),
    last_login: z.date().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
    address_id: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>


export const UserRowSchema = UserSchema.extend({
    password: z.string().optional(),
})

export type UserRowSchemaType = z.infer<typeof UserRowSchema>



export const UserSelectSchema = UserSchema.extend({
    password: z.string().optional(),
    address: AddressSelectSchema.nullable()
})


export const UserSingleSelect = UserSchema.omit({ password: true })
export type UserSingleSelectType = z.infer<typeof UserSingleSelect>

export const UserSelectMultipleSchema = UserSelectSchema.omit({
    password: true
})
export type UserSelectMultipleSchemaType = z.infer<typeof UserSelectMultipleSchema>

export type UserSelectSchemaType = z.infer<typeof UserSelectSchema>


export const CreateUserSchema = z
    .object({
        gender: z.string().min(1, "Required"),
        full_name: z.string().min(4, "Full name must be at least 4 characters long"),
        email: z.string().email("Invalid email address"),
        role: RoleSchema.default("citizen").optional(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        contact_number: z
            .string()
            .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
        date_of_birth: z
            .string()
            .min(1, "Required")
            .refine((dob) => {
                const dobDate = new Date(dob)
                if (isNaN(dobDate.getTime())) { return false }

                const today = new Date()
                const age = today.getFullYear() - dobDate.getFullYear()
                const m = today.getMonth() - dobDate.getMonth()
                const isBirthdayPassed =
                    m > 0 || (m === 0 && today.getDate() >= dobDate.getDate())
                return age > 18 || (age === 18 && isBirthdayPassed)
            }, {
                message: "You must be at least 18 years old",
            }),
        profile_picture: z
            .union([
                z.instanceof(File)
                    .refine((file) => file.size <= MAX_FILE_SIZE, "Image size must be less than 2MB")
                    .refine((file) => IMAGE_TYPES.includes(file.type), "Invalid image format"),
                z.null(), // Allow null values
            ]),
        aadhaar_number: z
            .string()
            .regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
        address: z.object({
            full_address: z.string().min(10, "Address must be at least 10 characters long"),
            taluka_id: z.string().min(1, "Taluka is required"),
            district_id: z.string().min(1, "District is required")
        })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })


export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>


export const UpdateUserSchema = z.object({
    user_id: z.string(),
    gender: z.string().min(1, "Required"),
    role: RoleSchema.default("citizen").optional(),
    full_name: z.string().min(4, "Full name must be at least 4 characters long"),
    email: z.string().email("Invalid email address"),
    contact_number: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    date_of_birth: z
        .string()
        .min(1, "Required")
        .refine((dob) => {
            const dobDate = new Date(dob)
            if (isNaN(dobDate.getTime())) { return false }

            const today = new Date()
            const age = today.getFullYear() - dobDate.getFullYear()
            const m = today.getMonth() - dobDate.getMonth()
            const isBirthdayPassed =
                m > 0 || (m === 0 && today.getDate() >= dobDate.getDate())
            return age > 18 || (age === 18 && isBirthdayPassed)
        }, {
            message: "You must be at least 18 years old",
        }),
    profile_picture: z
        .union([
            z.instanceof(File)
                .refine((file) => file.size <= MAX_FILE_SIZE, "Image size must be less than 2MB")
                .refine((file) => IMAGE_TYPES.includes(file.type), "Invalid image format"),
            z.null(), // Allow null values
        ]),
    old_picture: z.string().optional().nullable(),
    aadhaar_number: z
        .string()
        .regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
    address: z.object({
        full_address: z.string().min(10, "Address must be at least 10 characters long"),
        taluka_id: z.string().min(1, "Taluka is required"),
        district_id: z.string().min(1, "District is required")
    })
})

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>