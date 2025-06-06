"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "../ui/skeleton";

export type Column<T> = {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
    colSpan?: number;
    alignment?: "left" | "center" | "right";
};


type GeneralTableProps<T extends { [key: string]: any }> = {
    columns: Column<T>[];
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    rowId?: keyof T;
    loading?: boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
    onPageChange: (page: number) => void;
};

export function GeneralTable<T extends { [key: string]: any }>({
    columns,
    data,
    totalCount,
    page,
    pageSize,
    rowId = "id",
    loading,
    onSelectionChange,
    onPageChange,
}: GeneralTableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const totalColSpan = useCallback(() => {
        let count = columns.length + 1;
        columns.forEach(e => {
            if (e.colSpan && e.colSpan >= 2) { count++ }
        })
        return count;
    }, [columns])()

    useEffect(() => {
        // Reset selection on page change
        setSelectedIds(new Set());
        onSelectionChange?.([]);

    }, [page, onSelectionChange]);

    const isAllSelected =
        data.length > 0 &&
        data.every((row) => selectedIds.has(String(row[rowId])));

    const toggleSelectAll = () => {
        const newSet = new Set(selectedIds);
        if (isAllSelected) {
            data.forEach((row) => newSet.delete(String(row[rowId])));
        } else {
            data.forEach((row) => newSet.add(String(row[rowId])));
        }
        setSelectedIds(newSet);
        onSelectionChange?.(data.filter((row) => newSet.has(String(row[rowId]))));
    };

    const toggleRow = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
        onSelectionChange?.(data.filter((row) => newSet.has(String(row[rowId]))));
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="w-full overflow-x-auto space-y-4">
            <div className="overflow-x-auto rounded-xl border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px] bg-muted pl-4 md:pl-6">
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            {columns.map((col, i) => (
                                <TableHead
                                    key={i}
                                    colSpan={col.colSpan || 1}
                                    className={cn("bg-muted last:pr-4 last:md:pr-6", {
                                        "text-left": col.alignment === "left",
                                        "text-center": col.alignment === "center",
                                        "text-right": col.alignment === "right",
                                    })}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ?
                            Array.from({ length: 8 }).map((_, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell colSpan={totalColSpan} className="">
                                            <Skeleton className="w-full h-10" />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => {
                                    const id = String(row[rowId]);
                                    return (
                                        <TableRow key={id}>
                                            <TableCell className="w-[40px] pl-4 md:pl-6">
                                                <Checkbox
                                                    checked={selectedIds.has(id)}
                                                    onCheckedChange={() => toggleRow(id)}
                                                />
                                            </TableCell>
                                            {columns.map((col, colIndex) => (
                                                <TableCell
                                                    key={colIndex}
                                                    align={col.alignment || "left"}
                                                    className="last:pr-4 last:md:pr-6"
                                                    colSpan={col.colSpan || 1}
                                                >
                                                    {col.render
                                                        ? col.render(row[col.accessor], row)
                                                        : String(row[col.accessor] ?? "")}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })
                            )}
                    </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
