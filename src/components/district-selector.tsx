'use client'
import { FetchAllDistrict } from '@/app/dashboard/locations/districts/actions';
import SearchableDropdown from '@/components/shared/searchable-dropdown'
import { useDebounce } from '@/hooks/use-debounce';
import { District } from '@/validations/models/district-validation';
import { useEffect, useState } from 'react'


function DistrictSelector({ setDistrict, district = null, className, disable, clearCallBack }: { district: District | null; setDistrict: (x: District | null) => void, disable?: boolean; clearCallBack?: () => void; className?: string }) {
    const [data, setData] = useState<District[]>([])
    const [search, setSearch] = useState<string>('')
    const searchDebounce = useDebounce(search, 500);
    const [loading, setLoading] = useState<boolean>(true)

    const fetch = async () => {
        setLoading(true)
        const res = await FetchAllDistrict({ pageSize: 50, currentPage: 1, sortField: 'name', sortOrder: "asc", search: searchDebounce })
        if (res.success && res.data) {
            setData(res.data)
        } else {
            setData([])
        }
        setLoading(false)
    }
    const onChangeData = (item: District | null) => {
        if (item) {
            setDistrict(item)
        }
        else {
            setDistrict(null)
        }
    }

    useEffect(() => {
        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchDebounce])

    return (
        <SearchableDropdown
            data={data}
            onChangeData={onChangeData}
            search={search}
            setSearch={setSearch}
            rowId="district_id"
            disable={disable}
            rowName="name"
            clearCallBack={clearCallBack}
            lable='Select District'
            className={className}
            changedData={district}
            loading={loading}
        />
    )
}

export default DistrictSelector