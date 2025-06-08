'use client'
import { Button } from "@/components/ui/button"
import {
    Sun,
    Moon,
    Laptop,
} from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import Logo from "@/components/shared/logo"
import { quickLinks, supportLinks } from "./links"
import React from "react"
import { useAuth } from "@/hooks/use-auth"

export default function Footer() {
    const { setTheme } = useTheme()
    const { user_id } = useAuth()
    const path = usePathname()
    return (
        <footer className={cn("bg-background border-t mt-auto hide-resume", {
            "hidden": path.startsWith('/kendra-bot')
        })}>
            <div className="container px-4 pt-12 md:pt-16">
                <div className="grid grid-cols-1 items-center md:grid-cols-3  gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4 md:mx-auto">
                        <div className="flex flex-col space-y-2">
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="mr-2 h-4 w-4" />
                                Light Mode
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="mr-2 h-4 w-4" />
                                Dark Mode
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setTheme("system")}
                                className="justify-start"
                            >
                                <Laptop className="mr-2 h-4 w-4" />
                                System Preference
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 md:mx-auto">
                        <h3 className="text-sm font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map(link => {
                                if (link.isAuth && link.isAuth == true && !user_id) {
                                    return null
                                }
                                return (
                                    <li key={link.href}>
                                        <ProgressBarLink href={link.href} className="text-sm text-muted-foreground hover:text-primary flex items-center">
                                            {React.createElement(link.icon || '', { className: "mr-2 h-4 w-4" })}
                                            {link.label}
                                        </ProgressBarLink>
                                    </li>
                                )
                            })}

                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-3 md:mx-auto">
                        <h3 className="text-sm font-semibold">Support</h3>
                        <ul className="space-y-2">
                            {supportLinks.map(link => {
                                if (link.isAuth && link.isAuth == true && !user_id) {
                                    return null
                                }
                                return (
                                    <li key={link.href}>
                                        <ProgressBarLink href={link.href} className="text-sm text-muted-foreground hover:text-primary flex items-center">
                                            {React.createElement(link.icon || '', { className: "mr-2 h-4 w-4" })}
                                            {link.label}
                                        </ProgressBarLink>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>


                </div>

                {/* Copyright */}
                <div className="mt-12 pt-2 border-t text-sm text-muted-foreground text-center my-2">
                    <div className="flex justify-center gap-2 flex-wrap items-center">© {new Date().getFullYear()} <Logo className={cn('text-[10px]')} showText={false} /> . All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}