import React from 'react'
import Header from './_components/shared/Header'
import Footer from './_components/shared/footer'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: {
        template: "%s - Complaint Kendra",
        default: 'Complaint Kendra'
    },
    description: "AI Powered Complaint Desposal System For Government",
};

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col w-screen min-h-screen'>
            <Header />
            <main className='px-4 md:px-20 space-y-2 py-2 grow'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout