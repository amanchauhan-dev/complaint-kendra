'use client'
import { FetchAllTaluka } from '@/app/dashboard/locations/talukas/actions';
import SearchableDropdown from '@/components/shared/searchable-dropdown'
import { useDebounce } from '@/hooks/use-debounce';
import { Taluka } from '@/validations/models/taluka-validation';
import { useEffect, useState } from 'react'


function TalukaSelector({
    setTaluka,
    taluka,
    district_id = '',
    subdivision_id = '',
    disable,
    clearCallBack,
    className
}: {
    taluka: Taluka | null;
    setTaluka: (x: Taluka | null) => void;
    subdivision_id?: string,
    district_id?: string,
    disable?: boolean;
    clearCallBack?: () => void;
    className?: string
}) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<Taluka[]>([])
    const [search, setSearch] = useState<string>('')
    const searchDebounce = useDebounce(search, 500);

    const onChangeData = (item: Taluka | null) => {
        setTaluka(item ?? null)
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const where = []

            if (district_id?.trim().length > 0) {
                where.push({ key: "district_id", value: district_id })
            }

            const res = await FetchAllTaluka({
                pageSize: 50,
                currentPage: 1,
                sortField: 'name',
                sortOrder: "asc",
                search: searchDebounce,
                where,
            })

            if (res.success && res.data) {
                setData(res.data)
            } else {
                setData([])
            }
            setLoading(false)
        }

        fetch()
    }, [searchDebounce, district_id, subdivision_id])

    return (
        <SearchableDropdown
            data={data}
            onChangeData={onChangeData}
            search={search}
            setSearch={setSearch}
            changedData={taluka}
            rowId="taluka_id"
            rowName="name"
            className={className}
            disable={disable}
            lable='Select Taluka'
            clearCallBack={clearCallBack}
            loading={loading}
        />
    )
}

export default TalukaSelector
