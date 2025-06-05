'use client'
import { FetchAllSubCategory } from '@/app/dashboard/categories/sub-categories/actions';
import SearchableDropdown from '@/components/shared/searchable-dropdown'
import { useDebounce } from '@/hooks/use-debounce';
import { Category } from '@/validations/models/category-validation';
import { useEffect, useState } from 'react'


function SubCategorySelector({
    category = null,
    setCategory,
    className,
    disable,
    clearCallBack,
    parent_id = ''
}: {
    category: Category | null;
    setCategory: (x: Category | null) => void,
    disable?: boolean;
    clearCallBack?: () => void;
    className?: string;
    parent_id?: string
}) {
    const [data, setData] = useState<Category[]>([])
    const [search, setSearch] = useState<string>('')
    const searchDebounce = useDebounce(search, 500);


    const onChangeData = (item: Category | null) => {
        setCategory(item ?? null);
    }

    useEffect(() => {
        const fetch = async () => {
            const where = [];
            if (parent_id?.trim().length > 0) {
                where.push({ key: "parent_id", value: parent_id });
            }
            const res = await FetchAllSubCategory({
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
        };

        fetch();
    }, [searchDebounce, parent_id]);

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
            lable='Select Sub Category'
            className={className}
            changedData={category}
        />
    )
}

export default SubCategorySelector