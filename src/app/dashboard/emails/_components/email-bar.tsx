'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { data } from './data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FetchAllEmails } from '../action'
import { Email } from '../types'
import { format } from "date-fns"
function EmailBar() {
    const [emails, setEmails] = useState<Email[]>([])
    useEffect(() => {
        ; (async () => {
            const res = await FetchAllEmails({ limit: 10 });
            console.log(res);

            if (res.success && res.data) {
                setEmails(res.data)
            }
        })()
    }, [])
    return (
        <div className=' h-[calc(100svh-110px)] bg-muted/50 overflow-hidden grid grid-cols-[40px_auto] border-r-2'>
            <div className=' flex flex-col items-center py-4 gap-2'>
                {data.navMain.map((item) => (
                    <Button
                        key={item.title}
                        variant={'ghost'}
                        className="px-2.5 md:px-2"
                        size={'icon'}
                    >
                        <item.icon />
                    </Button>
                ))}
            </div>
            <ScrollArea className=' h-[calc(100svh-110px)] py-2'>
                {emails.map((mail) => (
                    <a
                        href="#"
                        key={mail.uid}
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 !text-xs leading-tight  last:border-b-0 rounded-md mb-1 mr-1 last:mb-0"
                    >
                        <div className="flex w-full items-center gap-2">
                            <span>{extractName(mail.from)}</span>{" "}
                            <span className="ml-auto text-xs">{format(new Date(mail.date.toString()), "yyy-MM-dd")}</span>
                        </div>
                        <span className="font-medium">{mail.subject}</span>
                        <span className="line-clamp-2 w-[200px] text-xs whitespace-break-spaces">
                            {mail.subject}
                        </span>
                    </a>
                ))}
            </ScrollArea>
        </div>
    )
}

export default EmailBar


export function extractEmail(input: string): string | null {
    const match = input.match(/<([^>]+)>/);
    return match ? match[1] : null;
}

export function extractName(input: string): string | null {
    const match = input.match(/"([^"]+)"\s*</);
    return match ? match[1] : null;
}