import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';

function App() {
    const [data, setData] = useState([]);

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
        <>
            <h1>Csv Previewer</h1>
            <form>
                <label htmlFor="csvFile">Upload CSV file:</label>
                <input
                    type="file"
                    id="csvFile"
                    accept=".csv"
                    onChange={handleFileChange}
                />
            </form>
            {data.length > 0 && (
                <div>
                    <h2>CSV Data Preview</h2>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, index) => (
                                        <td key={index}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {data.length === 0 && (
                <p>No data to display. Please upload a CSV file.</p>
            )}
        </>
    );
}

export default App;
