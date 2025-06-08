'use client';
import { FileText, LogIn, LogInIcon, LogOut, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Logo from '@/components/shared/logo';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { ProgressBarLink } from '@/contexts/progress-bar-provider';
import { useAuth } from '@/hooks/use-auth';
import React, { useState } from 'react';
import Profile from '@/components/shared/profile';
import { LinkType, NavigationList } from './links';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';



export default function Header() {
    const { user_id, role } = useAuth()
    return (
        <header className="w-full border-b bg-background shadow-sm  sticky top-0 z-50 h-[50px] flex justify-center px-4 md:px-20">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo and Title */}
                <ProgressBarLink showActive={false} href="/" className="text-lg md:text-xl font-bold flex items-center gap-2">
                    <Logo className={cn('md:text-xl')} />
                </ProgressBarLink>

                <div className='flex items-center gap-2 sm:gap-5 '>
                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex gap-7">
                        {NavigationList.map((link, index) => (
                            <ProgressBarLink
                                key={index}
                                href={link.href}
                                className="!text-sm font-medium hover:text-primary transition flex items-center gap-1"
                            >
                                {link.icon && React.createElement(link.icon, { className: "size-4" })} {link.label}
                            </ProgressBarLink>
                        ))}
                        <div className='flex  items-center gap-3'>
                            {!user_id && (
                                <>
                                    <ProgressBarLink
                                        href={'/login'}
                                        className="!text-sm font-medium hover:text-primary transition flex items-center gap-1"
                                    >
                                        <LogInIcon className='size-4' />  Login
                                    </ProgressBarLink>
                                    <ProgressBarLink
                                        href={'/sign-up'}
                                        className="!text-sm font-medium hover:text-primary transition flex items-center gap-1"
                                    >
                                        Register
                                    </ProgressBarLink>
                                </>
                            )
                            }
                            <ModeToggle />
                        </div>
                    </nav>
                    {role && role != 'citizen' && (
                        <ProgressBarLink href={'/dashboard'} className='cursor-pointer hidden sm:flex'>
                            <Button size={'sm'} className='p-2 !text-[12px] 
                            dark:bg-primary/70 hover:bg-primary/50 cursor-pointer'>Dashboard</Button> </ProgressBarLink>
                    )}
                    {user_id && <Profile />}
                    <div className="lg:hidden">
                        <MobileSheet />
                    </div>
                </div>
            </div>
        </header>
    );
}




export function MobileSheet() {
    const [open, setOpen] = useState<boolean>(false)
    const { user_id, logout, user, role } = useAuth()
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size={'icon'} variant={'ghost'}><Menu /></Button>
            </SheetTrigger>
            <SheetContent className='max-w-[300px]'>
                <SheetHeader>
                    <SheetTitle className='hidden'></SheetTitle>
                    <Logo />
                </SheetHeader>
                <div>
                    {user_id && user && <ProgressBarLink showActive={false} href={'/'} callBack={() => setOpen(false)} className='flex gap-1 items-center hover:bg-muted transition-colors rounded-md'>
                        <Button size={'icon'} variant={'ghost'}>
                            <span><Avatar className="h-7 w-7 rounded-full">
                                <AvatarImage loading="lazy" src={user?.profile_picture || ''} alt={user?.full_name} className="object-center" />
                                <AvatarFallback className="rounded-full bg-primary/90 dark:bg-primary/60 text-white">{
                                    user?.full_name?.charAt(0)
                                }</AvatarFallback>
                            </Avatar></span>
                        </Button>
                        <h1>Profile</h1>
                    </ProgressBarLink>
                    }
                    {NavigationList.map((link, index) => {
                        if (link.isAuth && link.isAuth == true && !user_id) {
                            return null
                        }
                        return <MobileItme link={link} callBack={() => setOpen(false)} key={index} />
                    })}
                </div>
                <SheetFooter>
                    {role && role != 'citizen' && (
                        <ProgressBarLink href={'/dashboard'} callBack={() => setOpen(false)} className='cursor-pointer'>
                            <Button size={'sm'} className='p-2 !text-[12px] 
                            dark:bg-primary/70 hover:bg-primary/50 cursor-pointer w-full'>Dashboard</Button> </ProgressBarLink>
                    )}
                    {!user_id ? (
                        <>
                            <ProgressBarLink href={'/login'} className='flex w-full'>
                                <Button type="button" className='w-full'>Login <LogIn /></Button>
                            </ProgressBarLink>
                            <ProgressBarLink href={'/sign-up'} className='flex w-full'>
                                <Button type='button' className='w-full' variant="outline">Register <FileText /></Button>
                            </ProgressBarLink>
                        </>
                    ) :
                        <Button className="w-full" type='button' variant={'outline'} onClick={logout}>
                            Logout <LogOut />
                        </Button>
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}


const MobileItme = ({ link, callBack }: { link: LinkType, callBack: () => void }) => {
    return (
        <ProgressBarLink href={link.href} callBack={callBack} className='flex gap-1 items-center hover:bg-muted transition-colors rounded-md'>
            <Button size={'icon'} variant={'ghost'}>
                {link.icon && <span>{React.createElement(link.icon)}</span>}
            </Button>
            <h1>{link.label}</h1>
        </ProgressBarLink>
    )
}

