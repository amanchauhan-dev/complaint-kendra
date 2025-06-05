'use client'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';

function RowActions({ onDelete = () => { }, onEdit = () => { } }: { onDelete?: () => void; onEdit?: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='min-w-[150px]'>
                <DropdownMenuItem disabled>
                    Actions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className='flex items-center text-red-600 hover:!text-red-600'>
                    <Trash className='text-red-600' />
                    <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit} className='flex items-center'>
                    <Edit />
                    <span>Edit</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default RowActions