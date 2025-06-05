import { LoginForm } from "@/app/(auth)/login/login-form"
import Logo from "@/components/shared/logo"
import { Metadata } from "next"

import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
    title: "login"
}

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <Logo />
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/logo.jpg"
                    alt="Image"
                    width={200}
                    height={200}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    )
}
