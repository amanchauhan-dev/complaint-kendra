import { SiteHeader } from "./_components/shared/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/shared/app-sidebar"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s - Dashboard",
        default: 'Dashboard'
    },
    description: "AI Powered Complaint Desposal System For Government",
};

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col px-4 lg:px-6 py-4 gap-4 md:gap-6 md:py-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout