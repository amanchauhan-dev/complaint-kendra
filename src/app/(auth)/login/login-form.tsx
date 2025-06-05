'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import { LoginSchem, LoginSchemaType } from "@/validations/auth-validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import Loader from "@/components/shared/loader"
import { handleLogin } from "../action"
import { useAuth } from "@/hooks/use-auth"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
export function LoginForm() {
    const { setUser } = useAuth()
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchem),
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const onSubmit = async (values: LoginSchemaType) => {
        setLoading(true)
        const res = await handleLogin(values);
        if (res.success && res.data) {
            setUser(res.data)
            toast.success('Logged in')
            router.push('/')
        } else {
            toast.error('Invalid Credentials')
        }
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form className={cn("flex flex-col gap-6")} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='xyz@example.com' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder='Password' {...field} />
                                </FormControl>
                                <FormMessage />
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader /> : "Login"}
                    </Button>

                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <ProgressBarLink href="/sign-up" className="underline underline-offset-4">
                        Sign up
                    </ProgressBarLink>
                </div>
            </form>
        </Form>

    )
}
