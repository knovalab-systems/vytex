import { BarElement, Chart, Colors, Legend, LinearScale, Title, Tooltip, scales } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'solid-chartjs';
import { onMount } from 'solid-js';
import type { CountCustomsByClientType } from '../requests/commerceHome';

function CustomsByClient(props: { data: CountCustomsByClientType }) {
    const dataset = () => {
        return props.data.reduce(
            (acc: { labels: string[], data: number[] }, v) => {
                acc.labels.push(v.client ?? '');
                acc.data.push(v.count.client ?? 0);
                return acc;
            },
            { labels: [], data: [] }
        );
    };

    const barChartData = () => ({
        labels: dataset().labels,
        datasets: [
            {
                label: 'Cantidad de pedidos',
                data: dataset().data,
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
                borderColor: '#5752D1',
                backgroundColor: ['#34d399', '#f87171', '#60a5fa', '#818cf8'],
            },
        ],
    });

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                font: {
                    size: 18,
                },
                text: 'Top clientes',
            },
            datalabels: {
                display: false,
                color: '#FFF',
            },
        },
    };

    onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors, ChartDataLabels, LinearScale, BarElement);
    });

    return (
        <div class='flex p-4 shadow-md bg-white rounded-md gap-4'>
            <Bar data={barChartData()} options={barChartOptions} height={200} />
        </div>
    );
}

export default CustomsByClient;
