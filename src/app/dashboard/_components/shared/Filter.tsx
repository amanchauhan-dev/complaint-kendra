'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FitlerProps {
    fields: {
        name: string;
        value: string;
    }[];
    label: string;
    placeholder: string;
    width?: number;
    value: string;
    setValue: (value: string) => void
}


function Filter({ fields, label, width = 180, value, setValue, placeholder = 'Select' }: FitlerProps) {
    return (
        <Select value={value} onValueChange={(e) => setValue(e)}>
            <SelectTrigger style={{ width }}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {fields.map((e, i) => {
                        return <SelectItem key={i} value={e.value}>{e.name}</SelectItem>
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default Filter