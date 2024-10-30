import { Chart, Colors, Legend, Title, Tooltip, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'solid-chartjs';
import { onMount } from 'solid-js';
import { useRoles } from '~/hooks/useRoles';
import type { CountUsersByRoleIdType } from '../requests/adminHome';

function UsersByRole(props: { data: CountUsersByRoleIdType }) {
	const { getRoles } = useRoles();
	const dataset = () =>
		getRoles().reduce(
			(p: { labels: string[]; data: number[] }, v) => {
				p.labels.push(v.name);
				p.data.push(props.data.find(e => e.role_id === v.id)?.count || 0);
				return p;
			},
			{ labels: [], data: [] },
		);

	const barChartData = () => ({
		labels: dataset().labels,
		datasets: [
			{
				label: 'Usuarios',
				data: dataset().data,
				borderWidth: 2,
				borderRadius: 5,
				borderSkipped: false,
				borderColor: '#5752D1',
				backgroundColor: '#8481DD',
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
				text: 'Usuarios por rol',
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
			<Bar data={barChartData()} options={barChartOptions} width={300} height={300} />
		</div>
	);
}

export default UsersByRole;
