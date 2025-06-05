export type GeneralResponse<T> = {
    success: boolean;
    error?: any;
    data?: T
}

export type FetchMultipleRespone<T> = {
    success: boolean;
    data?: T;
    pagination?: {
        currentPage: number;
        total: number;
        pageSize: number;
        totalPages?: number;
    }
    error?: any;
}

export type FetchMultipleRequest = {
    currentPage: number;
    pageSize: number;
    sortOrder: "asc" | "desc";
    sortField: string;
    search: string;
    where?: {
        key: string;
        value: string;
    }[]
}
