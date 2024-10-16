import * as echarts from 'echarts';
import {useEffect, useRef} from "react";

const StackedLineChart = ({ data, instrumentType }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const series =[
            {
                name: 'Gage1',
                type: 'line',
                stack: 'Total',
                data: data.map(item => item.gage1),
            }
        ];

        // 계측기별 추가 측정값
        if (instrumentType !== 'D') {
            series.push(
                {
                    name: 'Gage2',
                    type: 'line',
                    stack: 'Total',
                    data: data.map(item => item.gage2),
                },
                {
                    name: 'Gage3',
                    type: 'line',
                    stack: 'Total',
                    data: data.map(item => item.gage3),
                }
            );
        }

        if (instrumentType === 'E') {
            series.push({
                name: 'Gage4',
                type: 'line',
                stack: 'Total',
                data: data.map(item => item.gage4),
            });
        }

        if (instrumentType === 'F') {
            series.push({
                name: 'Crack Width',
                type: 'line',
                stack: 'Total',
                data: data.map(item => item.crackWidth)
            })
        }

        const option = {
            title: { text: '' },
            tooltip: { trigger: 'axis' },
            legend: { data: series.map(s => s.name), }, // 이름 자동으로 추가 해주는거
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.map(item => item.date),
            },
            yAxis: { type: 'value' },
            series,
        };

        chartInstance.setOption(option);

        return () => {
            chartInstance.dispose();
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default StackedLineChart;
