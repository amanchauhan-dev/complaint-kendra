'use client'
import { FetchAllCategory } from '@/app/dashboard/categories/main-categories/actions';
import SearchableDropdown from '@/components/shared/searchable-dropdown'
import { useDebounce } from '@/hooks/use-debounce';
import { Category } from '@/validations/models/category-validation';
import { useEffect, useState } from 'react'


function ParentCategorySelector({ parentCategory = null, setParentCategory, className, disable, clearCallBack }: { parentCategory: Category | null; setParentCategory: (Category: Category | null) => void, disable?: boolean; clearCallBack?: () => void; className?: string }) {
    const [data, setData] = useState<Category[]>([])
    const [search, setSearch] = useState<string>('')
    const searchDebounce = useDebounce(search, 500);
    const [loading, setLoading] = useState<boolean>(true)

    const fetch = async () => {
        setLoading(true)
        const res = await FetchAllCategory({ pageSize: 50, currentPage: 1, sortField: 'name', sortOrder: "asc", search: searchDebounce })
        if (res.success && res.data) {
            setData(res.data)
        } else {
            setData([])
        }
        setLoading(false)
    }
    const onChangeData = (item: Category | null) => {
        if (item) {
            setParentCategory(item)
        }
        else {
            setParentCategory(null)
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
            rowId="category_id"
            disable={disable}
            rowName="name"
            clearCallBack={clearCallBack}
            lable='Select Category'
            className={className}
            changedData={parentCategory}
            loading={loading}
        />
    )
}

export default ParentCategorySelector