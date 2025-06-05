'use client'
import { Button } from "@/components/ui/button"
import {
    Sun,
    Moon,
    Laptop,
    Github,
    Twitter,
    Linkedin,
} from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import Logo from "@/components/shared/logo"
import { quickLinks, supportLinks } from "./links"
import React from "react"

export default function Footer() {
    const { setTheme } = useTheme()
    const path = usePathname()
    return (
        <footer className={cn("bg-background border-t mt-auto hide-resume", {
            "hidden": path.startsWith('/builder')
        })}>
            <div className="container px-4 pt-12 md:pt-16">
                <div className="grid grid-cols-1 items-center md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4 md:mx-auto">
                        <div className="flex items-center space-x-2">
                            <Logo className={cn('md:text-xl')} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Build professional resumes in minutes. Free forever.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon">
                                <Github className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 md:mx-auto">
                        <h3 className="text-sm font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map(link => {
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

                    {/* Theme Switcher */}
                    <div className="space-y-3 md:mx-auto">
                        <h3 className="text-sm font-semibold">Appearance</h3>
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
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-2 border-t text-sm text-muted-foreground text-center my-2">
                    <div className="flex justify-center gap-2 items-center">© {new Date().getFullYear()} <Logo className={cn('text-sm')} /> . All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}