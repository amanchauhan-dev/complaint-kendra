import React from 'react'
import { TermsAndConditions } from './terms'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Terms & Conditions",
}
function page() {
    return <TermsAndConditions />
}

export default page