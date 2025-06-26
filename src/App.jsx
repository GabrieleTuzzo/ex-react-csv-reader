import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';

function App() {
    const [data, setData] = useState([]);
    const [skipEmpty, setSkipEmpty] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
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
                        for="csvFile"
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
                <>
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
                            <table className="min-w-full divide-y divide-gray-200">
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
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((row, index) => {
                                        if (
                                            skipEmpty &&
                                            Object.values(row).some(
                                                (value) => value === ''
                                            )
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <tr key={index}>
                                                {Object.values(row).map(
                                                    (value, index) => (
                                                        <td
                                                            key={index}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
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
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
