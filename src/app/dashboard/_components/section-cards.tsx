'use client'
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { FetchNewComplaintsReport, FetchRejectedComplaintsReport, FetchResolvedComplaintsReport, FetchUsersReport } from "../action"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"


type CardDataType = {
    total: number;
    growth: number;
    new: number;
}


export function SectionCards() {
    const [user, setUser] = useState<CardDataType | null>(null)
    const [complaint, setComplaint] = useState<CardDataType | null>(null)
    const [rejectedComplaint, setRejectedComplaint] = useState<CardDataType | null>(null)
    const [resolvedComplaint, setResolvedComplaint] = useState<CardDataType | null>(null)

    useEffect(() => {
        ; (async () => {
            const [userRes, newCompRes, resolvedCompRes, rejectedComprES] = await Promise.all([
                FetchUsersReport(),
                FetchNewComplaintsReport(),
                FetchResolvedComplaintsReport(),
                FetchRejectedComplaintsReport()
            ])
            if (userRes.success && userRes.data) {
                setUser(userRes.data)
            }
            if (newCompRes.success && newCompRes.data) {
                setComplaint(newCompRes.data)
            }
            if (resolvedCompRes.success && resolvedCompRes.data) {
                setResolvedComplaint(resolvedCompRes.data)
            }
            if (rejectedComprES.success && rejectedComprES.data) {
                setRejectedComplaint(rejectedComprES.data)
            }
        })()
    }, [])
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <UserCard data={user} />
            <NewComplaintsCard data={complaint} />
            <ResolvedComplaintsCard data={resolvedComplaint} />
            <RejectedComplaintsCard data={rejectedComplaint} />
        </div>
    )
}


export const CardLoader = () => {
    return (
        <div className="@container/card flex gap-5 flex-col h-40 m-2">
            <Skeleton className="h-40" />
        </div>
    )
}


export const UserCard = ({ data = null }: { data: CardDataType | null }) => {
    if (!data) {
        return <CardLoader />
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total User</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.total}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline" className={cn({
                        "text-destructive": data && data?.growth < 0,
                        "text-green-600": data && data?.growth > 0,
                    })}>
                        {data && data?.growth > 0 ?
                            <IconTrendingUp />
                            : <IconTrendingDown />
                        }
                        {data?.growth}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <h1>New Users: {data?.new}</h1>
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {data && data?.growth > 0 ?
                        <>Up this month <IconTrendingUp className="size-4" /></>
                        : <>Down this month <IconTrendingDown className="size-4" /></>
                    }
                </div>
                <div className="text-muted-foreground">
                    Overall growth:{data?.growth}
                </div>
            </CardFooter>
        </Card>
    )
}


export const NewComplaintsCard = ({ data = null }: { data: CardDataType | null }) => {
    if (!data) {
        return <CardLoader />
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total Complaints</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.total}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline" className={cn({
                        "text-destructive": data && data?.growth < 0,
                        "text-green-600": data && data?.growth > 0,
                    })}>
                        {data && data?.growth > 0 ?
                            <IconTrendingUp />
                            : <IconTrendingDown />
                        }
                        {data?.growth}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <h1>New Complaints: {data?.new}</h1>
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {data && data?.growth > 0 ?
                        <>Up this month <IconTrendingUp className="size-4" /></>
                        : <>Down this month <IconTrendingDown className="size-4" /></>
                    }
                </div>
                <div className="text-muted-foreground">
                    Overall growth:{data?.growth}
                </div>
            </CardFooter>
        </Card>
    )
}
export const ResolvedComplaintsCard = ({ data = null }: { data: CardDataType | null }) => {
    if (!data) {
        return <CardLoader />
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total Resolved Complaints</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.total}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline" className={cn({
                        "text-destructive": data && data?.growth < 0,
                        "text-green-600": data && data?.growth > 0,
                    })}>
                        {data && data?.growth > 0 ?
                            <IconTrendingUp />
                            : <IconTrendingDown />
                        }
                        {data?.growth}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <h1>New Resolved Complaints: {data?.new}</h1>
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {data && data?.growth > 0 ?
                        <>Up this month <IconTrendingUp className="size-4" /></>
                        : <>Down this month <IconTrendingDown className="size-4" /></>
                    }
                </div>
                <div className="text-muted-foreground">
                    Overall growth:{data?.growth}
                </div>
            </CardFooter>
        </Card>
    )
}
export const RejectedComplaintsCard = ({ data = null }: { data: CardDataType | null }) => {
    if (!data) {
        return <CardLoader />
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total Rejected Complaints</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.total}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline" className={cn({
                        "text-destructive": data && data?.growth < 0,
                        "text-green-600": data && data?.growth > 0,
                    })}>
                        {data && data?.growth > 0 ?
                            <IconTrendingUp />
                            : <IconTrendingDown />
                        }
                        {data?.growth}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <h1>New Rejected Complaints: {data?.new}</h1>
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {data && data?.growth > 0 ?
                        <>Up this month <IconTrendingUp className="size-4" /></>
                        : <>Down this month <IconTrendingDown className="size-4" /></>
                    }
                </div>
                <div className="text-muted-foreground">
                    Overall growth:{data?.growth}
                </div>
            </CardFooter>
        </Card>
    )
}
