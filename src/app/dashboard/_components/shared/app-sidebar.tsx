"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "@/components/shared/logo"
import { FileText, Grid2X2, MapPin, Shapes, User, Warehouse } from "lucide-react"
import { ProgressSideBarLink } from "@/contexts/progress-bar-provider"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Grid2X2,
        }, {
            title: "Compalaints",
            url: "/dashboard/complaints",
            icon: FileText,
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: User
        },
        {
            title: "Department & Officers",
            url: "/dashboard/departments-officers",
            icon: Warehouse,
            items: [
                {
                    title: "Departments",
                    url: "/dashboard/departments-officers/departments",
                },
                {
                    title: "Officers",
                    url: "/dashboard/departments-officers/officers",
                }
            ],
        },
        {
            title: "Categories",
            url: "#",
            icon: Shapes,
            items: [
                {
                    title: "Main Categories",
                    url: "/dashboard/categories/main-categories",
                },
                {
                    title: "Sub Categores",
                    url: "/dashboard/categories/sub-categories",
                },
            ],
        },
        {
            title: "Locations",
            url: "/dashboard/locations",
            icon: MapPin,
            items: [
                {
                    title: "Districts",
                    url: "/dashboard/locations/districts",
                },
                {
                    title: "Sub Divisions",
                    url: "/dashboard/locations/subdivisions",
                },
                {
                    title: "Talukas",
                    url: "/dashboard/locations/talukas",
                },
            ],
        },
    ],
    navClouds: [
    ],
    navSecondary: [
    ],
    documents: [
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5 data-[slot=sidebar-menu-button]:!pl-0"
                        >
                            <ProgressSideBarLink showActive={false} href="/dashboard" className="hover:bg-none" title="Dashboard">
                                <Logo />
                            </ProgressSideBarLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}


