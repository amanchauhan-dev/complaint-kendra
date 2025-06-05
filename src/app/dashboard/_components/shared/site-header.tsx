'use client'
import { ModeToggle } from "@/components/shared/mode-toggle"
import Profile from "@/components/shared/profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import { Home, Mail } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

export function SiteHeader() {
    const path = usePathname()
    const Title = useCallback(() => {
        const arr = path.trim().split('/')
        const title = arr[arr.length - 1]
        return title.charAt(0).toLocaleUpperCase() + title.substring(1)
    }, [path])();
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{Title}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <ProgressBarLink href={'/'} title="Go To Home Page">
                        <Button size='icon' variant={'ghost'}>
                            <Home />
                        </Button>
                    </ProgressBarLink>

                    <ProgressBarLink href={'/dashboard/emails'} title="Go To Home Page">
                        <Button size='icon' variant={'outline'} className="relative">
                            <Badge className="absolute bg-secondary text-primary w-5 h-5 rounded-full -right-1 -top-1">2</Badge>
                            <Mail />
                        </Button>
                    </ProgressBarLink>
                    <ModeToggle />
                    <Profile />
                </div>
            </div>
        </header>
    )
}
