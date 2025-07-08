import { useState } from 'react';

export default function usePagination(
    dataLength,
    initialPage = 1,
    initialPageSize = 10
) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const pageStartIndex = (currentPage - 1) * pageSize;
    const pageEndIndex = pageStartIndex + pageSize;
    const pagesNumber = Math.ceil(dataLength / pageSize);

    const nextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const previousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const resetPagination = () => {
        setCurrentPage(initialPage);
        setPageSize(initialPageSize);
    };

    return {
        pagesNumber,
        pageStartIndex,
        pageEndIndex,
        currentPage,
        pageSize,
        nextPage,
        previousPage,
        resetPagination,
        setCurrentPage,
        setPageSize,
    };
}
