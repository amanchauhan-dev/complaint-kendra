'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useState } from "react";

export interface SharedDialogProps {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: (x: boolean) => void;
    description?: string;
    openNode?: React.ReactNode;
    title: string;
    className?: string;
}

const SharedCreateDialog: React.FC<SharedDialogProps> = (props) => {
    const [openDialog, setOpenDialog] = useState<boolean>()
    const { children, title, description, openNode, className = '', open = openDialog, setOpen = setOpenDialog } = props;
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {openNode ? openNode : <Button>Open</Button>}
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[425px]  max-h-[95svh] overflow-y-auto ${className}`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}


export default SharedCreateDialog