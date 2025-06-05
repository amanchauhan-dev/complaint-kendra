import React from 'react'
import AboutUs from './about-us'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "About us",
}
function page() {
    return <AboutUs />
}

export default page