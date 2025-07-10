import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';
// Custom hooks
import usePagination from './hooks/usePagination';
import useSorting from './hooks/useSorting';
// Custom components
import Button from './components/Button';

function App() {
    const [data, setData] = useState([]);
    const [skipEmpty, setSkipEmpty] = useState(false);

    // Calculate the number of columns based on the first row of data
    const columnCount = data.length > 0 ? Object.keys(data[0]).length : 0;
    const colWidthClass = `w-[${(100 / columnCount).toFixed(4)}%]`;

    // Sorting hook
    const { sortedArray, updateSortingOrder, sortingOptions } = useSorting(
        data,
        {
            orderBy: '',
            orderAsc: true,
        }
    );

    // Pagination custom hook
    const {
        currentPage,
        nextPage,
        previousPage,
        pageStartIndex,
        pageEndIndex,
        pagesNumber,
    } = usePagination(data.length, 1, 10);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        if (file.type !== 'text/csv') {
            console.error('Selected file is not a CSV file');
            return;
        }
        console.log('Selected file:', file);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                console.log('Parsed results:', results);
                setData(results.data);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
            },
        });
    };

    const manageOrderIcons = (key) => {
        if (sortingOptions.orderBy !== key) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4"
                >
                    <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                </svg>
            );
        }

        return sortingOptions.orderAsc ? (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
            >
                <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                />
            </svg>
        ) : (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
            >
                <path
                    fillRule="evenodd"
                    d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                    clipRule="evenodd"
                />
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
                <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                    Csv Previewer
                </h1>
                <form className="flex flex-col items-center">
                    <label
                        htmlFor="csvFile"
                        className="text-gray-700 text-l font-semibold border-2 border-gray-300 py-1 px-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                        Upload CSV file
                    </label>
                    <input
                        type="file"
                        id="csvFile"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </form>
            </div>

            {sortedArray.length > 0 && (
                <div className="mt-6 w-full">
                    <div className="flex items-center justify-between mb-4 align-items-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            CSV Data Preview
                        </h2>
                        <Button onClick={() => setSkipEmpty((prev) => !prev)}>
                            {skipEmpty
                                ? 'Show All Rows'
                                : 'Hide Rows With Empty Fields'}
                        </Button>
                    </div>
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="table-fixed min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th
                                            onClick={() =>
                                                updateSortingOrder(key)
                                            }
                                            key={key}
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100
                                            ${colWidthClass} truncate overflow-hidden`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {key}

                                                {manageOrderIcons(key)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedArray
                                    .slice(pageStartIndex, pageEndIndex)
                                    .map((row, index) => {
                                        if (
                                            skipEmpty &&
                                            Object.values(row).some(
                                                (value) => value === ''
                                            )
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <tr
                                                key={index}
                                                className="border-none even:bg-gray-50 odd:bg-white"
                                            >
                                                {Object.values(row).map(
                                                    (value, index) => (
                                                        <td
                                                            key={index}
                                                            className={`${
                                                                value
                                                                    ? ''
                                                                    : 'bg-red-100'
                                                            } px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${colWidthClass} truncate overflow-hidden max-w-2xl`}
                                                        >
                                                            {value}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-2 flex justify-center gap-5">
                        <Button
                            onClick={() => previousPage()}
                            disabled={currentPage === 1}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                />
                            </svg>
                        </Button>
                        <span>
                            {currentPage} of {pagesNumber}
                        </span>
                        <Button
                            onClick={() => nextPage()}
                            disabled={currentPage >= pagesNumber}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
