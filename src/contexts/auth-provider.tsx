'use client'
import { checkAuth, handleLogout } from "@/app/(auth)/action";
import { RoleType } from "@/validations/enums";
import { UserSelectSchemaType } from "@/validations/models/user-validation";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type AuthContextProps = {
    user: UserSelectSchemaType | null;
    setUser: (user: UserSelectSchemaType | null) => void;
    role: RoleType | null;
    user_id: string | null;
    logout: () => void
};



export const AuthContext = createContext<AuthContextProps | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserSelectSchemaType | null>(null)
    const [user_id, setUser_Id] = useState<string | null>(null)
    const [role, setRole] = useState<RoleType | null>(null)
    const router = useRouter()
    const handleSetUser = (x: UserSelectSchemaType | null) => {
        setUser(x)
        setUser_Id(x?.user_id || null)
        setRole(x?.role || null)
    }
    const Logout = async () => {
        const res = await handleLogout()
        if (res.success) {
            setUser(null)
            setUser_Id(null)
            setRole(null)
            toast.success("Logged out")
            router.push('/login')
        } else {
            toast.error("Unable to logout")
        }
    }

    useEffect(() => {
        ; (async () => {
            const res = await checkAuth();
            if (res.success && res.data) {
                handleSetUser(res.data)
            }
            else {
                setUser(null)
            }
        })()
    }, [])
    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, role: role, user_id: user_id, logout: Logout }} >
            {children}
        </AuthContext.Provider>
    )
}