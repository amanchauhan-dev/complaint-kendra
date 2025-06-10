'use client'

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { CountDistricts, CountTalukas } from "../action"



function AIBox() {
    const [districts, setDistricts] = useState<number | null>(null)
    const [talukas, setTalukas] = useState<number | null>(null)
    useEffect(() => {
        ; (async () => {
            const [resDistricts, resTalukas] = await Promise.all([
                CountDistricts(),
                CountTalukas()
            ])
            if (resDistricts.success && resDistricts.data) {
                setDistricts(resDistricts.data)
            }
            if (resTalukas.success && resTalukas.data) {
                setTalukas(resTalukas.data)
            }

        })()
    }, [])
    return (
        <div className=" h-full min-h-40 w-full border-1 rounded-md flex flex-col gap-2 justify-between">
            <DistrictsCard data={districts ? { total: districts } : null} />
            <TalukasCard data={talukas ? { total: talukas } : null} />
        </div>
    )
}

export default AIBox

type CardDataType = {
    total: number;
}


export const CardLoader = () => {
    return (
        <div className="@container/card flex gap-5 flex-col h-40 m-2">
            <Skeleton className="h-40" />
        </div>
    )
}

export const DistrictsCard = ({ data = null }: { data: CardDataType | null }) => {
    if (!data) {
        return <CardLoader />
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total District</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.total}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                    These are the total active districts using complplaint kendra
                </div>
            </CardFooter>
        </Card>
    )
}

export const TalukasCard = ({ data = null }: { data: CardDataType | null }) => {
    if (!data) {
        return <CardLoader />
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total Talukas</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.total}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                    These are the total active talukas using complplaint kendra
                </div>
            </CardFooter>
        </Card>
    )
}
