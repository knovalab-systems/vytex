import { A } from '@solidjs/router';
import { Chart, Colors, Legend, LineController, LineElement, PointElement, Title, Tooltip, scales } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'solid-chartjs';
import { onMount } from 'solid-js';
import { Button } from '~/components/ui/Button';
import { ORDERS_PATH } from '~/constants/paths';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import { calculateStepSize } from '../helpers/calculate';
import type { CountOrdersBystateIdType, CountOrdersBystateType } from '../requests/commerceHome';

function OrdersByState(props: { data: CountOrdersBystateType, dataById: CountOrdersBystateIdType }) {
    const { getOrderStatus } = useOrderStatus();

    const total = () => props.data.reduce((p: number, v) => p + (v.count.id || 0), 0);
    const create = () => props.data.reduce((p: number, v) => p + (v.count.created_at || 0), 0);
    const start = () => props.data.reduce((p: number, v) => p + (v.count.started_at || 0), 0);

    const dataset = () => {
        const filteredOrderStatus = getOrderStatus()
            .filter(v => props.dataById.map(e => e.order_state_id).includes(v.id));

        const labels = filteredOrderStatus.map(v => v.name);
        const data = filteredOrderStatus.map(v => {
            return props.dataById.find(e => e.order_state_id === v.id)?.count || 0;
        });

        labels.unshift('Creadas', 'Iniciadas');
        data.unshift(create(), start());

        return { labels, data };
    };

    const lineChartData = () => {
        const { labels, data } = dataset();
        return {
            labels,
            datasets: [
                {
                    label: 'Estado',
                    data,
                    backgroundColor: ['#34d399', '#f87171', '#60a5fa', '#818cf8'],
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15,
                    pointBorderColor: 'white',
                    segment: {
                        borderColor: (ctx: { p0DataIndex: number; }) => {
                            const colors = ['#34d399', '#f87171', '#60a5fa', '#818cf8'];
                            return colors[ctx.p0DataIndex % colors.length];
                        },
                    },
                },
            ],
        };
    }

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                font: {
                    size: 18,
                },
                text: 'Ordenes por estado',
            },
            datalabels: {
                display: 'auto',
                color: 'white',
                font: {
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                suggestedMin: total(),
                suggestedMax: total() * 1.20,
                ticks: {
                    stepSize: calculateStepSize(total()),
                }
            }
        }
    };

    onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors, ChartDataLabels, LineController, LineElement, PointElement);
    });


    return (
        <div class='flex p-4 flex-col md:flex-row shadow-md bg-white rounded-md gap-4'>
            <div class='w-full font-mono font-bold m-auto text-center'>
                <h2 class='text-2xl'>Total ordenes</h2>
                <p class='text-3xl mb-4'>{total()}</p>
                <Button variant='action'>
                    <A href={ORDERS_PATH}>Navegar a ordenes</A>
                </Button>
            </div>
            <div class='w-full'>
                <Line data={lineChartData()} options={lineChartOptions} width={600} />
            </div>
        </div>
    );
}

export default OrdersByState;