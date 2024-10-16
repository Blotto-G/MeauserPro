import React from 'react';
import { Bar, Line } from "react-chartjs-2";
import 'chart.js/auto';


function ChartTest() {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Chart.js Bar Chart",
            },
        },
    };

    const labels = ["January", "February", "March", "April", "May", "June", "July"];

    const data = {
        labels,
        datasets: [
            {
                label: "Dataset 1",
                data: [1, 6, 3, 2, 6, 1, 3],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Dataset 2",
                data: [2, 6, 1, 7, 9, 3, 5],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const options2 = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const data2 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false, // 배경을 채우지 않음
                borderColor: 'rgba(75, 192, 192, 1)', // 라인 색상
                tension: 0.1 // 선의 곡률, 0일 경우 직선
            },
        ],
    };


    return (
        <div className={'container'}>
            <Bar options={options} data={data} />
            <Line data={data2} options={options2} />
        </div>
    )
}

export default ChartTest;