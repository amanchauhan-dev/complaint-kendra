'use client'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function SearchBox({
    value,
    setValue,
}: {
    value: string
    setValue: (x: string) => void
}) {
    const [localValue, setLocalValue] = useState(value)

    // Sync outer value -> local value if needed
    useEffect(() => {
        setLocalValue(value)
    }, [value])

    // Debounce effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            setValue(localValue)
        }, 500) // debounce delay (500ms)

        return () => clearTimeout(timeout)
    }, [localValue, setValue])

    const handleEmpty = () => {
        setLocalValue('')
        setValue('')
    }

    return (
        <div className='grid items-center grid-cols-[25px_auto_25px] w-full max-w-[600px] px-2 border-1 rounded-md overflow-hidden mx-auto'>
            <div className='flex justify-center items-center'>
                <Search size={20} />
            </div>
            <Input
                placeholder='search...'
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className='border-0 min-w-[200px] !bg-background rounded-0 focus-visible:ring-0'
            />
            <div onClick={handleEmpty} className='cursor-pointer flex justify-center items-center'>
                {(localValue.trim()).length !== 0 && <X size={20} />}
            </div>
        </div>
    )
}

export default SearchBox
