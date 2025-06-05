import { AuthContext } from "@/contexts/auth-provider";
import { useContext } from "react";

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx
}