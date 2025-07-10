import { useEffect, useState } from 'react';

export default function useSorting(array, options = {}) {
    const [sortedArray, setSortedArray] = useState(array);
    const [sortingOptions, setSortingOptions] = useState(options);

    useEffect(() => {
        if (!Array.isArray(array) || array.length === 0) {
            setSortedArray([]);
            return;
        }

        const { orderBy, orderAsc } = sortingOptions;

        if (!orderBy) {
            setSortedArray(array);
            return;
        }

        const sorted = [...array].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) {
                return orderAsc === true ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return orderAsc === true ? 1 : -1;
            }
            return 0;
        });

        setSortedArray(sorted);
    }, [array, sortingOptions]);

    function updateSortingOrder(newOrderBy) {
        const { orderBy } = sortingOptions;

        if (orderBy === newOrderBy) {
            setSortingOptions((prev) => ({
                ...prev,
                orderAsc: !prev.orderAsc,
            }));
        } else {
            setSortingOptions({
                orderBy: newOrderBy,
                orderAsc: true,
            });
        }

        console.log('Sorting options updated:', {
            ...sortingOptions,
        });
    }

    return { sortedArray, sortingOptions, updateSortingOrder };
}
