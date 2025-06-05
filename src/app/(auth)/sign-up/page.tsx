import Logo from "@/components/shared/logo"
// import { SignUpForm } from "@/app/(auth)/sign-up/signup-form"
import { Metadata } from "next"

import Image from "next/image"
import Link from "next/link"
import { FormTab } from "./form-tab"

export const metadata: Metadata = {
    title: "SignUp"
}

export default function page() {
    return (
        <div className="grid max-h-svh lg:grid-cols-2">
            <div className="relative hidden lg:block overflow-hidden">
                <Image
                    src="/logo.jpg"
                    alt="Image"
                    width={200}
                    height={200}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
            <div className="flex flex-col h-svh overflow-auto gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <Logo />
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full">
                        {/* <SignUpForm /> */}
                        <FormTab />
                    </div>
                </div>
            </div>

        </div>
    )
}
