import { ArcElement, BarElement, Chart, Colors, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie } from 'solid-chartjs';
import { onMount } from 'solid-js';
import type { CountUsersByStateType } from '../requests/adminHome';

function UsersByState(props: { data: CountUsersByStateType }) {
	const totalUsers = () => props.data.reduce((p: number, v) => p + (v.count.id || 0), 0);
	const inactiveUsers = () => props.data.reduce((p: number, v) => p + (v.count.deleted_at || 0), 0);
	const activeUsers = () => totalUsers() - inactiveUsers();

	const pieChartData = () => ({
		labels: ['Activos', 'Inactivos'],
		datasets: [
			{
				label: 'Estado',
				data: [activeUsers(), inactiveUsers()],
				backgroundColor: ['#34d399', '#f87171'],
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
				text: 'Usuarios por estado',
			},
			datalabels: {
				display: 'auto',
				color: 'white',
				font: {
					weight: 'bold',
				},
				// biome-ignore lint/suspicious/noExplicitAny: no types included
				formatter: (value: number, ctx: any) => {
					const total = ctx.chart.getDatasetMeta(0).total;
					const percentage = `${((value * 100) / total).toFixed(2)}%`;
					return percentage;
				},
			},
		},
	};

	const barChartData = () => ({
		labels: ['Total'],
		datasets: [
			{
				label: 'Usuarios',
				data: [totalUsers()],
				backgroundColor: '#73C5C5',
				borderWidth: 2,
				borderRadius: 5,
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
				text: 'Total de usuarios',
			},
			datalabels: {
				display: false,
				color: '#FFF',
			},
		},
	};

	onMount(() => {
		Chart.register(Title, Tooltip, Legend, Colors, ChartDataLabels, LinearScale, BarElement, ArcElement);
	});

	return (
		<div class='flex p-4 flex-col md:flex-row   shadow-md bg-white rounded-md gap-4'>
			<div class='w-full'>
				<Bar data={barChartData()} options={barChartOptions} width={300} height={300} />
			</div>
			<div class='w-full'>
				<Pie data={pieChartData()} options={pieChartOptions} width={300} height={300} />
			</div>
		</div>
	);
}

export default UsersByState;
