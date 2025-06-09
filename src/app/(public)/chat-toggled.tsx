'use client'
import React, { useState } from 'react'
import KendraBot from './_components/kendra-bot'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Bot, X } from 'lucide-react'
import { ProgressBarLink } from '@/contexts/progress-bar-provider'
import { usePathname } from 'next/navigation'

function ChatToggled() {
    const [toggled, setToggled] = useState<boolean>(false)
    const path = usePathname()
    return (
        <>
            <Button size={'icon'} variant={'outline'} onClick={() => setToggled(true)} className={cn('fixed max-lg:!hidden right-6 md:right-20 top-16 ', {
                "!hidden": toggled || path.startsWith('/kendra-bot'),
                "!flex": !toggled && !path.startsWith('/kendra-bot'),
            })}>
                <Bot />
            </Button>

            <ProgressBarLink href={'/kendra-bot'} className={cn('fixed lg:!hidden right-6 md:right-20 top-16 ', {
                "!hidden": path.startsWith('/kendra-bot')
            })}>
                <Button size={'icon'} variant={'outline'} onClick={() => setToggled(true)} >
                    <Bot />
                </Button>
            </ProgressBarLink>
            <div className={cn(' sticky right-0 top-0 transition-all flex-nowrap duration-500 hidden lg:flex border-l-2 rounded-lg overflow-hidden', {
                "w-0": !toggled,
                "w-[450px]": toggled,
                "!hidden": path.startsWith('/kendra-bot')

            })}>
                <KendraBot headerRight={<Button size={'icon'} variant={'ghost'} onClick={() => setToggled(false)}><X /></Button>} />
            </div>
        </>
    )
}

export default ChatToggled