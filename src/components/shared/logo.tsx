import Image from 'next/image'
import React from 'react'

function Logo({ className = '', showText = true }: { className?: string, showText?: boolean; showImage?: boolean }) {
    return (
        <h1 className={`font-bold flex items-center gap-2 ${className}`}>
            <Image src={'/logo.jpg'} alt='Logo' width={30} height={30} className={"rounded " + className} />
            {showText &&
                <>
                    <span className='text-primary'>Complaint</span><span>- Kendra</span>
                </>
            }

        </h1>
    )
}

export default Logo