import { Chart, Colors, Legend, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie } from 'solid-chartjs';
import { onMount } from 'solid-js';
import type { CountRoleByCodeType } from '../requests/adminHome';

function RolesByCode(props: { data: CountRoleByCodeType }) {
	const totalRoles = () => props.data.reduce((p: number, v) => p + (v.count || 0), 0);
	const customRoles = () => props.data.find(e => e.code?.length === 0)?.count || 0;
	const systemRoles = () => totalRoles() - customRoles();

	const pieChartData = () => ({
		labels: ['Sistema', 'Personalizados'],
		datasets: [
			{
				label: 'Total',
				data: [systemRoles(), customRoles()],
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
				text: 'Roles por origen',
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
				label: 'Roles',
				data: [totalRoles()],
				backgroundColor: '#F6D173',
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
				text: 'Total de roles',
			},
			datalabels: {
				display: false,
				color: '#FFF',
			},
		},
	};

	onMount(() => {
		Chart.register(Title, Tooltip, Legend, Colors, ChartDataLabels);
	});

	return (
		<div class='flex flex-col md:flex-row p-4 shadow-md bg-white rounded-md gap-4'>
			<div class='w-full'>
				<Pie data={pieChartData()} options={pieChartOptions} width={300} height={300} />
			</div>
			<div class='w-full'>
				<Bar data={barChartData()} options={barChartOptions} width={300} height={300} />
			</div>
		</div>
	);
}

export default RolesByCode;
