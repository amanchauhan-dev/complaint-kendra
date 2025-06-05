import Image from 'next/image'
import React from 'react'

function Logo({ className = '' }: { className?: string }) {
    return (
        <h1 className={`font-bold flex items-center gap-2 ${className}`}>
            <Image src={'/logo.jpg'} alt='Logo' width={30} height={30} className={"rounded " + className} />
            <span className='text-primary'>Complaint</span>
            -Kendra
        </h1>
    )
}

export default Logo