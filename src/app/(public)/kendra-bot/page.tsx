import { Metadata } from 'next'
import React from 'react'
import KendraBot from '../_components/kendra-bot'

export const metadata: Metadata = {
    title: "Kendra Bot"
}
function page() {
    return (
        <div className='h-full max-w-5xl mx-auto border-2 rounded-lg'>
            <KendraBot />
        </div>
    )
}

export default page