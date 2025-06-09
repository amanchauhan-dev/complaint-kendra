'use client'

import { FetchAllSubdivisions } from '@/app/dashboard/locations/subdivisions/actions';
import SearchableDropdown from '@/components/shared/searchable-dropdown'
import { useDebounce } from '@/hooks/use-debounce';
import { Subdivision } from '@/validations/models/sdm-validation';
import { useEffect, useState } from 'react'

function SubdivionSelector({
    setSubdivion,
    subdivion = null,
    district_id = '',
    className,
    disable,
    clearCallBack
}: {
    subdivion: Subdivision | null;
    setSubdivion: (x: Subdivision | null) => void;
    district_id?: string;
    disable?: boolean;
    clearCallBack?: () => void;
    className?: string;
}) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<Subdivision[]>([])
    const [search, setSearch] = useState<string>('')
    const searchDebounce = useDebounce(search, 500);

    const onChangeData = (item: Subdivision | null) => {
        setSubdivion(item ?? null);
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const where = [];
            if (district_id?.trim().length > 0) {
                where.push({ key: "district_id", value: district_id });
            }

            const res = await FetchAllSubdivisions({
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
    }, [searchDebounce, district_id]);

    return (
        <SearchableDropdown
            data={data}
            onChangeData={onChangeData}
            search={search}
            setSearch={setSearch}
            changedData={subdivion}
            rowId="subdivision_id"
            rowName="name"
            lable="Select Subdivision"
            clearCallBack={clearCallBack}
            disable={disable}
            loading={loading}
            className={className}
        />
    )
}

export default SubdivionSelector;
