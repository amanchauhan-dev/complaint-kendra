import { z } from "zod"
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const SignUpSchema = z
    .object({
        gender: z.string().min(1, "Required"),
        full_name: z.string().min(4, "Full name must be at least 4 characters long"),
        email: z.string().email("Invalid email address"),
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


export type SignUpSchemaType = z.infer<typeof SignUpSchema>


export const LoginSchem = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Required")
})

export type LoginSchemaType = z.infer<typeof LoginSchem>