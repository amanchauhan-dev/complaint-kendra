import React from 'react'
import ComplaintForm from './complaint-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "File Complaint"
}

function page() {
    return (
        <div>
            <ComplaintForm />
        </div>
    )
}

export default page