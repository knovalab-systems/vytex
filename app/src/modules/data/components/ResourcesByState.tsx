import { A } from '@solidjs/router';
import { ArcElement, Chart, Colors, Legend, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'solid-chartjs';
import { onMount } from 'solid-js';
import { Button } from '~/components/ui/Button';
import { RESOURCES_PATH } from '~/constants/paths';
import { calculatePercentage } from '../helpers/calculate';
import type { CountReferencesByStateType } from '../requests/designerHome';

function ResourcesByState(props: { data: CountReferencesByStateType }) {
	const total = () => props.data.reduce((p: number, v) => p + (v.count.id || 0), 0);
	const inactive = () => props.data.reduce((p: number, v) => p + (v.count.deleted_at || 0), 0);
	const active = () => total() - inactive();

	const pieChartData = () => ({
		labels: ['Activos', 'Inactivos'],
		datasets: [
			{
				label: 'Estado',
				data: [active(), inactive()],
				backgroundColor: ['#1ec3ea', '#a6988a'],
			},
		],
	});

	const pieChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: true,
				font: {
					size: 18,
				},
				text: 'Insumos por estado',
			},
			datalabels: {
				display: 'auto',
				color: 'white',
				font: {
					weight: 'bold',
				},
				formatter: calculatePercentage,
			},
		},
	};

	onMount(() => {
		Chart.register(Title, Tooltip, Legend, Colors, ChartDataLabels, ArcElement);
	});

	return (
		<div class='flex p-4 flex-col md:flex-row shadow-md bg-white rounded-md gap-4'>
			<div class='w-full font-mono font-bold m-auto text-center'>
				<h2 class='text-2xl'>Total de insumos</h2>
				<p class='text-3xl mb-4'>{total()}</p>
				<Button variant='action'>
					<A href={RESOURCES_PATH}>Navegar a insumos</A>
				</Button>
			</div>
			<div class='w-full'>
				<Pie data={pieChartData()} options={pieChartOptions} width={300} height={300} />
			</div>
		</div>
	);
}

export default ResourcesByState;