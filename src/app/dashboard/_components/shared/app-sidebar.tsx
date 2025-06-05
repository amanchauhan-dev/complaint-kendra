"use client"

import * as React from "react"
// import {
// IconCamera,
// IconDatabase,
// IconFileAi,
// IconFileDescription,
//     IconFileWord,
//     IconHelp,
//     IconReport,
//     IconSearch,
//     IconSettings,
// } from "@tabler/icons-react"

import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
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
import { FileText, Grid2X2, MapPin, Shapes, User } from "lucide-react"
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
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: Settings2,
        //     items: [
        //         {
        //             title: "General",
        //             url: "#",
        //         },
        //         {
        //             title: "Team",
        //             url: "#",
        //         },
        //         {
        //             title: "Billing",
        //             url: "#",
        //         },
        //         {
        //             title: "Limits",
        //             url: "#",
        //         },
        //     ],
        // },
    ],
    navClouds: [
        // {
        //     title: "Capture",
        //     icon: IconCamera,
        //     isActive: true,
        //     url: "#",
        //     items: [
        //         {
        //             title: "Active Proposals",
        //             url: "#",
        //         },
        //         {
        //             title: "Archived",
        //             url: "#",
        //         },
        //     ],
        // },
        // {
        //     title: "Proposal",
        //     icon: IconFileDescription,
        //     url: "#",
        //     items: [
        //         {
        //             title: "Active Proposals",
        //             url: "#",
        //         },
        //         {
        //             title: "Archived",
        //             url: "#",
        //         },
        //     ],
        // },
        // {
        //     title: "Prompts",
        //     icon: IconFileAi,
        //     url: "#",
        //     items: [
        //         {
        //             title: "Active Proposals",
        //             url: "#",
        //         },
        //         {
        //             title: "Archived",
        //             url: "#",
        //         },
        //     ],
        // },
    ],
    navSecondary: [
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: IconSettings,
        // },
        // {
        //     title: "Get Help",
        //     url: "#",
        //     icon: IconHelp,
        // },
        // {
        //     title: "Search",
        //     url: "#",
        //     icon: IconSearch,
        // },
    ],
    documents: [
        // {
        //     name: "Data Library",
        //     url: "#",
        //     icon: IconDatabase,
        // },
        // {
        //     name: "Reports",
        //     url: "#",
        //     icon: IconReport,
        // },
        // {
        //     name: "Word Assistant",
        //     url: "#",
        //     icon: IconFileWord,
        // },
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
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}


