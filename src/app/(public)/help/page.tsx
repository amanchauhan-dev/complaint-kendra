import { Metadata } from 'next'
import React from 'react'
import { Help } from './help'

export const metadata: Metadata = {
    title: "Help",
}
function page() {
    return <Help />
}

export default page