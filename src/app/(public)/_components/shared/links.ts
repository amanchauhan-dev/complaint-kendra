import { CircleHelp, Contact, FileQuestion, FileText, Home, LucideIcon, MousePointer2 } from 'lucide-react';
export type LinkType = {
    href: string;
    label: string;
    icon?: LucideIcon,
    isAuth?: boolean,
}
export const NavigationList: LinkType[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/faq', label: 'FAQs', icon: FileQuestion },
    { href: '/file-complaint', label: 'File Complaint', icon: FileText, isAuth: true },
    { href: '/contact-us', label: 'Contact', icon: Contact },
];


export const SocialLinks: LinkType[] = [
    { href: '/', label: 'Home', icon: Home },

]

export const quickLinks: LinkType[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/faq', label: 'FAQs', icon: FileQuestion },
    { href: '/file-complaint', label: 'File Complaint', icon: FileText, isAuth: true },
    { href: '/contact-us', label: 'Contact', icon: Contact },
]
export const supportLinks: LinkType[] = [
    { href: '/terms-conditions', label: 'Terms & Conditions', icon: Home },
    { href: '/about-us', label: 'About Us', icon: MousePointer2 },
    { href: '/help', label: 'Help', icon: CircleHelp },
]