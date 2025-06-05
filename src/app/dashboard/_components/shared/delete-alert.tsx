
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DeleteAlert({ open, setOpen = () => { }, description, openNode, title, onAggre }: {
    open?: boolean;
    setOpen?: (x: boolean) => void;
    description?: string;
    openNode?: React.ReactNode;
    title?: string;
    onAggre?: () => void
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {openNode ? openNode : <Button variant="outline">Show Dialog</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-600">{title ? title : "Are you absolutely sure?"}</DialogTitle>
                    <DialogDescription>
                        {description ? description : "This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button className="bg-primary hover:bg-primary/80" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-500" onClick={onAggre}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
