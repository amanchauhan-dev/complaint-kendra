import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { HelpCircle, LogOut, Settings } from "lucide-react"

function Profile({ }: { className?: string }) {
    const { user, logout } = useAuth()
    if (!user) {
        return null
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage loading="lazy" src={user.profile_picture || ''} alt={user.full_name} className="object-center" />
                    <AvatarFallback className="rounded-full bg-primary/90 dark:bg-primary/60 text-white">{
                        user.full_name?.charAt(0)
                    }</AvatarFallback>
                </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[200px] mr-2">
                <DropdownMenuItem className="grid grid-cols-[24px_auto]">
                    <Avatar className="h-6 w-6 rounded-full">
                        <AvatarImage src={user.profile_picture || ''} alt={user.full_name} className="object-center" />
                        <AvatarFallback className="rounded-full bg-primary/50">{
                            user.full_name?.charAt(0)
                        }</AvatarFallback>
                    </Avatar>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="grid items-center grid-cols-[24px_auto]">
                    <HelpCircle className="m-auto" />
                    Help
                </DropdownMenuItem>
                <DropdownMenuItem className="grid items-center grid-cols-[24px_auto]">
                    <Settings className="m-auto" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="grid items-center grid-cols-[24px_auto]">
                    <LogOut className="m-auto" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Profile