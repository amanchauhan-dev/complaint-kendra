import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: {
        template: "%s - Complaint Kendra",
        default: 'Complaint Kendra'
    },
    description: "AI Powered Complaint Desposal System For Government",
};

function Layout({ children }: { children: React.ReactNode }) {
    return children
}

export default Layout