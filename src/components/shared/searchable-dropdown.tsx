'use client'

import { useEffect, useState } from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { X } from 'lucide-react'
import Loader from './loader'

type SearchableDropdownProps<T extends Record<string, any>> = {
    data: T[]
    search: string
    rowId?: keyof T
    rowName: keyof T
    setSearch: (x: string) => void;
    changedData?: T | null,
    onChangeData?: (x: T | null) => void,
    loading?: boolean;
    className?: string;
    lable?: string;
    disable?: boolean;
    clearCallBack?: () => void
}

export default function SearchableDropdown<T extends Record<string, any>>({
    data,
    search,
    changedData = null,
    rowId,
    loading = false,
    onChangeData = () => { },
    rowName,
    setSearch,
    disable = false,
    lable = 'Select',
    className = '',
    clearCallBack = () => { }
}: SearchableDropdownProps<T>) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<T | null>(changedData)

    useEffect(() => {
        setSelected(changedData)
    }, [changedData])

    const handleSelect = (item: T) => {
        setSelected(item)
        onChangeData(item)
        setOpen(false)
        setSearch('') // optional: clear search on select
    }

    const handleClear = () => {
        setSelected(null)
        onChangeData(null)
        setSearch('')
        clearCallBack?.()
    }

    return (
        <div >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button disabled={disable} type='button' className={"grid grid-cols-[auto_24px] border-2 p-1.5 rounded-md bg-muted/50 items-center gap-1 cursor-pointer hover:bg-secondary disabled:bg-accent " + className}>
                        <div className=" truncate">
                            {selected ? selected[rowName] : lable}
                        </div>
                        {selected && (
                            <X
                                className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer"
                                onClick={handleClear}
                            />
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 max-h-52 overflow-auto">
                    {!selected && (
                        <Command>
                            <CommandInput
                                placeholder="Search..."
                                value={search}
                                onValueChange={setSearch}
                            />
                            <CommandEmpty>No item found.</CommandEmpty>
                            {loading && <CommandGroup>
                                <CommandItem><Loader /></CommandItem>
                            </CommandGroup>}
                            <CommandGroup>
                                {
                                    data
                                        .filter((item) =>
                                            (item[rowName] as string)
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        )
                                        .map((item) => (
                                            <CommandItem
                                                key={(rowId ? item[rowId] : item[rowName]) as string}
                                                onSelect={() => handleSelect(item)}
                                            >
                                                {item[rowName]}
                                            </CommandItem>
                                        ))}
                            </CommandGroup>
                        </Command>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}
