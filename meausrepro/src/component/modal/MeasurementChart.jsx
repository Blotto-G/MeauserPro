import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

const MeasurementChart = ({ instrumentId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Measurement Values',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/measurements/${instrumentId}`);
                const data = response.data;

                const labels = data.map((item) => item.date);
                const values = data.map((item) => item.value);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Measurement Values',
                            data: values,
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                });
                setError(null);
            } catch (error) {
                console.error('Error fetching measurement data:', error);
                setError('Failed to fetch measurement data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [instrumentId]);

    const chartRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => chartRef.current,
        documentTitle: `Measurement_Chart_${instrumentId}`, // PDF의 제목 설정
        onAfterPrint: () => console.log('PDF printed!'), // 인쇄 후 로그
    });

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Measurement Data Chart</h2>
            {loading && <p>Loading data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div ref={chartRef}>
                <Line
                    data={chartData}
                    options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            x: {
                                type: 'time',
                                title: {
                                    display: true,
                                    text: 'Date',
                                },
                                time: {
                                    unit: 'day',
                                    tooltipFormat: 'll', // Tooltip 날짜 형식
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Value',
                                },
                                beginAtZero: true,
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            },
                        },
                    }}
                    height={400}
                />
            </div>
            <button onClick={handlePrint}>Print to PDF</button>
        </div>
    );
};

export default MeasurementChart;
