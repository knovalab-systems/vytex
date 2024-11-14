import { A } from "@solidjs/router";
import { Chart, Colors, Legend, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'solid-chartjs';
import { onMount } from 'solid-js';
import { Button } from '~/components/ui/Button';
import { ORDERS_PATH } from '~/constants/paths';
import { formatDateToDayMonth } from "~/lib/parseTime";
import type { CountCustomsByDateType } from "../requests/commerceHome";

function CustomsByDate(props: { data: CountCustomsByDateType }) {
    const total = () => props.data.length;

    const groupByDate = (data: CountCustomsByDateType) => {
        return data.reduce((acc: Record<string, number>, v) => {
            const date = formatDateToDayMonth(v.created_at ?? '');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    };

    const dataset = () => {
        const groupedData = groupByDate(props.data);
        const dates = Object.keys(groupedData).slice(-7);
        const counts = dates.map(date => groupedData[date]);

        return { labels: dates, data: counts };
    };

    const lineChartData = () => {
        const { labels, data } = dataset();
        return {
            labels,
            datasets: [
                {
                    label: 'Cantidad de pedidos',
                    data,
                    backgroundColor: '#60a5fa',
                    borderColor: '#3b82f6',
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15,
                    pointBorderColor: 'white',
                },
            ],
        };
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                font: {
                    size: 18,
                },
                text: 'Pedidos por día',
            },
            datalabels: {
                display: 'auto',
                color: 'white',
                font: {
                    weight: 'bold',
                },
            },
        },
    };

    onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors, ChartDataLabels, LineController, LineElement, PointElement);
    });

    return (
        <div class='flex p-4 flex-col md:flex-row shadow-md bg-white rounded-md gap-4'>
            <div class='w-full'>
                <Line data={lineChartData()} options={lineChartOptions} width={700} height={400} />
            </div>
            <div class='w-auto md:w-1/4 font-mono font-bold m-auto text-center'>
                <h2 class='text-2xl'>Total Pedidos</h2>
                <p class='text-3xl mb-4'>{total()}</p>
                <Button variant='action'>
                    <A href={ORDERS_PATH}>Navegar a pedidos</A>
                </Button>
            </div>
        </div>
    );
}

export default CustomsByDate;