import { For, Show } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { ORDERS_START_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import { usePolicies } from '~/hooks/usePolicies';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { Action } from '~/types/actionsCell';
import type { OrderState } from '~/types/core';
import type { GetOrdersType } from '../request/orderGet';

function OrderTable(props: { orders?: GetOrdersType }) {
	const { getOrderStatusRecord } = useOrderStatus();
	const { hasPolicy } = usePolicies();
	const { getColorsRecord } = useColors();
	const actions = (id: number, value: OrderState['value']) => {
		const arr: Action[] = [];
		if (value === 'created' && hasPolicy('StartOrder'))
			arr.push({
				path: `${ORDERS_START_PATH}/${id}`,
				title: 'Iniciar orden',
				label: 'Iniciar',
				icon: 'start',
			});
		return arr;
	};

	return (
		<TableContainer>
			<Table class='md:table-fixed'>
				<TableHeader class='sticky top-0 z-10'>
					<TableRow>
						<TableHead>Orden</TableHead>
						<TableHead>Pedido</TableHead>
						<TableHead>Referencia</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Fecha de creación</TableHead>
						<TableHead>Fecha de inicio</TableHead>
						<TableHead>Fecha de cancelación</TableHead>
						<TableHead>Fecha de finalización</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show when={(props.orders?.length ?? 0) === 0}>
						<TableRow class='bg-white'>
							<TableCell colspan={9}>No se han encontrado ordenes.</TableCell>
						</TableRow>
					</Show>
					<For each={props.orders}>
						{order => (
							<TableRow class='bg-white group'>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.custom_id}</TableCell>
								<TableCell class='inline-flex gap-2'>
									<div
										class='h-10 w-10 border-2'
										title={getColorsRecord()[order?.color_by_reference?.color_id as number]?.name || ''}
										style={{
											background: getColorsRecord()[order?.color_by_reference?.color_id as number]?.hex || '',
										}}
									/>
									<div class='my-auto'>{order.color_by_reference?.reference?.code}</div>
								</TableCell>
								<TableCell>{getOrderStatusRecord()[order.order_state_id].name}</TableCell>
								<TableCell>{parseDateTimeHuman(order.created_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(order.started_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(order.canceled_at)}</TableCell>
								<TableCell>{parseDateTimeHuman(order.finished_at)}</TableCell>
								<ActionsCell actions={actions(order.id, getOrderStatusRecord()[order.order_state_id].value)} />
							</TableRow>
						)}
					</For>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default OrderTable;
