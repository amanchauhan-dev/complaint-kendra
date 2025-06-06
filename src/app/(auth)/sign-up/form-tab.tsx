'use client'

import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs"
import { SignUpForm } from "./signup-form"
import { InputOTPForm } from "@/components/shared/otp"
import { SignUpSchema, SignUpSchemaType } from "@/validations/auth-validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { emailSendOTP } from "@/email/email-send-otp"
import toast from "react-hot-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { checkUniqueFields, handleSignIn } from "../action"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function FormTab() {
    const [tab, setTab] = useState<'signup' | 'otp'>('signup')
    const [OTP, setOTP] = useState<string>()
    const [otpError, setOtpError] = useState<boolean>(false)
    const [otpLoading, setOtpLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const { setUser } = useAuth()
    const form = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            full_name: "",
            email: "",
            profile_picture: null,
            password: "",
            confirmPassword: "",
            date_of_birth: '',
            contact_number: "",
            aadhaar_number: '',
            address: {
                full_address: "",
                taluka_id: '',
                district_id: ""
            },
            gender: ''
        }
    })

    const onSubmit = async (value: SignUpSchemaType) => {
        if (form.getValues("profile_picture") == null) {
            toast.error("All fields are reuired")
            form.setError("profile_picture", { message: "Required" })
            return
        }
        setLoading(true)
        //  check email
        const uniqueRes = await checkUniqueFields(form.getValues('email'), form.getValues("aadhaar_number"))
        if (!uniqueRes.success && uniqueRes.data) {
            uniqueRes.data.forEach(e => {
                if (e == 'email') { form.setError(e, { message: "Email is in use." }) }
                if (e == 'aadhaar_number') { form.setError(e, { message: "Aadhaar number is in use." }) }
            })
            setLoading(false)
            return
        }
        // send otp
        const otp = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0');
        setOTP(otp)
        const res = await emailSendOTP({ to: value.email, otp })
        if (res.success) {
            toast.success("OTP sent")
            setTab('otp')
        }
        else {
            toast.error("Failed to send OTP")
        }
        setLoading(false)
    }
    const SaveData = async (otp: string) => {
        if (otp !== OTP) {
            setOtpError(true)
            return
        }
        setOtpLoading(true)
        const res = await handleSignIn(form.getValues())
        if (res.success && res.data) {
            setUser(res.data)
            toast.success("Signed in successfully")
            router.push('/')
        }
        else {
            toast.error("Something went wrong.")
        }
        setOtpLoading(false)
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs value={tab}>
                <TabsContent value="signup">
                    {OTP && <div className="my-1 flex justify-end">
                        <Button onClick={() => setTab('otp')} type="button" size='icon'><ChevronRight /></Button>
                    </div>}
                    <SignUpForm onSubmit={onSubmit} form={form} loading={loading} setTab={setTab} />
                </TabsContent>
                <TabsContent value="otp">
                    <div className="my-4">
                        <Button onClick={() => setTab('signup')} type="button" size='icon'><ChevronLeft /></Button>
                    </div>
                    <InputOTPForm email={form.getValues('email')} loading={otpLoading} otpError={otpError} callBack={(x) => SaveData(x)} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
