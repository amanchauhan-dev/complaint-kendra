'use client'

import { FetchAllDepartments } from '@/app/dashboard/departments-officers/departments/action';
import SearchableDropdown from '@/components/shared/searchable-dropdown'
import { useDebounce } from '@/hooks/use-debounce';
import { Department } from '@/validations/models/department-validation';
import { useEffect, useState } from 'react'

function DepartmentSelector({
    setDepartment,
    department = null,
    jurisdiction_id = '',
    className,
    disable,
    clearCallBack
}: {
    department: Department | null;
    setDepartment: (x: Department | null) => void;
    jurisdiction_id?: string;
    disable?: boolean;
    clearCallBack?: () => void;
    className?: string;
}) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<Department[]>([])
    const [search, setSearch] = useState<string>('')
    const searchDebounce = useDebounce(search, 500);

    const onChangeData = (item: Department | null) => {
        setDepartment(item ?? null);
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const where = [];
            if (jurisdiction_id?.trim().length > 0) {
                where.push({ key: "jurisdiction_id", value: jurisdiction_id });
            }

            const res = await FetchAllDepartments({
                pageSize: 50,
                currentPage: 1,
                sortField: 'name',
                sortOrder: 'asc',
                search: searchDebounce,
                where,
            });

            if (res.success && res.data) {
                setData(res.data);
            } else {
                setData([]);
            }
            setLoading(false)
        };

        fetch();
    }, [searchDebounce, jurisdiction_id]);

    return (
        <SearchableDropdown
            data={data}
            onChangeData={onChangeData}
            search={search}
            setSearch={setSearch}
            changedData={department}
            rowId="department_id"
            rowName="name"
            lable="Select Department"
            clearCallBack={clearCallBack}
            disable={disable}
            className={className}
            loading={loading}
        />
    )
}

export default DepartmentSelector;
