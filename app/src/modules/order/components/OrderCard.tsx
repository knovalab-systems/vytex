import { A, useNavigate } from '@solidjs/router';
import { For, Show } from 'solid-js';
import LitsTile from '~/components/LitsTile';
import { Button } from '~/components/ui/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { Timeline } from '~/components/ui/Timeline';
import { CUSTOMS_PATH, ORDERS_PATH } from '~/constants/paths';
import { SIZES } from '~/constants/sizes';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetOrder } from '../request/orderGet';

function OrderCard(props: { order: GetOrder }) {
	const navigate = useNavigate();

	const timelineArr = () => {
		const arr = [
			{
				title: 'Fecha de creación',
				description: parseDateTimeHuman(props.order.created_at),
			},
			{
				title: 'Fecha de inicio',
				description: parseDateTimeHuman(props.order.started_at),
			},
			props.order.canceled_at
				? {
						title: 'Fecha de cancelación',
						description: parseDateTimeHuman(props.order.canceled_at),
					}
				: {
						title: 'Fecha de finalización',
						description: parseDateTimeHuman(props.order.finished_at),
					},
		];

		return arr;
	};

	const handleBack = () => navigate(ORDERS_PATH);

	return (
		<div class='m-auto md:w-2/3 2xl:w-3/5 overflow-auto'>
			<div class='m-4 p-8 space-y-4 bg-white border-gray-100 shadow-md rounded-md border'>
				<h1 class='text-2xl font-bold text-center mb-4'>Detalles de la orden: {props.order.id}</h1>
				<div class='flex flex-col md:flex-row gap-4'>
					<div class='grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8 flex-1 whitespace-nowrap'>
						<LitsTile support='Estado' title={props.order.order_state?.name} />
						<LitsTile support='Cliente' title={props.order.custom?.client} />
						<A href={`${CUSTOMS_PATH}/${props.order?.custom?.id ?? ''}`}>
							<LitsTile
								support='Pedido'
								title={props.order.custom?.id.toString()}
								classTitle='text-blue-600 font-semibold underline'
							/>
						</A>
						<LitsTile support='Creado por' title={props.order.create_user?.name} />
						<Show when={props.order.cancel_user}>
							<LitsTile support='Cancelado por' title={props.order.cancel_user?.name} />
						</Show>
					</div>
					<div class='md:mx-auto'>
						<Timeline bulletSize={20} items={timelineArr()} activeItem={2} />
					</div>
				</div>
				<h2 class='text-xl font-semibold text-center'>Cantidad por talla</h2>
				<TableContainer>
					<Table>
						<TableHeader>
							<TableHead>Referencia</TableHead>
							<For each={SIZES}>{size => <TableCell>{size}</TableCell>}</For>
						</TableHeader>
						<TableBody class='bg-white'>
							<TableRow class='bg-white group'>
								<TableCell>
									<div
										class='h-10 w-10 border-2'
										title={props.order.color_by_reference?.color?.name || ''}
										style={{
											background: props.order.color_by_reference?.color?.hex || '',
										}}
									/>
									<div class='my-auto'>{props.order.color_by_reference?.reference?.code}</div>
								</TableCell>
								<For each={SIZES}>{size => <TableCell>{props.order[size]}</TableCell>}</For>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			<div class='flex m-4 justify-between'>
				<Button onClick={handleBack} type='button' variant='secondary'>
					Volver
				</Button>
			</div>
		</div>
	);
}

export default OrderCard;
