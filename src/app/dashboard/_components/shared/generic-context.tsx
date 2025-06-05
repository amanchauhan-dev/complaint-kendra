// context.tsx

'use client';

import { FetchMultipleRequest, FetchMultipleRespone } from "@/lib/server-types";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useState,
    useContext,
} from "react";

export type GenericContextProps<T> = {
    // pagination
    currentPage: number;
    setCurrentPage: (x: number) => void;
    pageSize: number;
    totalData: number;
    setTotalData: (x: number) => void;
    setPageSize: (size: number) => void;
    // data
    data: T[];
    setData: Dispatch<SetStateAction<T[]>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fetchData: (x: FetchMultipleRequest) => void;
    // new data
    appendData: (item: T) => void;
    // filter
    search: string;
    setSearch: (x: string) => void;
    sortField: string;
    setSortFiled: (field: string) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    refresh: () => void;
    refreshKey: number;
};


export function createGenericContext<T>() {
    const Context = createContext<GenericContextProps<T> | undefined>(undefined);
    const useGenericContext = () => {
        const ctx = useContext(Context);
        if (!ctx) { throw new Error("useGenericContext must be used within its Provider") }
        return ctx;
    };


    const GenericProvider = ({
        children,
        fetchFunction,
        defaultSortField = "created_at",
        defaultSortOrder = "desc",
    }: {
        children: React.ReactNode;
        fetchFunction: (x: FetchMultipleRequest) => Promise<FetchMultipleRespone<T[]>>;
        defaultSortField?: string;
        defaultSortOrder?: string;
    }) => {
        const [loading, setLoading] = useState(false);
        const [data, setData] = useState<T[]>([]);
        const [sortField, setSortFiled] = useState<string>(defaultSortField);
        const [sortOrder, setSortOrder] = useState<string>(defaultSortOrder);
        const [pageSize, setPageSize] = useState<number>(10);
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [totalData, setTotalData] = useState<number>(0);
        const [search, setSearch] = useState<string>('');
        const [refreshKey, setRefreshKey] = useState<number>(0);

        const fetchData = async (obj: FetchMultipleRequest) => {
            try {
                setLoading(true)
                const res = await fetchFunction(obj);

                if (res.data && res.success) {
                    setData(res.data || [])
                }
                else {
                    setData([])
                }
                if (res.success && res.pagination) {
                    setTotalData(res.pagination.total)
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const appendData = (item: T) => {
            setData((prev) => [item, ...prev]);
        };

        const refresh = () => setRefreshKey(e => e + 1)
        return (
            <Context.Provider
                value={{
                    data,
                    setData,
                    loading,
                    setLoading,
                    fetchData,
                    appendData,
                    sortField,
                    setSortFiled,
                    sortOrder,
                    setSortOrder,
                    pageSize,
                    setPageSize,
                    currentPage,
                    setCurrentPage,
                    totalData,
                    setTotalData,
                    search,
                    setSearch,
                    refresh,
                    refreshKey
                }}
            >
                {children}
            </Context.Provider>
        );
    };

    return { useGenericContext, GenericProvider, Context };
}
