import { A, useNavigate } from '@solidjs/router';
import { For, Show } from 'solid-js';
import LitsTile from '~/components/LitsTile';
import { Button } from '~/components/ui/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { Timeline } from '~/components/ui/Timeline';
import { CUSTOMS_PATH, ORDERS_CREATE_PATH, ORDERS_PATH } from '~/constants/paths';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetCustomType } from '../requests/CustomGet';

function CustomCard(props: { custom: GetCustomType }) {
	const { getOrderStatusRecord } = useOrderStatus();
	const navigate = useNavigate();

	const handleCancel = () => navigate(CUSTOMS_PATH);
	const handleEdit = () => navigate(`${ORDERS_CREATE_PATH}/${props.custom?.id ?? ''}`);

	const timelineArr = () => {
		const arr = [
			{
				title: 'Fecha de creación',
				description: parseDateTimeHuman(props.custom.created_at),
			},
			props.custom.canceled_at
				? {
						title: 'Fecha de cancelación',
						description: parseDateTimeHuman(props.custom.canceled_at),
					}
				: {
						title: 'Fecha de finalización',
						description: parseDateTimeHuman(props.custom.finished_at),
					},
		];

		return arr;
	};
	return (
		<div class='flex flex-col md:w-1/2 2xl:w-2/5'>
			<div class='p-8 m-4 space-y-4 bg-white border-gray-100 shadow-md rounded-md border'>
				<h1 class='text-2xl font-bold text-center mb-4'>Detalles del pedido: {props.custom.id}</h1>
				<div class='flex flex-col md:flex-row gap-4'>
					<div class='flex flex-wrap gap-4 flex-1 whitespace-nowrap'>
						<LitsTile support='Cliente' title={props.custom.client} />
						<LitsTile support='Creado por' title={props.custom.create_user?.name} />
						<Show when={props.custom.cancel_user}>
							<LitsTile support='Cancelado por' title={props.custom.cancel_user?.name} />
						</Show>
					</div>
					<div class='md:mx-auto'>
						<Timeline bulletSize={20} items={timelineArr()} activeItem={2} />
					</div>
				</div>
				<h2 class='text-xl font-semibold text-center'>Órdenes</h2>
				<TableContainer>
					<Table>
						<TableHeader>
							<TableHead>Orden</TableHead>
							<TableHead>Referencia</TableHead>
							<TableHead>Estado</TableHead>
						</TableHeader>
						<TableBody class='bg-white'>
							<For each={props.custom.orders}>
								{order => (
									<TableRow class='bg-white group'>
										<TableCell>
											<A class=' text-blue-600 font-semibold text-lg underline' href={`${ORDERS_PATH}/${order.id}`}>
												{order.id}
											</A>
										</TableCell>
										<TableCell class='inline-flex gap-2'>
											<div
												class='h-10 w-10 border-2'
												title={order.color_by_reference?.color?.name || ''}
												style={{
													background: order.color_by_reference?.color?.hex || '',
												}}
											/>
											<div class='my-auto'>{order.color_by_reference?.reference?.code}</div>
										</TableCell>
										<TableCell>{getOrderStatusRecord()[order.order_state_id].name}</TableCell>
									</TableRow>
								)}
							</For>
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			<div class='flex m-4 justify-between'>
				<Button type='button' onclick={handleCancel} variant='secondary'>
					Volver
				</Button>
				<Button type='button' onclick={handleEdit} variant='action'>
					Agregar orden
				</Button>
			</div>
		</div>
	);
}

export default CustomCard;
