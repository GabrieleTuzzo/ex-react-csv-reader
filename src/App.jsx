import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';

function App() {
    const [data, setData] = useState([]);
    const [skipEmpty, setSkipEmpty] = useState(false);

    // Pagination state and Indexes
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
                <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                    Csv Previewer
                </h1>
                <form className="flex flex-col items-center">
                    <label
                        htmlFor="csvFile"
                        className="text-gray-700 text-l font-semibold border-2 border-gray-300 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            {data.length > 0 && (
                <div className="mt-6 w-full max-w-5xl">
                    <div className="flex items-center justify-between mb-4 align-items-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            CSV Data Preview
                        </h2>
                        <button
                            onClick={() => setSkipEmpty((prev) => !prev)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {skipEmpty
                                ? 'Show All Rows'
                                : 'Hide Rows With Empty Fields'}
                        </button>
                    </div>
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="table-auto min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th
                                            key={key}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data
                                    .slice(startIdx, endIdx)
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
                                                            } px-6 py-4 whitespace-nowrap text-sm text-gray-700`}
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
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="text-white bg-blue-600 rounded px-3"
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
                        </button>
                        <span>
                            {currentPage} of{' '}
                            {Math.ceil(data.length / rowsPerPage)}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={endIdx >= data.length}
                            className="text-2xl text-white bg-blue-600 rounded px-3"
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
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
